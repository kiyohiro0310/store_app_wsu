"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import DataTable from "datatables.net-dt";
import { Product, ProductForm } from "@/types";
import Uploader from "../../../components/fragments/file/Uploader";
import AdminLayout from "@/components/admin/AdminLayout";
import { qc } from "@/app/AppLayout";
import ErrorPage from "@/components/fragments/ui/Error";
import Loading from "@/components/fragments/ui/Loading";

const page = () => {
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
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

  // Fetch products
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery(
    {
      queryKey: ["admin-products"],
      queryFn: async () => {
        const response = await fetch("/api/admin/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      },
    },
    qc
  );

  // Create product mutation
  const createProduct = useMutation(
    {
      mutationFn: async (productData: Product) => {
        const response = await fetch("/api/admin/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        return response.json();
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin-products"] });
        toast.success("Product created successfully");
        closeModal();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      onError: (error) => {
        toast.error(
          `Error: ${error instanceof Error ? error.message : "Failed to create product"}`
        );
      },
    },
    qc
  );

  // Update product mutation
  const updateProduct = useMutation(
    {
      mutationFn: async ({ id, data }: { id: string; data: any }) => {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        return response.json();
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin-products"] });
        toast.success("Product updated successfully");
        closeModal();
        setTimeout(() => {
          window.location.reload();
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

  // Delete product mutation
  const deleteProduct = useMutation(
    {
      mutationFn: async (id: string) => {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete product");
        }

        return response.json();
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["admin-products"] });
        toast.success("Product deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      onError: (error) => {
        toast.error(
          `Error: ${error instanceof Error ? error.message : "Failed to delete product"}`
        );
      },
    },
    qc
  );

  // Handler for opening modal to add new product
  const handleAddProduct = () => {
    setIsEditMode(false);
    setCurrentProductId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      currency: "USD",
      category: "",
      imageUrl: "",
      inStock: true,
      quantity: "0",
      tags: "",
    });
    setIsModalOpen(true);
  };

  // Handler for opening modal to edit existing product
  const handleEditProduct = (product: Product) => {
    setIsEditMode(true);
    setCurrentProductId(product.id!);
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
    setIsModalOpen(true);
  };

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

    if (isEditMode && currentProductId) {
      updateProduct.mutate({ id: currentProductId, data: productData });
    } else {
      createProduct.mutate(productData);
    }
  };

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      currency: "USD",
      category: "",
      imageUrl: "",
      inStock: true,
      quantity: "0",
      tags: "",
    });
  };

  // Handler for delete confirmation
  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  // Initialize DataTable with proper configuration
  useEffect(() => {
    if (products && tableRef.current && !dataTableRef.current) {
      dataTableRef.current = new DataTable(tableRef.current, {
        // Basic configuration
        pageLength: 10,
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
        order: [[0, "asc"]],

        // Column definitions
        columnDefs: [
          {
            targets: -1,
            orderable: false,
            searchable: false,
            className: "text-center",
          },
        ],

        // Layout configuration
        dom: '<"flex justify-between items-center mb-4"<"flex items-center"l><"flex items-center border-b-1 px-3 border-gray-300"f>>rtip',

        // Language configuration
        language: {
          search: "",
          searchPlaceholder: "Search products...",
          lengthMenu: "Show _MENU_ entries",
          info: "Showing _START_ to _END_ of _TOTAL_ products",
          infoEmpty: "No products available",
          infoFiltered: "(filtered from _MAX_ total products)",
          paginate: {
            first: "«",
            previous: "‹",
            next: "›",
            last: "»",
          },
        },
      });
    }

    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [products]);


  if (isLoading) return <Loading />;

  if (isError) return <ErrorPage />;
  

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Products Management
        </h1>
      </div>

      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-600 mt-1">Manage your product inventory</p>

        <button
          data-testid="add-product"
          onClick={handleAddProduct}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-4">
        <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Currency
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products?.map((product: Product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 relative rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {product.description}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {product.currency}
                  </div>
                  
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {product.price.toFixed(2)}
                  </div>
                  
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.quantity > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.quantity} in stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      data-testid={`delete-button-${product.name}`}
                      onClick={() => handleDeleteProduct(product.id!)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-90vh overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
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
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    In Stock
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {isEditMode ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default page;
