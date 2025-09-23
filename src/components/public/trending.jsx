import React from "react";
import eventImage from "/src/assets/images/lungu-boy.jpg"; 
import { MapPin } from "lucide-react";

const TrendingComponent = () => {
  return (
    <section className="py-20 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Trending
          </h2>
          <a
            href="/tickets"
            className="text-white/70 hover:text-white text-sm font-medium"
          >
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="recent">
          <div className="group relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10"></div>
            <img
              src={eventImage}
              alt="Event"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <span className="text-white/70 text-sm mb-2 block">
                SAT • DEC 15 • 10PM
              </span>
              <h3 className="text-white text-xl font-bold mb-2">
                Neon Dreams Festival
              </h3>
              <p className="text-white/70 text-sm">
                Downtown Underground • 1.2k going
              </p>
              <p className="text-white/70 text-sm flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Lagos, Nigeria, 15mins away</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingComponent;
