import React from "react";
import NavBar from "../../components/public/navBar";
import Footer from "../../components/public/footer";
import TicketsComponent from "../../components/public/tickets"


const Tickets = () => {
  return (
    <div className="relative h-screen bg-cover bg-center bg-black hero-bg">
      {/* Dark Overlay with Low Opacity */}
      <div className="absolute inset-0 bg-black-10 bg-opacity-100"></div>

      {/* Content Above Overlay */}

        <TicketsComponent />
    </div>
  );
};

export default Tickets;


