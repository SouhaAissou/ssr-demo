import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req, { params }) {
    const formData = await req.formData();
    const file = formData.get("file");
    const packageId = params.packageId;

    console.log("Package ID:", packageId);

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const cookieStore = cookies();
    const accessToken = cookieStore.get("token")?.value;
    console.log("Access Token:", accessToken);

    if (!process.env.NEXT_PUBLIC_API_URL) {
      return NextResponse.json({ error: "NEXT_PUBLIC_API_URL is not defined" }, { status: 500 });
    }

    // Prepare file as a stream
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name || "document.pdf";

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v4/packages/${packageId}/documents`, {
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
      console.log(data);

      if (!response.ok) {
        return NextResponse.json({ error: data.message || "Failed to upload document" }, { status: response.status });
      }

      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error("Error uploading document:", error);
      return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
    }
}