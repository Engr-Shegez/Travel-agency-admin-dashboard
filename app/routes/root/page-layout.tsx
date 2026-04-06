import React from "react";
import { Outlet, useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";

const PageLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
  };
  return (
    <div>
      <div className="flex items-center gap-4">
        <button onClick={handleLogout} className="cursor-pointer">
          <img src="/assets/icons/logout.svg" alt="logout" className="size-6" />
        </button>
        <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
      </div>

      <Outlet />
    </div>
  );
};

export default PageLayout;
