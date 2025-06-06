"use client";

import React, { useState, useEffect, use } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { ProductForm } from "@/types";
import Uploader from "@/components/fragments/file/Uploader";
import AdminLayout from "@/components/admin/AdminLayout";
import { qc } from "@/app/AppLayout";
import Link from "next/link";
import Loading from "@/components/fragments/ui/Loading";
import ErrorPage from "@/components/fragments/ui/Error";

const EditProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [files, setFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    category: "",
    imageUrl: "/imgs/icon.png",
    inStock: true,
    quantity: "0",
    tags: "",
  });

  // Fetch product data
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery(
    {
      queryKey: ["admin-product", id],
      queryFn: async () => {
        const response = await fetch(`/api/admin/products/${id}`);
        if (!response.ok) {
          toast.error("Product update failed");
          return;
        }
        return response.json();
      },
    },
    qc
  );

  // Update form data when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        currency: product.currency,
        category: product.category,
        imageUrl: product.imageUrl,
        inStock: product.inStock,
        quantity: product.quantity.toString(),
        tags: product.tags.join(", "),
      });
    }
  }, [product]);

  // Update product mutation
  const updateProduct = useMutation(
    {
      mutationFn: async (productData: any) => {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          toast.error("Product update failed");
          return;
        }

        return response.json();
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin-products"] });
        toast.success("Product updated successfully");
        setTimeout(() => {
          window.location.href = "/admin/products";
        }, 500);
      },
      onError: (error) => {
        toast.error(
          `Error: ${error instanceof Error ? error.message : "Failed to update product"}`
        );
      },
    },
    qc
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      currency: formData.currency,
      category: formData.category,
      imageUrl: formData.imageUrl,
      inStock: formData.inStock,
      quantity: parseInt(formData.quantity),
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      releaseDate: new Date().toISOString(),
    };

    updateProduct.mutate(productData);
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorPage />;

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
        <Link
          href="/admin/products"
          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currency">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image
              </label>
              <div className="py-2">
                {formData.imageUrl ? (
                  <Image
                    src={formData.imageUrl}
                    alt={formData.name}
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="px-4 py-2">No Image</div>
                )}
              </div>

              <Uploader
                files={files}
                setFiles={setFiles}
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tags">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                required
              />
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700" htmlFor="inStock">
                In Stock
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Link
              href="/admin/products"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProductPage; 