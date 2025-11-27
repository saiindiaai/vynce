"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Terms & Policies</CardTitle>
          <CardDescription>
            Please read and accept the terms to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="h-48 overflow-y-auto rounded-md border border-border p-4 text-sm text-muted-foreground">
              <p className="mb-4">
                Welcome to Vynce. By using our platform, you agree to these terms and conditions.
              </p>
              <p className="mb-4">
                We collect and process your data in accordance with our Privacy Policy. Your information is kept secure and used only to enhance your experience.
              </p>
              <p className="mb-4">
                You must be of legal age or have parental consent to use this platform. Users are responsible for maintaining the confidentiality of their account credentials.
              </p>
              <p className="mb-4">
                Vynce reserves the right to modify these terms at any time. Continued use of the platform constitutes acceptance of any changes.
              </p>
              <p>
                For full terms and privacy policy details, please visit our website or contact support.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                I agree to the Terms & Privacy Policy
              </Label>
            </div>
           <Button asChild className="w-full">
         <Link href="/auth/onboarding-complete">Continue</Link>
          </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link href="/auth/parentalpasskey" className="text-sm text-muted-foreground hover:text-primary">
            Back
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
