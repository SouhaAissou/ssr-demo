"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PackageDetails() {
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const res = await fetch(`/api/packages/${packageId}/get-details`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch workflow details");

        setPackageData(data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageId]);

  const handleUploadMoreDocuments = () => {
    router.push(`/package/${packageId}/upload-document`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-300">
      {loading ? (
        <Skeleton className="w-96 h-32" />
      ) : packageData ? (
        <Card className="w-96 p-6 shadow-lg">
          <CardHeader>
            <CardTitle>{packageData.package_name}</CardTitle>
            <p className="text-sm text-gray-500">Owner: {packageData.owner_name}</p>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold">Documents:</h3>
            <ul className="mt-2 space-y-2">
              {packageData.documents?.length > 0 ? (
                packageData.documents.map((doc) => (
                  <li key={doc.document_id} className="border p-2 rounded-md">
                    📄 {doc.document_name}
                    <p className="text-xs text-gray-500">Created on: {doc.created_on}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No documents found.</p>
              )}
            </ul>
            <Button className="mt-4 w-full" onClick={handleUploadMoreDocuments}>
              Upload More Documents
            </Button>
          </CardContent>
        </Card>
      ) : (
        <p className="text-red-500">Failed to load package details.</p>
      )}
    </div>
  );
}
