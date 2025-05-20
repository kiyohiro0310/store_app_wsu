import React, { useState } from "react";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import { useQuery } from "@tanstack/react-query";

interface Activity {
  id: string;
  type: 'order' | 'product';
  action: string;
  userName: string;
  userEmail: string;
  details: {
    total?: number;
    items?: string;
    status?: string;
    name?: string;
    price?: number;
    category?: string;
  };
  createdAt: string;
}

const AdminHome = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "products" | "orders">("dashboard");

  // Fetch recent activities
  const { data: activities } = useQuery({
    queryKey: ["admin-activities"],
    queryFn: async () => {
      const response = await fetch("/api/admin/activities");
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      return response.json();
    },
  });

  // Get time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Get activity icon based on type and action
  const getActivityIcon = (activity: Activity) => {
    if (activity.type === 'order') {
      switch (activity.action) {
        case 'paid':
          return '💰';
        case 'pending':
          return '⏳';
        case 'cancelled':
          return '❌';
        case 'shipped':
          return '📦';
        default:
          return '📝';
      }
    } else {
      switch (activity.action) {
        case 'created':
          return '✨';
        case 'updated':
          return '📝';
        case 'deleted':
          return '🗑️';
        default:
          return '📦';
      }
    }
  };

  // Get activity color based on type and action
  const getActivityColor = (activity: Activity) => {
    if (activity.type === 'order') {
      switch (activity.action) {
        case 'paid':
          return 'bg-green-100 text-green-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        case 'shipped':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (activity.action) {
        case 'created':
          return 'bg-green-100 text-green-800';
        case 'updated':
          return 'bg-blue-100 text-blue-800';
        case 'deleted':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button 
              className={`px-4 py-2 rounded-md ${activeSection === "dashboard" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeSection === "products" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveSection("products")}
            >
              Products
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeSection === "orders" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setActiveSection("orders")}
            >
              Orders
            </button>
          </div>
        </div>

        {activeSection === "dashboard" && (
          <div>
            {/* Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div 
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveSection("products")}
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Products</h2>
                <p className="text-gray-600 mb-4">
                  Add, edit, or remove products from the store.
                </p>
                <div className="text-blue-600 font-medium">
                  Go to Products →
                </div>
              </div>
              <div 
                className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveSection("orders")}
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-4">View Orders</h2>
                <p className="text-gray-600 mb-4">
                  Track and manage customer orders.
                </p>
                <div className="text-blue-600 font-medium">
                  Go to Orders →
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Store Overview</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Products:</span>
                    <span className="font-semibold">6 items</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Orders:</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Orders:</span>
                    <span className="font-semibold">3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Activities */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Activities</h2>
                <ul className="divide-y divide-gray-200">
                  {activities?.filter((activity: Activity) => activity.type === 'product').map((activity: Activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getActivityIcon(activity)}</span>
                        <div className="flex-1">
                          <p className="text-gray-700">
                            <span className="font-bold">{activity.userName}</span>
                            {" "}{activity.action}{" a product: "}
                            <span className="font-semibold">{activity.details.name}</span>
                            {activity.details.price && (
                              <span> (${activity.details.price.toFixed(2)})</span>
                            )}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActivityColor(activity)}`}>
                              {activity.action}
                            </span>
                            <span className="text-sm text-gray-500">{getTimeAgo(activity.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  {activities?.filter((activity: Activity) => activity.type === 'product').length === 0 && (
                    <li className="py-4 text-gray-500 text-center">
                      No recent product activities
                    </li>
                  )}
                </ul>
              </div>

              {/* Order Activities */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Activities</h2>
                <ul className="divide-y divide-gray-200">
                  {activities?.filter((activity: Activity) => activity.type === 'order').map((activity: Activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getActivityIcon(activity)}</span>
                        <div className="flex-1">
                          <p className="text-gray-700">
                            <span className="font-bold">{activity.userName}</span>
                            {" placed an order for "}
                            <span className="font-semibold">${activity.details.total?.toFixed(2)}</span>
                            {activity.details.items && (
                              <span> ({activity.details.items})</span>
                            )}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActivityColor(activity)}`}>
                              {activity.details.status}
                            </span>
                            <span className="text-sm text-gray-500">{getTimeAgo(activity.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  {activities?.filter((activity: Activity) => activity.type === 'order').length === 0 && (
                    <li className="py-4 text-gray-500 text-center">
                      No recent order activities
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === "products" && (
          <ProductManagement />
        )}

        {activeSection === "orders" && (
          <OrderManagement />
        )}
      </div>
    </div>
  );
};

export default AdminHome;