"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DisplayNamePage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    await api.patch("/users/displayname", { displayName });
    router.push("/auth/agecheck");
  } catch (err) {
    console.log(err);
    setError("Failed to update display name");
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Choose Display Name
          </CardTitle>
          <CardDescription>
            Enter the name you want others to see
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Akash"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                This is visible publicly.
              </p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <Link
            href="/auth/register"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Back
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
