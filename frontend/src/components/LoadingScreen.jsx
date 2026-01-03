import React from "react";

export default function LoadingScreen({ size = 66, label = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">

          {/* LOGO — now blinking & fading */}
          <div className="animate-pulseFade">
            <svg
              width={size}
              height={size}
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden
            >
              <path
                d="M32 4c12 0 24 4 24 4v18c0 16-12 26-24 34C20 52 8 42 8 26V8s12-4 24-4Z"
                fill="#0F5F7F"
              />
              <path
                d="M38 19c3 0 6 2 7 5 1 3-1 6-3 8-5 4-12 6-16 4 2-1 3-3 4-5 1-3 5-12 8-12Z"
                fill="#071827"
              />
              <circle
                cx="41.5"
                cy="23.5"
                r="1.3"
                fill="#FFFFFF"
                opacity=".9"
              />
            </svg>
          </div>

          {/* spinner ring */}
          {/* <div className="absolute inset-0 grid place-items-center">
            <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div> */}
        </div>

        <div className="text-sm text-white/90 font-medium">{label}</div>
      </div>
    </div>
  );
}
