import React from "react";

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Users</h2>
            <p className="text-gray-600 mb-4">
              Create, update, or delete users in the system.
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Go to Users
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Products</h2>
            <p className="text-gray-600 mb-4">
              Add, edit, or remove products from the store.
            </p>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Go to Products
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">View Orders</h2>
            <p className="text-gray-600 mb-4">
              Track and manage customer orders.
            </p>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              Go to Orders
            </button>
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
    </div>
  );
};

export default AdminHome;