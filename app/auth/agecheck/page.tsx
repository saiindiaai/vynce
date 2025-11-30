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

export default function AgeCheckPage() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const ageNum = Number(age);

      if (ageNum < 13) {
        setError("You must be at least 13 to use Vynce.");
        return;
      }

      // Send age verification to backend
      await api.patch("/users/onboarding", {
        ageVerified: true,
      });

      router.push("/auth/onboarding-complete");
    } catch (err) {
      console.log(err);
      setError("Failed to verify age");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Age Verification</CardTitle>
          <CardDescription>Please enter your age</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                placeholder="18"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Your age helps us keep Vynce safe for everyone.
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
            href="/auth/displayname"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Back
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
