"use client";

import Link from "next/link";
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
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">You're All Set 🎉</CardTitle>
          <CardDescription>
            Your Vynce account is ready.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Welcome to the Vynce Ecosystem.
          </p>

          <p className="text-center text-sm text-muted-foreground">
            Tap below to continue.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/ecosystem">Enter Vynce</Link>
          </Button>

          <Link
            href="/auth/terms"
            className="text-sm text-muted-foreground hover:text-primary text-center"
          >
            Back
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
