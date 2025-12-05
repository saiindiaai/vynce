"use client";

import { useTheme } from "@/hooks/useTheme";

export default function PoliciesPage() {
  const { theme } = useTheme();

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-1 ${theme.textPrimary}`}>
        Terms & Policies
      </h1>

      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        Updated • 2025
      </p>

      <div className="card-matte rounded-2xl p-6 border border-white/10 space-y-6 text-sm leading-relaxed text-gray-300">

        <p>
          By using Vynce Social, Vynce Connect, Promptane, or Vynce Store,
          you are agreeing to the following rules and guidelines.
        </p>

        {/* SECTION */}
        <section>
          <h3 className={`text-lg font-semibold mb-2 ${theme.textPrimary}`}>
            1. Eligibility
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>No minimum age for Vynce Social & Promptane.</li>
            <li>No minimum age for Vynce Connect.</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${theme.textPrimary}`}>
            2. User Responsibilities
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>You are responsible for all activity on your account.</li>
            <li>NSFW content allowed only with censor or 18+ warning.</li>
            <li>No NSFW in non-NSFW groups or chats.</li>
            <li>Mass reports may trigger account bans.</li>
            <li>APK uploads must be legal, safe, and virus-free.</li>
            <li>No harassment, scams, threats, or abuse.</li>
            <li>No impersonation of people, brands, or celebrities.</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${theme.textPrimary}`}>
            3. Vynce Connect Rules
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide honest and real information.</li>
            <li>No catfishing or romantic scams.</li>
            <li>Your country identity is required for dating matches.</li>
            <li>Respectful conduct is mandatory.</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${theme.textPrimary}`}>
            4. Vynce Store (APK Sharing)
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Upload only apps you own or are allowed to share.</li>
            <li>No harmful, illegal, or malicious files.</li>
            <li>Vynce may scan APKs for safety.</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${theme.textPrimary}`}>
            5. Content Ownership
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>You own your content.</li>
            <li>Vynce may display or remove content violating rules.</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${theme.textPrimary}`}>
            6. Safety & Enforcement
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Accounts violating rules may be suspended or terminated.</li>
            <li>Severe cases may be escalated to authorities.</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${theme.textPrimary}`}>
            7. Limitation of Liability
          </h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Vynce is not responsible for losses caused by misuse.</li>
            <li>Services may temporarily go offline for maintenance.</li>
          </ul>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${theme.textPrimary}`}>
            8. Changes to Terms
          </h3>
          <p>
            Policies may be updated at any time. Continued use means acceptance.
          </p>
        </section>

        <section>
          <h3 className={`text-lg font-semibold mb-2 ${theme.textPrimary}`}>
            9. Contact
          </h3>
          <p>
            For support: <span className="text-gray-200">vynce.founders@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
}
