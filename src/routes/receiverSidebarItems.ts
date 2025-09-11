import ProfilePage from "@/pages/ProfilePage";
import IncomingParcels from "@/pages/Receiver/IncomingParcels";
import ReceivedParcels from "@/pages/Receiver/ReceivedParcels";
import type { ISidebarItem } from "@/types";

export const receiverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
            {
              title: "Profile",
              url: "/receiver/user/me",
              component: ProfilePage,
            },
      {
        title: "Parcels to Receive",
        url: "/receiver/parcel/incoming-parcels",
        component: IncomingParcels,
      },
      {
        title: "All Received Parcels",
        url: "/receiver/parcel/my-parcels",
        component: ReceivedParcels,
      },
    ],
  },
];
