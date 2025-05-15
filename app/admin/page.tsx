"use client";

import React from "react";
import AppLayout from "../AppLayout";
import AdminHome from "@/components/admin/home";
import AuthStateWrapper from "@/components/auth/AuthStateWrapper";
import LoadingPage from "@/components/fragments/ui/Loading";

const AdminPage = () => {
  return (
    <AppLayout>
      <AuthStateWrapper 
        requireAuth={true}
        requireAdmin={true}
        redirectTo="/"
        fallback={<LoadingPage />}
      >
        <AdminHome />
      </AuthStateWrapper>
    </AppLayout>
  );
};

export default AdminPage;
