import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  const { packageId } = params;
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value; // Get token from cookies

  if (!token) {
    return new NextResponse(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v4/packages/${packageId}/workflow`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return new NextResponse(JSON.stringify({ message: "Failed to fetch workflow details", error: data }), { status: res.status });
    }

    return new NextResponse(JSON.stringify(data), { status: 200 });

  } catch (error) {
    return new NextResponse(JSON.stringify({ message: "Server error", error: error.message }), { status: 500 });
  }
}
