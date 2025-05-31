import React from "react";
import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from "components";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/auth";

export async function clientLoader() {
  try {
    const user = await account.get();

    if (!user.$id) return redirect("/sign-in");

    const alreadyUser = await getExistingUser(user.$id);

    if (alreadyUser?.status === "user") {
      return redirect("/");
    }

    return alreadyUser?.$id ? alreadyUser : await storeUserData();
  } catch (error) {
    console.log("Error in clientLoader: ", error);
    return redirect("/sign-in");
  }
}

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
