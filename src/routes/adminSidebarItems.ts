// import Analytics from "@/pages/Admin/Analytics";
import ParcelManagement from "@/pages/Admin/AllParcels";
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
    ],
  },
  {
    title: "Parcel Management",
    items: [
      {
        title: "Parcel Management",
        url: "/admin/parcel",
        component: ParcelManagement,
      },
      {
        title: "Update Parcel",
        url: "/admin/parcel/:id",
        component: ParcelManagement,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "All Users",
        url: "/admin/user/all-users",
        component: ParcelManagement,
      },
      {
        title: "Update User",
        url: "/admin/user/:id",
        component: ParcelManagement,
      },
    ],
  },
];
