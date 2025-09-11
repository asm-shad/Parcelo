import ProfilePage from "@/pages/ProfilePage";
import ParcelsToReceive from "@/pages/Receiver/ParcelsToReceive";
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
        url: "/receiver/parcels-to-receive",
        component: ParcelsToReceive,
      },
      {
        title: "Received Parcels",
        url: "/receiver/received-parcels",
        component: ReceivedParcels,
      },
    ],
  },
];
