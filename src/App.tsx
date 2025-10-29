import { MenubarItem, MenubarMenu } from "@radix-ui/react-menubar";
import {
  Menubar,
  MenubarContent,
  MenubarTrigger,
} from "./components/ui/menubar";

import { Outlet, useNavigate } from "react-router";

function App() {
  const navigate = useNavigate();
  return (
    <div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Applications</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => navigate("/repair")}>
              Repair
            </MenubarItem>
            <MenubarItem onClick={() => navigate("/")}>Home</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
