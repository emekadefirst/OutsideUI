import React from "react";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative z-30 h-full flex flex-col justify-end pb-32 px-6 md:px-20">
      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-8xl font-extrabold text-white tracking-tight leading-none mb-6">
          Your Night.
          <br />
          Your Vibe.
        </h1>
        <p className="text-white text-lg md:text-xl mb-8 max-w-2xl">
          Join the revolution of nightlife. Exclusive access to the hottest
          venues, real-time crowd updates, and instant ticket securing.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform inline-flex items-center justify-center">
            Explore
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
