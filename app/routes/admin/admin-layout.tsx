import { Outlet, redirect } from "react-router-dom";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { MobileSideBar, NavItems } from "../../../components";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData, getGooglePicture } from "~/appwrite/auth";

export async function clientLoader() {
  try {
    const user = await account.get();

    if (!user.$id) return redirect("/sign-in");

    const existingUser = await getExistingUser(user.$id);
    if (existingUser?.status === "user") {
      return redirect("/");
    }

    // Helper to map either Appwrite account or DB document to the UI-friendly shape
    const mapToUiUser = async (dbUser: any | null, accountUser: any) => {
      const name = dbUser?.name || accountUser?.name || "Guest";
      const email = dbUser?.email || accountUser?.email || "guest@example.com";

      // Prefer stored imageUrl, otherwise try to fetch provider picture (Google) or fall back
      let imageUrl = dbUser?.imageUrl || null;
      if (!imageUrl) {
        // getGooglePicture will attempt to read the current session token if none is passed
        const providerPic = await getGooglePicture().catch(() => null);
        imageUrl = providerPic || accountUser?.imageUrl || accountUser?.prefs?.photo || "/assets/images/david.webp";
      }

      return { name, email, imageUrl };
    };

    if (existingUser?.$id) {
      return await mapToUiUser(existingUser, user);
    }

    // No existing DB user: create one and return mapped shape
    const created = await storeUserData();
    return await mapToUiUser(created as any, user);
  } catch (e) {
    // Log the error object to capture Appwrite error details (status, message)
    console.error("Error in clientLoader:", e);
    // If the error has a code or message, include it for easier debugging
    // (e.g., Appwrite returns 401 when there's no valid session)
    return redirect("/sign-in");
  }
}

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <div className="lg:hidden">
        <MobileSideBar />
      </div>

      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>

      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};
export default AdminLayout;
