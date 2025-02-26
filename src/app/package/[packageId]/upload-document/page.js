"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddDocs() {
  const [error, setError] = useState();
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const packageId = useParams().packageId;

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/packages/${packageId}/upload-document`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload document");

      alert("Document uploaded successfully!");
      console.log(data);

      // Redirect to add users page with the document ID
      // router.push(`/workflow/add-users?packageId=${packageId}&documentId=${data.documentId}`);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-200 pt-10 w-full h-screen relative">
      <Card className="w-3/4">
        <CardHeader>
          <CardTitle>New Workflow</CardTitle>
          <CardDescription>Add document</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input id="file" type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} size="lg" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
