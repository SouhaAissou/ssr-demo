import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const packageId = formData.get("packageId");

    if (!file || !packageId) {
      return NextResponse.json({ error: "File and Package ID are required" }, { status: 400 });
    }

    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

        // if (!accessToken) {
        //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

    const fileBuffer = await file.arrayBuffer();
    const fileName = file.name || "document.pdf";

    const response = await fetch(`https://sh-api.ps.ascertia.com/v4/packages/${packageId}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/octet-stream",
        "x-file-name": fileName,
        "x-convert-document": "true",
        "x-source": "API",
      },
      body: fileBuffer,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message || "Failed to upload document" }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
