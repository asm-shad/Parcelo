import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));
const ParcelManagement = lazy(() => import("@/pages/Admin/ParcelManagement"));
const UserManagement = lazy(() => import("@/pages/Admin/UserManagement"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
      {
        title: "Parcel Management",
        url: "/admin/parcel",
        component: ParcelManagement,
      },
      {
        title: "User Management",
        url: "/admin/user/all-users",
        component: UserManagement,
      },
    ],
  },
];
