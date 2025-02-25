import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value; // Get the token from cookies

  if (!token) {
    return new NextResponse(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  try {
    const { package_name, workflow_mode, folder_name } = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v4/packages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        package_name,
        workflow_mode,
        folder_name,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new NextResponse(JSON.stringify({ message: "Failed to create package", error: data }), { status: res.status });
    }

    return new NextResponse(JSON.stringify({ message: "Package created successfully", data }), { status: 200 });

  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Server error", error: error.message }), { status: 500 });
  }
}
