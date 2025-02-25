import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    console.log("Received request to upload document"); // Ensure the function is called

    const formData = await req.formData();
    const file = formData.get("file");
    const packageId = formData.get("packageId");

    if (!file || !packageId) {
      console.error("Missing file or packageId");
      return NextResponse.json({ error: "File and Package ID are required" }, { status: 400 });
    }

    const cookieStore = cookies();
    const accessToken = cookieStore.get("token")?.value;

    if (!accessToken) {
      console.error("Missing access token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fileStream = file.stream();
    const fileName = file.name || "document.pdf";

    // Debugging logs
    console.log("Uploading File:", fileName);
    console.log("File Size:", file.size);
    console.log("Package ID:", packageId);
    console.log("Access Token Exists:", !!accessToken);

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
      body: fileStream,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error Response from API:", data);
      return NextResponse.json({ error: data.message || "Failed to upload document" }, { status: response.status });
    }

    console.log("Document uploaded successfully:", data);
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
