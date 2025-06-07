import { qc } from "@/app/AppLayout";
import { QueryClientProvider } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Loading from "../fragments/ui/Loading";

const AdminLayout = (props: React.PropsWithChildren) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={qc}>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 flex items-center justify-center"
            >
              <Image src={"/imgs/icon.png"} alt="" width={30} height={30} />
              MyStore Admin
            </Link>
            
            {/* Hamburger Menu Button - Only visible on mobile */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-4">
              <Link href="/admin" className={`px-4 py-2 rounded-md`}>
                Dashboard
              </Link>
              <Link href="/admin/products" className={`px-4 py-2 rounded-md`}>
                Products
              </Link>
              <Link href="/admin/orders" className={`px-4 py-2 rounded-md`}>
                Orders
              </Link>
              <button
                className="cursor-pointer px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 font-bold transition duration-200"
                onClick={() => {
                  signOut();
                }}
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* Mobile Menu Panel */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/products"
                  className="px-4 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="px-4 py-2 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  className="cursor-pointer px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 font-bold transition duration-200"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>

          {props.children}
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default AdminLayout;
