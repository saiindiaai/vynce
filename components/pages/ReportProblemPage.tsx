"use client";

import React, { useState } from "react";
import { AlertCircle, Send } from "lucide-react";

export default function ReportProblemPage() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    {
      id: "technical",
      label: "Technical Issue",
      description: "App crashes, loading problems, or bugs",
    },
    {
      id: "account",
      label: "Account Issue",
      description: "Login problems, verification, or security",
    },
    {
      id: "content",
      label: "Inappropriate Content",
      description: "Report spam, harassment, or harmful content",
    },
    {
      id: "feature",
      label: "Feature Request",
      description: "Suggest improvements or new features",
    },
    { id: "other", label: "Other", description: "Something else" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && description.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setCategory("");
        setDescription("");
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="animate-fadeIn pb-24 sm:pb-0 w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 py-6 border-b border-slate-700/50 bg-slate-900">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-50 mb-2">Report a Problem</h1>
        <p className="text-sm sm:text-base text-slate-400">
          Help us improve Vynce by reporting issues
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-6">
        {submitted ? (
          <div className="clean-card p-6 text-center space-y-3 animate-slideIn">
            <div className="text-4xl">✓</div>
            <h2 className="text-xl font-bold text-slate-50">Thank you for reporting!</h2>
            <p className="text-sm text-slate-400">
              We'll review your report and take appropriate action.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-50">What's the issue?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all min-h-[80px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 ${
                      category === cat.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/30"
                    }`}
                  >
                    <h3 className="font-semibold text-slate-50 text-sm">{cat.label}</h3>
                    <p className="text-xs text-slate-400 mt-1">{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            {category && (
              <div className="space-y-2 animate-slideInUp">
                <label className="block text-sm font-semibold text-slate-50">
                  Describe the issue
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide as much detail as possible..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800 transition-all text-sm resize-none h-32"
                />
                <p className="text-xs text-slate-500">{description.length}/500 characters</p>
              </div>
            )}

            {/* Submit Button */}
            {category && (
              <button
                type="submit"
                disabled={!category || !description.trim()}
                className="w-full py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-all min-h-[40px] focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-2 animate-slideInUp"
              >
                <Send size={16} />
                Submit Report
              </button>
            )}
          </form>
        )}

        {/* FAQ Section */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <h2 className="text-lg font-bold text-slate-50 mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            FAQs
          </h2>
          <div className="space-y-3">
            <div className="clean-card p-4">
              <h3 className="font-semibold text-slate-50 text-sm mb-2">
                How long does it take to review a report?
              </h3>
              <p className="text-xs text-slate-400">
                We review reports within 24-48 hours and take action based on our community
                guidelines.
              </p>
            </div>
            <div className="clean-card p-4">
              <h3 className="font-semibold text-slate-50 text-sm mb-2">
                Will I be notified of the outcome?
              </h3>
              <p className="text-xs text-slate-400">
                For account and content reports, we may notify you of actions taken. For bugs, we'll
                publish fixes in release notes.
              </p>
            </div>
            <div className="clean-card p-4">
              <h3 className="font-semibold text-slate-50 text-sm mb-2">
                Can I report anonymously?
              </h3>
              <p className="text-xs text-slate-400">
                Yes, reports are processed securely and your identity is protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
