"use client";

import { useTheme } from "@/hooks/useTheme";

export default function PoliciesPage() {
  const { theme } = useTheme();

  return (
    <div className="px-6 pb-28 pt-4">
      <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>
        Terms & Conditions – Vynce
      </h1>
      <p className={`text-sm mb-6 ${theme.textSecondary}`}>
        Last Updated: 2025
      </p>

      <div className="card-matte rounded-2xl p-5 border border-white/10 space-y-5 text-sm leading-relaxed text-gray-300">

        <p>
          Welcome to Vynce. By using Vynce Social, Vynce Connect, Promptane, or Vynce Store, 
          you agree to follow these terms.
        </p>

        {/* 1. ELIGIBILITY */}
        <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>1. ELIGIBILITY</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Minimum age: No minimum age for Vynce Social & Promptane.</li>
          <li>Minimum age: No minimum age for Vynce Connect (dating).</li>
        </ul>

        {/* 2. USER RESPONSIBILITIES */}
        <h3 className={`text-lg font-semibold mt-4 ${theme.textPrimary}`}>
          2. USER RESPONSIBILITIES
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>You are responsible for all activity on your account.</li>
          <li>You can upload NSFW or harmful content by adding a censor or 18+ warning.</li>
          <li>You can not upload NSFW or harmful content on non NSFW group or chat.</li>
         <li>People mass reporting your account will ban your account.</li>  
          <li>APK uploads must be safe, legal, and virus-free.</li>
          <li>No harassment, abuse, threats, or scams.</li>
          <li>No impersonation of people, brands, or celebrities.</li>
          <li>Real identity, real people.</li>
        </ul>

        {/* 3. VYNCE CONNECT RULES */}
        <h3 className={`text-lg font-semibold mt-4 ${theme.textPrimary}`}>
          3. VYNCE CONNECT RULES
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Dating features require honest information.</li>
          <li>Fake profiles, catfishing, or romantic scams are banned.</li>
          <li>Your country identity will be needed before dating anyone.</li>
          <li>Respect other users and maintain safety.</li>
        </ul>

        {/* 4. VYNCE STORE */}
        <h3 className={`text-lg font-semibold mt-4 ${theme.textPrimary}`}>
          4. VYNCE STORE (APK SHARING)
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Only upload apps you own or have permission to distribute.</li>
          <li>No malware, illegal tools, hacking apps, or harmful files.</li>
          <li>Vynce may scan APKs for safety.</li>
        </ul>

        {/* 5. CONTENT OWNERSHIP */}
        <h3 className={`text-lg font-semibold mt-4 ${theme.textPrimary}`}>
          5. CONTENT OWNERSHIP
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>You own your content but give Vynce permission to show it.</li>
          <li>We can remove content violating rules.</li>
        </ul>

        {/* 6. SAFETY & ENFORCEMENT */}
        <h3 className={`text-lg font-semibold mt-4 ${theme.textPrimary}`}>
          6. SAFETY & ENFORCEMENT
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>We may suspend or terminate accounts breaking the rules.</li>
          <li>Severe cases may be reported to legal authorities.</li>
        </ul>

        {/* 7. LIMITATION OF LIABILITY */}
        <h3 className={`text-lg font-semibold mt-4 ${theme.textPrimary}`}>
          7. LIMITATION OF LIABILITY
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>We are not responsible for losses caused by misuse of the app.</li>
          <li>Services may face downtime during updates or technical issues.</li>
        </ul>

        {/* 8. CHANGES */}
        <h3 className={`text-lg font-semibold mt-4 ${theme.textPrimary}`}>
          8. CHANGES TO TERMS
        </h3>
        <p>
          We may modify these Terms. Continued use means acceptance.
        </p>

        {/* 9. CONTACT */}
        <h3 className={`text-lg font-semibold mt-4 ${theme.textPrimary}`}>
          9. CONTACT
        </h3>
        <p>
          For support: <span className="text-gray-200">vynce.founders@gmail.com</span>
        </p>

      </div>
    </div>
  );
}
