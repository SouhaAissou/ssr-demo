import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req, context) {
  try {
    const { params } = context;
    const packageId = params.packageId;
    console.log("📦 Package ID:", packageId);

    const formData = await req.json(); // Expecting JSON body
    console.log("👥 Users Data:", formData);

    if (!Array.isArray(formData) || formData.length === 0) {
      return NextResponse.json({ error: "At least one user is required" }, { status: 400 });
    }

    const cookieStore = cookies();
    const accessToken = await cookieStore.get("token")?.value; // Fix cookie retrieval
    console.log("🔑 Access Token:", accessToken);

    const response = await fetch(`${process.env.API_URL}/v4/packages/${packageId}/workflow/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // Send users as JSON
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error from API:", data);
      return NextResponse.json({ error: data.message || "Failed to add users" }, { status: response.status });
    }

    console.log("✅ Users Added:", data);

    return NextResponse.json({ message: "Users added successfully", data }, { status: 200 });
  } catch (error) {
    console.error("⚠️ Error adding users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
