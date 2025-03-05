import React from "react";
import NavBar from "../components/navBar";
import bgImage from "../assets/images/image.jpg";
import Footer from "../components/footer";
import Hero from "../components/hero";

const HomePage = () => {
  return (
    <div style={{ backgroundImage: `url(${bgImage})` }}className="bg-cover bg-center h-screen">
      <NavBar className="mt-0 mb-8" />

        <Hero />

      <Footer />
    </div>
  );
};


export default HomePage;