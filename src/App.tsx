

import SignIn from "./SignIn";



function App() {
  
  return (
    <div>
      <SignIn></SignIn>
    </div>
  );
}

export default App;

/*

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

*/