import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import Home from "./Home.tsx";
import Repair from "./Repair.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { Route, Routes } from "react-router";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App></App>}>
          <Route index element={<Home></Home>}></Route>

          <Route path="/repair" element={<Repair></Repair>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
