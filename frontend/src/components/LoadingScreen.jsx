import React from "react";

export default function LoadingScreen({ size = 66, label = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">

          {/* LOGO — now blinking & fading */}
          <div className="animate-pulseFade">
             <img
    src="/logo.png"
    alt="New Apex Bank"
    className="h-10 w-auto object-contain"
  />
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
