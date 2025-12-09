import "../globals.css";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="auth-theme">{children}</div>;
}
