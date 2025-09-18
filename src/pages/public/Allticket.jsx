import React from "react";
import NavBar from "../../components/public/navBar";
import Footer from "../../components/public/footer";
import TicketsComponent from "../../components/public/tickets"


const Tickets = () => {
  return (
    <div className="relative h-screen bg-cover bg-center bg-black">
      {/* Dark Overlay with Low Opacity */}
      <div className="absolute inset-0 bg-black-10 bg-opacity-100"></div>

      {/* Content Above Overlay */}
      <NavBar className="relative z-10 mt-0 mb-8" />
        <TicketsComponent />
      <Footer className="relative z-10" />
    </div>
  );
};

export default Tickets;
