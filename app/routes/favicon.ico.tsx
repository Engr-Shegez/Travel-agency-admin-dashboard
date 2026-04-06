import { redirect } from "react-router";

// Redirect /favicon.ico requests to the actual logo asset to avoid "No routes matched" warnings
export const loader = () => redirect("/assets/icons/logo.svg");

export default function Favicon() {
  return null;
}
