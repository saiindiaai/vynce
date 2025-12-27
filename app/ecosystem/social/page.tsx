"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VynceSocialPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect legacy nested route to top-level /social to avoid being wrapped by ecosystem layout
    router.replace("/social");
  }, [router]);

  return null;
}
