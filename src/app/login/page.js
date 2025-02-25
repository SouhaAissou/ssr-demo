"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      router.push("/dashboard"); // Redirect after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen bg-gray-300 flex items-center justify-center">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Label>Username</Label>
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </CardContent>
          <CardFooter>
            <Button type="submit">Login</Button>
          </CardFooter>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </Card>
    </div>
  );
}
