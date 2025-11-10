import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Splash from "../pages/Splash";
import Login from "../pages/Login";
import AccountLogin from "../pages/AccountLogin";
import Home from "../pages/Home";
import RouteHistory from "../pages/RouteHistory";
import RouteDetail from "../pages/RouteDetail";
import MyPage from "../pages/MyPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Splash /> },
      { path: "home", element: <Home /> },
      { path: "history", element: <RouteHistory /> },
      { path: "history/:id", element: <RouteDetail /> },
      { path: "mypage", element: <MyPage /> },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "login/account", element: <AccountLogin /> },
]);
