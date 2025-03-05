import React from "react";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  const handleEarlyAccess = () => {
    console.log("Early Access Requested");
  };

  const handleWatchDemo = () => {
    console.log("Watch Demo Clicked");
  };

  return (
    <div className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Gradient and Noise Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90 z-10"></div>
      <div
        className="absolute inset-0 opacity-10 z-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), 
            linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%), 
            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%)`,
          backgroundSize: "4px 4px",
        }}
      ></div>

      {/* Hero Content */}
      <div className="relative z-30 text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Our Platform
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Join the future of AI-driven technology today. Experience seamless
          innovation.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleEarlyAccess}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2 transition"
          >
            Get Early Access <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleWatchDemo}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center gap-2 transition"
          >
            <Play className="w-5 h-5" /> Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
