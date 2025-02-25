

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Page() {
  const token = cookies().get("token");

  if (token) {
    redirect("/dashboard"); // Redirect if logged in
  } else {
    redirect("/login"); // Redirect if not logged in
  }

  return (
    <div>
      <h1>Redirecting...</h1>
    </div>
  );
}