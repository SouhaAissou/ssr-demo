import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serialize } from "cookie";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value; // Get token from cookies

  if (!token) {
    return new NextResponse(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  try {
    // Call SigningHub Logout API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v4/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        device_token: "", 
      }),
    });

    if (!res.ok) {
      return new NextResponse(JSON.stringify({ message: "Failed to logout from SigningHub" }), { status: res.status });
    }

    // Clear authentication cookie
    const cookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 0, // Expire immediately
    });

    return new NextResponse(JSON.stringify({ message: "Logged out successfully" }), {
      status: 200,
      headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
