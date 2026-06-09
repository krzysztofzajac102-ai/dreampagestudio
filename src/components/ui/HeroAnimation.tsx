"use client";

export default function HeroAnimation() {
  return (
    <div
      style={{
        position: "relative",
        maxWidth: 700,
        width: "100%",
        margin: "0 auto",
        filter: "drop-shadow(0 0 40px rgba(99, 102, 241, 0.3))",
      }}
    >
      {/* Assembled phone — visible by default, fades out mid-cycle */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/phone-assembled.png"
        alt="DreamPageStudio — strona na telefon"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          animation: "hero-assembled 6s ease-in-out infinite",
        }}
      />
      {/* Exploded layers — overlaid, fades in mid-cycle */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/phone-exploded.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "auto",
          display: "block",
          animation: "hero-exploded 6s ease-in-out infinite",
        }}
      />
    </div>
  );
}
