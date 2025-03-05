import React from "react";
import NavBar from "../components/navBar";
import bgImage from "../assets/images/image.jpg";
import Footer from "../components/footer";
import Hero from "../components/hero";
import Action from "../components/action";

const HomePage = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark Overlay with Low Opacity */}
      <div className="absolute inset-0 bg-black-10 bg-opacity-100"></div>

      {/* Content Above Overlay */}
      <NavBar className="relative z-10 mt-0 mb-8" />
      <Hero className="relative z-10 mt-10" />
      <Action />
      <Footer className="relative z-10" />
    </div>
  );
};

export default HomePage;
