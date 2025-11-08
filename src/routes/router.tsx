import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Splash from "../pages/Splash";
import Login from "../pages/Login";
import AccountLogin from "../pages/AccountLogin";
import Home from "../pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Splash /> },
      { path: "login", element: <Login /> },
      { path: "login/account", element: <AccountLogin /> },
      { path: "home", element: <Home /> },
    ],
  },
]);
