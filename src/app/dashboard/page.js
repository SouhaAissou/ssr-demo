import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

export default function DashboardPage() {
  const token = cookies().get("token");

  if (!token) {
    redirect("/login"); // Redirect if no token
  }

  return <DashboardClient />; // Render the interactive client component
}
