 
// export default function SpaceBackground() {
//   return (
//     <div className="fixed inset-0 bg-gradient-to-b from-black via-indigo-900 to-purple-900 z-[-1]">
//       <div
//         className="absolute inset-0 bg-[url('/stars.png')] opacity-50 bg-repeat"
//         style={{
//           backgroundSize: "1500px 750px",
//           animation: "twinkling 200s linear infinite",
//         }}
//       ></div>
//     </div>
//   )
// }


"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Lightweight particles engine

export default function SpaceBackground() {
  // Initialize particles
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine); // Loads the slim version of particles
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-[-1]">
      {/* Static stars background - REMOVE OPACITY */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/stars.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 1, // ✅ Ensure full visibility
        }}
      ></div>

      {/* Animated white particles layer */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false }, // Keeps particles inside container
          background: { color: "transparent" },
          particles: {
            number: { value: 100, density: { enable: true, area: 800 } },
            color: { value: "#ffffff" }, // ✅ Only white particles
            shape: { type: "circle" }, // ✅ Circular particles
            opacity: { value: 1, random: false }, // ✅ Fully visible
            size: { value: 2.5, random: true }, // ✅ Slight variation in size
            move: {
              enable: true,
              speed: 0.4, // ✅ Slow drift
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" },
            },
          },
        }}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
