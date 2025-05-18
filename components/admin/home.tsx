import React, { useState } from "react";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";

const AdminHome = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "products" | "orders">("dashboard");

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
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <ul className="divide-y divide-gray-200">
                <li className="py-4">
                  <p className="text-gray-700">
                    <span className="font-bold">John Doe</span> created a new product:{" "}
                    <span className="font-semibold">Wireless Headphones</span>.
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </li>
                <li className="py-4">
                  <p className="text-gray-700">
                    <span className="font-bold">Jane Smith</span> updated the price of{" "}
                    <span className="font-semibold">Smartphone X</span>.
                  </p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </li>
                <li className="py-4">
                  <p className="text-gray-700">
                    <span className="font-bold">Admin</span> deleted a user:{" "}
                    <span className="font-semibold">test@example.com</span>.
                  </p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </li>
              </ul>
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