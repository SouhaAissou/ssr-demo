import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documentStatus = "ALL"; // Change this if needed
  const pageNo = 1;
  const recordsPerPage = 20;

  try {
    const response = await fetch(
      `https://sh-api.ps.ascertia.com/v4/packages/${documentStatus}/${pageNo}/${recordsPerPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-folder": Buffer.from("INBOX").toString("base64"),
          "x-source": "Library",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch packages");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
