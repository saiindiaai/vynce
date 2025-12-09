// app/layout.tsx  (server component — NO "use client")
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers"; // keep if you have providers (auth, etc.)
import ClientThemeApplier from "@/components/theme/ClientThemeApplier";

export const metadata: Metadata = {
  title: "Vynce Social",
  description: "Next generation social platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* body remains server-rendered — theme classes will be applied client-side */}
      <body className="antialiased">
        <Providers>
          {/* ClientThemeApplier will read Zustand and apply the theme class to <body> */}
          <ClientThemeApplier />
          {children}
        </Providers>
      </body>
    </html>
  );
}
