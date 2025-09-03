import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (
  Component: ComponentType,
  requiredRoles?: TRole | TRole[]
) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (!isLoading && !data?.data?.email) {
      return <Navigate to="/login" />;
    }

    if (requiredRoles && !isLoading) {
      const roles = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];
      if (!roles.includes(data?.data?.role as TRole)) {
        return <Navigate to="/unauthorized" />;
      }
    }

    return <Component />;
  };
};
