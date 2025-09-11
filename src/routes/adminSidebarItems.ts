// import Analytics from "@/pages/Admin/Analytics";
import ParcelManagement from "@/pages/Admin/ParcelManagement";
import UserManagement from "@/pages/Admin/UserManagement";
import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Analytics = lazy(() => import("@/pages/Admin/Analytics"));

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
