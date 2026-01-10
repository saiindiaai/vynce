import {
  FileText,
  Flame,
  Image as ImageIcon,
  Video,
  X,
} from "lucide-react";
import React, { useRef } from 'react';
import { ContentType, CreatorPost, MAX_FILE_SIZE_BYTES } from './CreatorConstants';

interface CreatorFormProps {
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  tags: string;
  setTags: (tags: string) => void;
  mediaPreview: string | null;
  setMediaPreview: (preview: string | null) => void;
  mediaType: "image" | "video" | null;
  setMediaType: (type: "image" | "video" | null) => void;
  visibility: "public" | "private" | "draft";
  setVisibility: (visibility: "public" | "private" | "draft") => void;
  scheduledAt: string;
  setScheduledAt: (scheduledAt: string) => void;
  isPublishing: boolean;
  setIsPublishing: (publishing: boolean) => void;
  opponent: string;
  setOpponent: (opponent: string) => void;
  fightType: "visual" | "text";
  setFightType: (fightType: "visual" | "text") => void;
  onPublish: (post: CreatorPost) => void;
  onClearForm: () => void;
  showToast?: (message: string, type: "success" | "error" | "warning" | "info") => void;
}

export const CreatorForm: React.FC<CreatorFormProps> = ({
  contentType,
  setContentType,
  title,
  setTitle,
  description,
  setDescription,
  tags,
  setTags,
  mediaPreview,
  setMediaPreview,
  mediaType,
  setMediaType,
  visibility,
  setVisibility,
  scheduledAt,
  setScheduledAt,
  isPublishing,
  setIsPublishing,
  opponent,
  setOpponent,
  fightType,
  setFightType,
  onPublish,
  onClearForm,
  showToast,
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      showToast?.("Unsupported file type. Please upload an image or video.", "warning");
      return;
    }
    // basic file size validation: 40MB limit
    const maxBytes = MAX_FILE_SIZE_BYTES;
    if (file.size > maxBytes) {
      showToast?.("File too large — max 40MB allowed.", "warning");
      return;
    }
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    setMediaType(isImage ? "image" : "video");
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setTags("");
    setMediaPreview(null);
    setMediaType(null);
    setVisibility("public");
    setScheduledAt("");
    setOpponent("");
    setFightType("visual");
    onClearForm();
  };

  const publish = () => {
    if (!title.trim()) {
      showToast?.("Title is required", "warning");
      return;
    }
    if (contentType === "capsule" && !mediaPreview) {
      showToast?.("Capsules require media", "warning");
      return;
    }
    if (contentType === "fight" && !opponent.trim()) {
      showToast?.("Opponent is required for fights", "warning");
      return;
    }

    setIsPublishing(true);

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const scheduledTimestamp = scheduledAt ? new Date(scheduledAt).toISOString() : null;
    const vis = scheduledTimestamp && new Date(scheduledTimestamp) > new Date() ? "scheduled" : visibility;

    const postData = {
      contentType,
      title: title.trim(),
      description: description.trim(),
      media: mediaPreview ? { url: mediaPreview, type: mediaType as "image" | "video" } : null,
      tags: parsedTags,
      visibility: vis,
      scheduledAt: scheduledTimestamp,
      ...(contentType === "fight" && {
        opponent: opponent.trim(),
        fightType,
      }),
    };

    onPublish(postData);

    // small UX: simulate upload/publish time
    setTimeout(() => {
      showToast?.(
        vis === "scheduled" ? "Content scheduled successfully." : "Content published successfully!",
        "success"
      );
      clearForm();
      setIsPublishing(false);
    }, 600);
  };

  return (
    <div className="clean-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-black text-slate-50 mb-2">Create New Content</h2>
        <p className="text-xs text-slate-400">
          Share your thoughts, showcase your skills, or challenge others in epic battles.
        </p>
      </div>

      {/* Content Type Selector */}
      <div className="mb-8">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
          Content Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["drop", "capsule", "fight"] as ContentType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setContentType(type);
                clearForm();
              }}
              className={`relative group py-3 px-4 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2 overflow-hidden ${contentType === type
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                : "bg-slate-800/40 text-slate-400 hover:bg-slate-800/60 border border-slate-700/50 hover:border-slate-600"
                }`}
            >
              {type === "drop" && <FileText size={18} />}
              {type === "capsule" && <Video size={18} />}
              {type === "fight" && <Flame size={18} />}
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">Title</label>
          <input
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            placeholder="Add an eye-catching title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Description
          </label>
          <textarea
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
            placeholder="Tell your story..."
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Fight-specific fields */}
        {contentType === "fight" && (
          <div className="p-4 bg-gradient-to-br from-red-600/10 to-orange-600/10 rounded-xl border border-red-600/30 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-red-300 mb-2">
                Opponent Username
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="e.g., ProDev"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-red-300 mb-2">
                Fight Type
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFightType("visual")}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${fightType === "visual"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700/50"
                    }`}
                >
                  🎥 Visual
                </button>
                <button
                  onClick={() => setFightType("text")}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all ${fightType === "text"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700/50"
                    }`}
                >
                  💬 Debate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tags Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Tags <span className="text-slate-500">(optional)</span>
          </label>
          <input
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            placeholder="tech, design, tutorial (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Media upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-3">
            Media {contentType === "capsule" && <span className="text-red-400">*</span>}
            <span className="text-slate-500 ml-1">
              ({contentType === "capsule" ? "video recommended" : "optional"})
            </span>
          </label>
          <div className="relative">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handleFile(e.target.files?.[0] || undefined)}
              className="sr-only"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-700/50 rounded-xl hover:border-purple-500/50 hover:bg-slate-900/30 cursor-pointer transition-all group"
            >
              <div className="text-center">
                <ImageIcon
                  className="mx-auto mb-2 text-slate-500 group-hover:text-purple-400 transition-colors"
                  size={28}
                />
                <p className="text-sm font-semibold text-slate-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, MP4 up to 40MB</p>
              </div>
            </label>
          </div>
          {mediaPreview && mediaType === "image" && (
            <div className="mt-4 relative">
              <img
                src={mediaPreview}
                alt="preview"
                className="rounded-xl max-h-48 object-cover w-full"
              />
              <button
                onClick={() => {
                  setMediaPreview(null);
                  setMediaType(null);
                }}
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black rounded-full transition-all"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          )}
          {mediaPreview && mediaType === "video" && (
            <div className="mt-4 relative">
              <video
                src={mediaPreview as string}
                controls
                className="rounded-xl max-h-48 w-full object-cover"
              />
              <button
                onClick={() => {
                  setMediaPreview(null);
                  setMediaType(null);
                }}
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black rounded-full transition-all"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Visibility & Scheduling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value as "public" | "private" | "draft")
              }
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            >
              <option value="public">🌍 Public</option>
              <option value="private">🔒 Private</option>
              <option value="draft">📝 Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Schedule <span className="text-slate-500">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
          <button
            onClick={publish}
            disabled={isPublishing}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            {isPublishing ? "Publishing..." : `Publish as ${contentType.toUpperCase()}`}
          </button>
          <button
            onClick={clearForm}
            className="px-6 py-3 bg-slate-800/40 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg border border-slate-700/50 transition-all"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};