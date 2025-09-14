import { Link } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { useRef } from "react";
import NavItems from "./Navitems";

const MobileSideBar = () => {
  const sidebarRef = useRef<SidebarComponent>(null);

  const toggleSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current.toggle();
    }
  };

  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link to="/">
          <img
            src="/assets/icons/logo.svg"
            alt="Logo"
            className="size-[30px]"
          />

          <h1>TripNest</h1>
        </Link>

        <button onClick={toggleSidebar}>
          <img src="/assets/icons/menu.svg" alt="menu" className="size-7" />
        </button>
      </header>

      <SidebarComponent ref={sidebarRef} width={270} enableGestures={false}>
        <NavItems handleClick={toggleSidebar}/>
      </SidebarComponent>
    </div>
  );
};
export default MobileSideBar;
