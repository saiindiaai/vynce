"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { api } from "@/lib/api";

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

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | "">("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // For now we send displayName = username so backend doesn't break.
      // Later the /auth/displayname step will update it properly.
      const res = await api.post("/auth/register", {
        username,
        password,
        displayName: username,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.token);

        // Fetch current user to get their ID for role detection
        try {
          const meRes = await api.get("/auth/me");
          localStorage.setItem("userId", meRes.data.user.id);
        } catch (err) {
          console.warn("Failed to fetch user info:", err);
        }
      }

      router.push("/auth/displayname");
    } catch (err) {
      console.error("Register error:", err);
      setError("Username already used or invalid. Try a different one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create account</CardTitle>
          <CardDescription>Pick a unique username and a secure password.</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="vynce_akash"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
              />
              <p className="text-xs text-muted-foreground">
                This is what people will search for and see as <code>@username</code>.
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 py-2 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-white/5 rounded-r-md"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Login
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
