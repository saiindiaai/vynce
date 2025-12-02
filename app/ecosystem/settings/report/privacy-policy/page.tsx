"use client";

import { useTheme } from "@/hooks/useTheme";

export default function PrivacyPolicyPage() {
  const { theme } = useTheme();

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>
        Privacy Policy – Vynce
      </h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>Last Updated: 2025</p>

      <div className="card-matte rounded-2xl p-5 border border-white/10 space-y-5 text-gray-300 text-sm leading-relaxed">

        <p>
          Vynce ("we", "our", "us") provides social features through Vynce Social,
          dating features through Vynce Connect, and AI tools through Promptane.
          By using our services, you agree to this Privacy Policy.
        </p>

        <h3 className="text-lg font-semibold text-white">1. INFORMATION WE COLLECT</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Account Data: username, email, phone (if provided).</li>
          <li>Content: posts, chats, shared media, APK uploads on Vynce Store.</li>
          <li>Device Data: app version, IP, device model (security only).</li>
          <li>Usage Data: interactions, features used, crash logs.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white">2. HOW WE USE INFORMATION</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>To operate Vynce Social, Vynce Connect, Promptane & Vynce Store.</li>
          <li>To keep users safe with security checks & abuse detection.</li>
          <li>To improve performance & recommendations.</li>
          <li>To prevent scams, fraud, illegal activity.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white">3. HUMAN SAFETY</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Strict action against grooming or harmful behaviour.</li>
          <li>Reports monitored 24/7 & escalated when required.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white">4. CONTENT RULES</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>APK sharing allowed only if safe & legal.</li>
          <li>NSFW allowed only with censor / 18+ warning.</li>
          <li>No NSFW in non-NSFW groups.</li>
          <li>No hate speech, violence, scams, impersonation.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white">5. DATA SECURITY</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Encrypted storage and encrypted data transfer.</li>
          <li>Restricted internal system access.</li>
          <li>We NEVER sell your data, not even username or email.</li>
          <li>This app is built for privacy & personalisation.</li>
          <li>We will NEVER run ads on Vynce.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white">6. THIRD-PARTY SERVICES</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Cloud, payments, analytics follow strict confidentiality.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white">7. YOUR RIGHTS</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Edit or delete your account anytime.</li>
          <li>Download your data (coming soon).</li>
          <li>Request permanent deletion.</li>
        </ul>

        <h3 className="text-lg font-semibold text-white">8. CHANGES</h3>
        <p>We may update this Privacy Policy. Continued use = acceptance.</p>

        <h3 className="text-lg font-semibold text-white">9. CONTACT</h3>
        <p>For privacy concerns: vynce.founders@gmail.com</p>

      </div>
    </div>
  );
}
