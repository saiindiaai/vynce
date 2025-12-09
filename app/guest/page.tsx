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

export default function GuestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Continue as Guest</CardTitle>
          <CardDescription>Join Vynce with limited features</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            You can explore Vynce without creating an account. Some features may be restricted.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button asChild variant="outline" className="w-full text-black dark:text-white">
            <Link href="/ecosystem" className="text-black">
              Enter as Guest
            </Link>
          </Button>

          <div className="text-sm text-muted-foreground">
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              Create an account instead
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
