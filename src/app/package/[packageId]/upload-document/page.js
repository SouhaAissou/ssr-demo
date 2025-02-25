"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function UploadDocument() {
  const { packageId } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("packageId", packageId);

    try {
      const res = await fetch(`/api/packages/${packageId}/upload-document`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload document");

      setSuccess("Document uploaded successfully!");
      setFile(null);
      router.push("#"); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-200 pt-10 w-full h-screen relative">
      <Card className="w-4/5 mx-auto">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Upload a document to the workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Document File</Label>
          <Input type="file" onChange={handleFileChange} />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
