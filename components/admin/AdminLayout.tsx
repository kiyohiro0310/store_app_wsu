import { qc } from "@/app/AppLayout";
import { QueryClientProvider } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Loading from "../fragments/ui/Loading";

const AdminLayout = (props: React.PropsWithChildren) => {
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
              <div className="flex space-x-4">
                <Link href="/admin" className={`px-4 py-2 rounded-md `}>
                  Dashboard
                </Link>
                <Link
                  href="/admin/products"
                  className={`px-4 py-2 rounded-md }`}
                >
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
            {props.children}
          </div>
        </div>
    </QueryClientProvider>
  );
};

export default AdminLayout;
