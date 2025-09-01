import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";
import Login from "@/pages/Login";
import IncomingParcels from "@/pages/Receiver/IncomingParcels";
import Register from "@/pages/Register";
import CreateParcel from "@/pages/Sender/CreateParcel";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: About,
        path: "about",
      },
    ],
  },
  {
    Component: DashboardLayout,
    path: "/admin",
    children: [...generateRoutes(adminSidebarItems)],
  },
  {
    Component: DashboardLayout,
    path: "/sender",
    children: [
      {
        Component: CreateParcel,
        path: "create",
      },
    ],
  },
  {
    Component: DashboardLayout,
    path: "/receiver",
    children: [
      {
        Component: IncomingParcels,
        path: "incoming-parcels",
      },
    ],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    Component: Verify,
    path: "/verify",
  },
]);
