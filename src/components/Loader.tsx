import React from "react";

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen w-screen absolute top-0 left-0">
      <div className="absolute top-0 left-0 w-full h-full bg-black/90"></div>
      <svg width="60" height="60" viewBox="0 0 50 50" className="scale-200">
        <defs>
          <linearGradient id="holoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF2056" stopOpacity="0.2"></stop>
            <stop offset="50%" stopColor="#FF2056" stopOpacity="0.8"></stop>
            <stop offset="100%" stopColor="#FF2056" stopOpacity="0.2"></stop>
            <animate
              attributeName="x1"
              values="0%;100%;0%"
              dur="3s"
              repeatCount="indefinite"
            ></animate>
          </linearGradient>
        </defs>
        <g>
          <path
            d="M15,15 L35,15 L35,35 L15,35 Z"
            fill="none"
            stroke="url(#holoGradient)"
            strokeWidth="2"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="3s"
              repeatCount="indefinite"
            ></animateTransform>
          </path>
          <path
            d="M10,20 L30,20 L30,40 L10,40 Z"
            fill="none"
            stroke="url(#holoGradient)"
            strokeWidth="2"
            opacity="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 25 25"
              to="0 25 25"
              dur="3s"
              repeatCount="indefinite"
            ></animateTransform>
          </path>
        </g>
      </svg>
    </div>
  );
}

export default Loader;
