"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OnboardingCompletePage() {
  const router = useRouter();

  // Auto-redirect after short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/ecosystem");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">You're All Set 🎉</CardTitle>
          <CardDescription>Your Vynce account is ready.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Welcome to the Vynce Ecosystem.
          </p>

          <p className="text-sm text-muted-foreground">
            Redirecting you automatically...
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/ecosystem">Enter Vynce Now</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
