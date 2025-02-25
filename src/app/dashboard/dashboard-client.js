"use client"; // This makes it a Client Component

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function DashboardClient() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login"); // Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages/get-all");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch packages");
        }

        setPackages(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);


  return (
    <div className="bg-gray-300 pt-10 w-full h-screen relative">
      <Button className="absolute top-0 right-0 m-4" onClick={handleLogout}>Logout</Button>
      <Card className="w-4/5 mx-auto">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Where you can create a workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className=" top-4 right-4" onClick={() => router.push("/package/create")}>New Workflow</Button>
          <br />
          <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-xl font-bold mb-4">Dashboard - My Packages</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Package Name</th>
                  <th className="border p-2">Owner</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Uploaded On</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.package_id} className="border">
                    <td className="border p-2">{pkg.package_name}</td>
                    <td className="border p-2">{pkg.owner_name}</td>
                    <td className="border p-2">{pkg.package_status}</td>
                    <td className="border p-2">{pkg.uploaded_on}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
