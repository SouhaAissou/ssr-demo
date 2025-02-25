"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPackage() {
  const [packageName, setPackageName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const router = useRouter();

  // const handleCreatePackage = async () => {
  //   if (!packageName) {
  //     alert("Please enter a package name.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch("/api/packages/create", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         package_name: packageName,
  //         workflow_mode: "ME_AND_OTHERS", // Default mode, change if needed
  //         folder_name: folderName || "test",
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.message || "Failed to create package");
  //     }

  //     console.log("Package created:", data);
  //     router.push("/package/documents"); // Redirect to add documents

  //   } catch (error) {
  //     console.error("Error creating package:", error);
  //   }
  // };

  const handleCreatePackage = async () => {
    if (!packageName) {
      alert("Please enter a package name.");
      return;
    }
  
    try {
      const res = await fetch("/api/packages/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_name: packageName,
          workflow_mode: "ME_AND_OTHERS",
          folder_name: folderName || "test",
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Failed to create package");
      }
  
      console.log("Package created:", data);
      router.push(`/package/${data.data.package_id}/details`); // Redirect to package details page
  
    } catch (error) {
      console.error("Error creating package:", error);
    }
  };
  

  return (
    <div className="flex justify-center min-h-screen bg-gray-300">
      <Card className="w-3/4 p-6 mt-10 mb-10 shadow-lg">
        <CardHeader>
          <CardTitle>Create a New Package</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Enter package name"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="mb-4"
          />
          {/* {showFolderInput && (
            <Input
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="mb-4"
            />
          )} */}
          {/* <Button variant="secondary" onClick={() => setShowFolderInput(true)} className="mb-4">
            {showFolderInput ? "Folder Added" : "Add Folder to Package"}
          </Button> */}
          <Button onClick={handleCreatePackage} className="w-1/4 ">
            Create Package
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
