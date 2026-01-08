"use client";

import { ToastType } from "@/lib/store";
import { House } from "@/types";
import { Copy, Mail, MessageCircle, Share2, X } from "lucide-react";

type Props = {
  show: boolean;
  onClose: () => void;
  selectedHouse: House | null | undefined;
  shareHouse: (opt: string) => void;
  showToast?: (message: string, type: ToastType, duration?: number, actionLabel?: string, action?: () => void) => void;
};

export default function HouseShareSheet({ show, onClose, selectedHouse, shareHouse, showToast }: Props) {
  if (!show || !selectedHouse) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn" onClick={onClose} />

      <div className={`fixed inset-x-0 bottom-0 z-50 animate-slideIn max-w-2xl mx-auto p-4`}>
        <div className={`rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden shadow-2xl`}>
          <div className={`flex items-center justify-between p-4 border-b border-slate-700`}>
            <h3 className={`text-lg font-bold text-slate-50`}>Share {selectedHouse.name}</h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-slate-700/50 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
            >
              <X size={20} className={`text-slate-400`} />
            </button>
          </div>

          <div className="p-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => shareHouse("copy")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:scale-105 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
            >
              <div className={`p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500`}>
                <Copy size={24} className="text-white" />
              </div>
              <span className={`text-sm font-semibold text-slate-50 text-center`}>Copy Link</span>
            </button>

            <button
              onClick={() => shareHouse("dm")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:scale-105 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
            >
              <div className={`p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500`}>
                <MessageCircle size={24} className="text-white" />
              </div>
              <span className={`text-sm font-semibold text-slate-50 text-center`}>Send DM</span>
            </button>

            <button
              onClick={() => shareHouse("email")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:scale-105 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
            >
              <div className={`p-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500`}>
                <Mail size={24} className="text-white" />
              </div>
              <span className={`text-sm font-semibold text-slate-50 text-center`}>Email</span>
            </button>

            <button
              onClick={() => shareHouse("share")}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:scale-105 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
            >
              <div className={`p-3 rounded-full bg-gradient-to-br from-green-500 to-cyan-500`}>
                <Share2 size={24} className="text-white" />
              </div>
              <span className={`text-sm font-semibold text-slate-50 text-center`}>More Options</span>
            </button>
          </div>

          <div className={`p-4 border-t border-slate-700`}>
            <label className={`block text-sm font-semibold text-slate-400 mb-2`}>House Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/houses?house=${selectedHouse._id}`}
                readOnly
                className={`flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-50 outline-none min-h-[40px] text-sm`}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${typeof window !== "undefined" ? window.location.origin : ""}/houses?house=${selectedHouse._id}`);
                  showToast?.("House link copied!", "success");
                }}
                className={`px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold hover:scale-105 transition-transform focus:outline-none focus-visible:outline-2 focus-visible:outline-purple-500`}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
