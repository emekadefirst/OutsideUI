import React from "react";

const AboutPage = () => {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-28 px-6 bg-[url('/images/about-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Outside Ticket
          </h1>
          <p className="text-lg text-gray-300">
            Your Experience Starts Here
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-8 leading-relaxed text-gray-300">
        <p>
          At <span className="font-semibold text-white">Outside Ticket</span>, we believe life’s best moments happen beyond the ordinary. 
          We’re not just a ticket marketplace — we’re your connection to unforgettable experiences. 
          Whether it’s the roar of a crowd, the rhythm of a live band, the laughter in a packed theatre, 
          or the thrill of a final whistle, we bring people together through the power of live events.
        </p>

        <p>
          Our platform gives you easy access to events across music, sports, comedy, theatre, and festivals — 
          all in one trusted place. With a few clicks, you can explore, buy, or sell tickets securely, 
          no matter where you are or what device you’re using.
        </p>

        <p>
          We’ve built Outside Ticket for the passionate — for those who live for energy, emotion, and real-world moments. 
          From front-row seats to hidden gems, we make sure you never miss out on what moves you most.
        </p>

        <p>
          And if your plans change? No stress. You can resell your tickets safely, knowing every transaction 
          is protected under our <span className="font-semibold text-white">100% Buyer and Seller Confidence Policy.</span>
        </p>

        <p>
          At Outside Ticket, our mission is simple: to make live experiences accessible, secure, and unforgettable. 
          Because the world is happening outside — and your ticket is waiting.
        </p>

        <p className="italic text-lg text-white font-medium">
          Outside Ticket — Go where the moments take you.
        </p>
      </section>

    </div>
  );
};

export default AboutPage;
