import { createRoot } from "react-dom/client";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import { AuthContextProvider } from "./AuthContext.tsx";
import {router} from "./router.tsx"

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <AuthContextProvider>
      <RouterProvider router={router}></RouterProvider>
      
    </AuthContextProvider>
    
  </QueryClientProvider>
);



/*

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

*/