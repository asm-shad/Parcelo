import type { ISidebarItem } from "@/types";
import CreateParcel from "@/pages/Sender/CreateParcel";
import MyParcels from "@/pages/Sender/MyParcels";

export const senderSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Create A Parcel",
        url: "/sender/parcel/create",
        component: CreateParcel,
      },
      {
        title: "My Parcels",
        url: "/sender/parcel/my-parcels",
        component: MyParcels,
      },
    ],
  },
];
