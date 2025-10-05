import React from "react";
import Footer from "../../components/public/footer";
import Hero from "../../components/public/hero";
import Action from "../../components/public/action";
import TrendingComponent from "../../components/public/trending";

const HomePage = () => {
  return (

    <div className="relative h-screen bg-cover bg-center bg-black hero-bg">
      {/* Dark Overlay with Low Opacity */}
      <div className="absolute inset-0 bg-black-10 bg-opacity-100"></div>

      {/* Content Above Overlay */}

       <Hero className="relative z-10 mt-10" />
      <TrendingComponent />
      <Action />
      <Footer className="relative z-10" />
    </div>

    
  );
};

export default HomePage;

