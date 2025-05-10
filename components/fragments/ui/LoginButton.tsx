"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <button
          className="cursor-pointer px-4 py-2 rounded-4 bg-gray-400 text-black hover:bg-gray-500 font-bold transistion duration-200"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </>
    );
  }
  return (
    <>
      <button
        className="cursor-pointer px-4 py-2 rounded-md bg-yellow-400 text-black hover:bg-yellow-500 font-bold transistion duration-200"
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
