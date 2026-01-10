"use client";

import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ---- NORMAL LOGIN ----
  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);

      // Fetch current user to get their ID for role detection
      try {
        const meRes = await api.get("/auth/me");
        localStorage.setItem("userId", meRes.data.user.id);
      } catch (err) {
        console.warn("Failed to fetch user info:", err);
      }

      router.push("/ecosystem");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  // ---- GUEST LOGIN ----
  const handleGuest = async () => {
    try {
      const res = await api.post("/auth/guest");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("guest_mode", "true");

      // Fetch current user to get their ID for role detection
      try {
        const meRes = await api.get("/auth/me");
        localStorage.setItem("userId", meRes.data.user.id);
      } catch (err) {
        console.warn("Failed to fetch user info:", err);
      }

      router.push("/ecosystem");
    } catch (err) {
      console.log(err);
      alert("Guest login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Access your Vynce account</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="akash001"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          {/* Guest Login Button */}
          <Button onClick={handleGuest} variant="secondary" className="w-full mt-3">
            Continue as Guest
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              Register
            </Link>
          </div>

          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            Back
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
