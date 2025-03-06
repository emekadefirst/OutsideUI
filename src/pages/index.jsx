import React from "react";
import NavBar from "./components/navBar"
import Footer from "./components/footer";
import Hero from "./components/hero";
import Action from "./components/action";
import TrendingComponent from "./components/trending";

const HomePage = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center bg-black hero-bg">
      {/* Dark Overlay with Low Opacity */}
      <div className="absolute inset-0 bg-black-10 bg-opacity-100"></div>

      {/* Content Above Overlay */}
      <NavBar className="relative z-10 mt-0 mb-8" />
      <Hero className="relative z-10 mt-10" />
      <TrendingComponent />
      <Action />
      <Footer className="relative z-10" />
    </div>
  );
};

export default HomePage;
