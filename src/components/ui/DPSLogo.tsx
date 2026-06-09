import React from "react";

export function DPSLogoIcon({
  className = "h-6 w-auto",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 22 26"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Page frame */}
      <rect
        x="1.25"
        y="5"
        width="15"
        height="19.5"
        rx="2.6"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
      />
      {/* 4-pointed sparkle at top-right corner of the frame */}
      <path
        d="M16.25 2 L17.1 4.1 L19.2 5 L17.1 5.9 L16.25 8 L15.4 5.9 L13.3 5 L15.4 4.1 Z"
        fill="currentColor"
      />
      {/* Subtle content lines inside the page */}
      <line
        x1="4.5"
        y1="13"
        x2="13"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.35"
      />
      <line
        x1="4.5"
        y1="17"
        x2="15"
        y2="17"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export function DPSLogoFull({
  className = "",
  iconClass = "h-5 w-auto",
  nameClass = "text-[15px] font-semibold tracking-tight",
}: {
  className?: string;
  iconClass?: string;
  nameClass?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <DPSLogoIcon className={iconClass} />
      <span className={nameClass} style={{ letterSpacing: "-0.015em" }}>
        Dream<span style={{ fontWeight: 300 }}>Page</span>
        <span
          style={{ fontSize: "0.7em", fontWeight: 400, letterSpacing: "0.1em", opacity: 0.55 }}
        >
          {" "}STUDIO
        </span>
      </span>
    </div>
  );
}

export function DPSLogoStacked({
  className = "",
  size = 52,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div style={{ height: size }} className="flex items-center">
        <DPSLogoIcon className="h-full w-auto" />
      </div>
      <div className="text-center leading-none">
        <div
          className="font-semibold tracking-tight"
          style={{ fontSize: size * 0.3, letterSpacing: "-0.02em" }}
        >
          Dream<span style={{ fontWeight: 300 }}>Page</span>
        </div>
        <div
          className="tracking-widest"
          style={{ fontSize: size * 0.16, fontWeight: 400, opacity: 0.45, letterSpacing: "0.2em" }}
        >
          STUDIO
        </div>
      </div>
    </div>
  );
}
