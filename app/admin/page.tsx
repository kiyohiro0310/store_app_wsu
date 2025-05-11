"use client";

import React, { useEffect } from "react";
import AppLayout from "../AppLayout";
import AdminHome from "@/components/admin/home";
import { fetchAdminSession } from "@/components/auth/CheckLogin";
import ErrorPage from "@/components/fragments/ui/Error";
import Loading from "@/components/fragments/ui/Loading";

const page = () => {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

  useEffect(() => {
    fetchAdminSession(setIsAuthorized);
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
