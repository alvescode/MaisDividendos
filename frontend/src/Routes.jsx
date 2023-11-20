import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import UserArea from "./pages/UserArea/UserArea";
import {NewWallet}  from "./pages/Wallet/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/userarea",
    element: <UserArea />,
  },
  {
    path:'/newWallet',
    element:<NewWallet/>
  },
]);

function Routes() {
  return <RouterProvider router={router}>
  </RouterProvider>;
}

export default Routes;