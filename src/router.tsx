import { createBrowserRouter, type RouteObject } from "react-router";
import App from "./App";
import Repair from "./Repair";
import PrivateRoute from "./PrivateRoute";

const routes: RouteObject[] = [
  { path: "/", element: <App></App> },
  {
    path: "/repair",
    element: (
      <PrivateRoute>
        <Repair></Repair>
      </PrivateRoute>
    ),
  },
];

export const router = createBrowserRouter(routes);