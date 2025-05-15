"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../provider/cartItemsProvider";
import { useEffect, useState } from "react";
import AuthLoader from "../fragments/ui/AuthLoader";

export function Header() {
  const { data: session, status } = useSession();
  const cart = useCart();
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use localStorage to maintain session state across page reloads
  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
    
    // Pre-load auth state from localStorage for instant UI feedback
    const storedAuthState = localStorage.getItem('authState');
    const storedUserName = localStorage.getItem('userName');
    
    if (storedAuthState === 'authenticated') {
      // Already set initial UI state based on localStorage before session loads
      if (storedUserName === 'admin') {
        setIsAdmin(true);
      }
      setIsLoading(false);
    }
    
    // Monitor session changes from NextAuth
    if (status === 'authenticated' && session) {
      localStorage.setItem('authState', 'authenticated');
      
      if (session.user?.name) {
        localStorage.setItem('userName', session.user.name.toLowerCase());
        setIsAdmin(session.user.name.toLowerCase() === "admin");
      }
      setIsLoading(false);
    } 
    else if (status === 'unauthenticated') {
      localStorage.removeItem('authState');
      localStorage.removeItem('userName');
      setIsLoading(false);
    }
    // When session is loading but not yet determined, keep existing state
    else if (status === 'loading' && !storedAuthState) {
      setIsLoading(true);
    }
  }, [status, session]);

  // Don't render authentication-dependent UI until client-side hydration is complete
  // This prevents the initial state flicker
  if (!isClient) {
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
            {/* Render empty space where buttons will appear to prevent layout shift */}
            <span className="inline-block w-20 h-10"></span>
          </nav>
        </div>
      </header>
    );
  }

  // Determine authentication state based on session status and localStorage
  const isAuthenticated = status === 'authenticated' || localStorage.getItem('authState') === 'authenticated';

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

          {isLoading ? (
            <AuthLoader />
          ) : !isAuthenticated ? (
            <button
              onClick={() => signIn()}
              className="cursor-pointer px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 font-bold transition duration-200"
            >
              Sign In
            </button>
          ) : (
            <>
              {(isAdmin || (session?.user?.name?.toLowerCase() === "admin")) && (
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
                onClick={() => {
                  localStorage.removeItem('authState');
                  localStorage.removeItem('userName');
                  signOut();
                }}
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
