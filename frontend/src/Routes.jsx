import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import UserArea from "./pages/UserArea/UserArea";
import {NewWallet}  from "./pages/Wallet/index";
import CreateStock from "./components/CreateStock";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/user_area",
    element: <UserArea />,
  },
  {
    path: "/create_stock",
    element: <CreateStock/>,
  },
]);

function Routes() {
  return(
    <RouterProvider router={router}>
    </RouterProvider>
  )
}

export default Routes;