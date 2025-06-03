"use client";

import React, { useEffect, useState } from "react";
import AdminHome from "@/components/admin/home";
import { getSession } from "next-auth/react";
import { fetchUserSession } from "@/components/auth/CheckLogin";
import Loading from "@/components/fragments/ui/Loading";

const AdminPage = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetchUserSession(setIsAuthorized);
  }, []);


  if (isAuthorized === null || !isAuthorized) {
    return <Loading />;
  }
  return <AdminHome />;
};

export default AdminPage;
