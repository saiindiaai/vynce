"use client";

import Link from "next/link";
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

export default function LoginPage() {

const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      username,
      password,
    });

    localStorage.setItem("token", res.data.token);

    router.push("/ecosystem");
  } catch (err) {
    setError("Invalid username or password");
  }
};

return (
<div className="flex min-h-screen items-center justify-center bg-black px-4">
<Card className="w-full max-w-md">
<CardHeader className="space-y-1">
<CardTitle className="text-2xl font-bold">Login</CardTitle>
<CardDescription>
Enter your credentials to access your account
</CardDescription>
</CardHeader>
<CardContent>
<form className="space-y-4">
<div className="space-y-2">
<Label htmlFor="email">Email</Label>
<Input  
id="email"  
type="email"  
placeholder="you@example.com"  
required  
/>
</div>
<div className="space-y-2">
<Label htmlFor="password">Password</Label>
<Input  
id="password"  
type="password"  
placeholder="••••••••"  
required  
/>
</div>
<div className="flex justify-end">
<Link  
href="/auth/forgot-password"  
className="text-sm text-muted-foreground hover:text-primary"  
>
Forgot password?
</Link>
</div>
<Button type="submit" className="w-full">
Login
</Button>
</form>
</CardContent>
<CardFooter className="flex flex-col space-y-2">
<div className="text-sm text-muted-foreground">
Don't have an account?{" "}
<Link  
href="/auth/register"  
className="text-primary hover:underline font-medium"  
>
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
