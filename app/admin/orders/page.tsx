"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "datatables.net-dt";
import AdminLayout from "@/components/admin/AdminLayout";
import { Order, OrderItem } from "@/types";
import Loading from "@/components/fragments/ui/Loading";
import { qc } from "@/app/AppLayout";
import ErrorPage from "@/components/fragments/ui/Error";

// Types for our orders


const OrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const tableRef = useRef<HTMLTableElement>(null);
    const dataTableRef = useRef<any>(null);

  // Fetch orders
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const response = await fetch("/api/admin/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return response.json();
    },
  }, qc);

  // Function to open modal with order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status badge color
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Update order status mutation
  const handleUpdateStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      toast.success(`Order status updated to ${newStatus}`);
      setIsModalOpen(false);

      // Refetch the orders
      window.location.reload();
    } catch (error) {
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Failed to update order status"}`
      );
    }
  };

  useEffect(() => {
    if (orders && tableRef.current && !dataTableRef.current) {
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
        dom: '<"flex justify-between items-center mb-4"<"flex items-center"l><"flex items-center px-3 border-b-1 border-gray-300"f>>rtip',

        // Language configuration
        language: {
          search: "",
          searchPlaceholder: "Search orders...",
          lengthMenu: "Show _MENU_ entries",
          info: "Showing _START_ to _END_ of _TOTAL_ orders",
          infoEmpty: "No orders available",
          infoFiltered: "(filtered from _MAX_ total orders)",
          paginate: {
            first: "«",
            previous: " &lt; ",
            next: " &gt; ",
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
  }, [orders]);


  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
        
      </div>

      <p className="text-gray-600">View and manage customer orders</p>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-4">
        <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order: Order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.userName || "Customer"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.userEmail || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">Order Details</h2>
                <p className="text-gray-600">Order ID: {selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium text-gray-700">
                  Customer Information
                </h3>
                <p className="text-sm text-gray-600">
                  Name: {selectedOrder.userName || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {selectedOrder.userEmail || "N/A"}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Order Information</h3>
                <p className="text-sm text-gray-600">
                  Date: {formatDate(selectedOrder.createdAt)}
                </p>
                <p className="text-sm text-gray-600">
                  Status:
                  <span
                    className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Update Status
                  </label>
                  <div className="flex space-x-2">
                    {["PENDING", "PAID", "SHIPPED", "CANCELLED"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() =>
                            handleUpdateStatus(
                              selectedOrder.id,
                              status as Order["status"]
                            )
                          }
                          disabled={selectedOrder.status === status}
                          className={`px-2 py-1 text-xs rounded ${
                            selectedOrder.status === status
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-medium text-gray-700 mb-2">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedOrder.items.map((item: OrderItem) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.productName ||
                          `Product ID: ${item.productId.slice(0, 8)}...`}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        ${item.priceAtPurchase.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-sm font-medium text-gray-900 text-right"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-2 text-sm font-bold text-gray-900">
                      ${selectedOrder.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrderManagement;
