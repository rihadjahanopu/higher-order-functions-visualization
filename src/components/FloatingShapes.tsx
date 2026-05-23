import React from "react";

export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Circle Shape */}
      <div
        className="absolute opacity-8 blur-[80px] md:opacity-[0.1] animate-float"
        style={{
          top: "10%",
          left: "10%",
          width: "350px",
          height: "350px",
          background: "#60a5fa",
          borderRadius: "50%",
          animationDelay: "0s",
          animationDuration: "25s",
        }}
      />
      {/* Rhombus Shape */}
      <div
        className="absolute opacity-[0.06] blur-[100px] md:opacity-[0.08] animate-float"
        style={{
          top: "60%",
          left: "75%",
          width: "450px",
          height: "450px",
          background: "#a78bfa",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          animationDelay: "-5s",
          animationDuration: "30s",
        }}
      />
      {/* Rounded Square Shape */}
      <div
        className="absolute opacity-[0.05] blur-[90px] md:opacity-[0.07] animate-float"
        style={{
          top: "35%",
          left: "85%",
          width: "280px",
          height: "280px",
          background: "#f472b6",
          borderRadius: "40px",
          animationDelay: "-10s",
          animationDuration: "20s",
        }}
      />
    </div>
  );
}
