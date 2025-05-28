import React from "react";
import { Outlet } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "components";
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <MobileSidebar />
      {/* sidebar for larger devices */}
      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>

      {/* content which changes according to router */}
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;
