"use client";

import React, { useEffect } from "react";
import AppLayout from "../AppLayout";
import Loading from "@/components/fragments/ui/Loading";
import AdminHome from "@/components/admin/home";

const page = () => {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();

      if (!data || !data.user || data.user.name.toLowerCase() !== "admin") {
        alert("You are not authorized to access this page.");
        window.location.href = "/";
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    }

    fetchSession();
  }, []);

  if (isAuthorized === null) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return null; // Prevent rendering anything after redirection
  }

  return (
    <AppLayout>
      <AdminHome />
    </AppLayout>
  );
};

export default page;
