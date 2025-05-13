"use client";
import React, { useState } from "react";
import AppLayout from "../AppLayout";
import { signIn } from "next-auth/react";
import ErrorPage from "@/components/fragments/ui/Error";
import { emailRegex, passwordRegex } from "@/functions/regEx";

const RegisterPage = () => {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  function validateInputs() {
    const username = nameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    const newErrors = {
      username: "",
      email: "",
      password: "",
    };

    // Validate username
    if (!username.trim()) {
      newErrors.username = "Username is required.";
    }

    // Validate email
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return !newErrors.username && !newErrors.email && !newErrors.password;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const data = {
      username: nameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    fetch("/api/auth/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        // Use signIn to log in the user
        signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false, // Prevent automatic redirection
        }).then((result) => {
          if (result?.ok) {
            // Redirect to the dashboard or home page
            window.location.href = "/";
          } else {
            return <ErrorPage />;
          }
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        <ErrorPage />;
      });
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Create an Account
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <input
                ref={nameRef}
                type="text"
                id="name"
                className={`w-full px-4 py-2 border ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg focus:outline-none focus:ring-2`}
                placeholder="Enter your full name"
                required
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email Address
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                className={`w-full px-4 py-2 border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg focus:outline-none focus:ring-2`}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                id="password"
                className={`w-full px-4 py-2 border ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                } rounded-lg focus:outline-none focus:ring-2`}
                placeholder="Enter your password"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
            >
              Register
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default RegisterPage;
