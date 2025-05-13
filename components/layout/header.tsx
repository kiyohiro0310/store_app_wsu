"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../provider/cartItemsProvider";

export function Header() {
  const { data: session, status } = useSession();
  const cart = useCart();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 flex items-center justify-center"
        >
          <Image src={"/imgs/icon.png"} alt="" width={30} height={30} />
          MyStore
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-black">
            Home
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-black">
            Products
          </Link>

          {!session || status !== "authenticated" ? (
            <button
              onClick={() => signIn()}
              className="cursor-pointer px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 font-bold transition duration-200"
            >
              Sign In
            </button>
          ) : (
            <>
              {session.user?.name?.toLowerCase() === "admin" && (
                <Link href="/admin" className="text-gray-600 hover:text-black">
                  Admin
                </Link>
              )}

              <Link href="/cart" className="text-gray-600 hover:text-black">
                Cart
                <span className="relative text-black text-xs -left-1 -top-3 rounded-2xl px-1 bg-yellow-500 font-bold">
                  {cart?.cartItems?.items?.length || 0}
                </span>
              </Link>

              <button
                className="cursor-pointer px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 font-bold transition duration-200"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
