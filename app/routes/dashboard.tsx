import { redirect } from "react-router";

export const loader = () => redirect("/admin/dashboard");
export const clientLoader = () => redirect("/admin/dashboard");

export default function DashboardRedirect() {
  return null;
}
