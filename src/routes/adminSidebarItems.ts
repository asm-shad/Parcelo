import Analytics from "@/pages/Admin/Analytics";
import ParcelManagement from "@/pages/Admin/ParcelManagement";
import type { ISidebarItem } from "@/types";

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
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "User Management",
        url: "/admin/user/all-users",
        component: ParcelManagement,
      },
    ],
  },
];
