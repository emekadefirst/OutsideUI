import React from "react";

const Action = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="beta">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>
      <div className="absolute inset-0 noise-bg"></div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join the Movement
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Be the first to experience the future of nightlife. Early access
            members get exclusive perks and VIP treatment.
          </p>

          {/* Signup Form */}
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-6 py-4 rounded-full bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/25"
            />
            <button
              type="submit"
              className="w-full bg-white text-black px-6 py-4 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Get Priority Access
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Action;
