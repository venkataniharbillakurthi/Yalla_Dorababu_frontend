import React, { useRef } from "react";

// Interactive FallingText: letters fall down on hover/click
export default function FallingText({ text, className = "", style = {}, ...props }) {
  const spansRef = useRef([]);

  // Trigger the fall animation on hover/click
  const triggerFall = (idx) => {
    const span = spansRef.current[idx];
    if (!span) return;
    span.classList.remove("falling-text-animate");
    // Force reflow to restart animation
    void span.offsetWidth;
    span.classList.add("falling-text-animate");
    // Remove class after animation so it can be triggered again
    setTimeout(() => {
      span.classList.remove("falling-text-animate");
    }, 1200);
  };

  return (
    <span
      className={`inline-block overflow-visible whitespace-pre-wrap ${className}`}
      style={{ display: "inline-block", ...style }}
      {...props}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={el => spansRef.current[i] = el}
          style={{ display: "inline-block", cursor: char !== " " ? "pointer" : undefined }}
          onMouseEnter={() => char !== " " && triggerFall(i)}
          onClick={() => char !== " " && triggerFall(i)}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <style>{`
        .falling-text-animate {
          animation: falling-text-interactive 1.1s cubic-bezier(.23,1.18,.67,1.01) both;
        }
        @keyframes falling-text-interactive {
          0% {
            transform: none;
            opacity: 1;
            filter: none;
          }
          10% {
            filter: brightness(2);
          }
          40% {
            filter: blur(1px);
          }
          80% {
            opacity: 0.7;
            filter: blur(0.5px) brightness(1.2);
          }
          100% {
            transform: translateY(3.5em) rotateZ(30deg) skewY(25deg) scaleY(2.5);
            opacity: 0;
            filter: blur(2px) brightness(2.5);
          }
        }
      `}</style>
    </span>
  );
}
