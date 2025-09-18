import React, { useEffect, useState } from "react";

const TicketsComponent = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          "https://ideological-ardella-emekadefirst-f109542f.koyeb.app/api/v1/tickets/"
        );
        const data = await response.json();

        if (data.tickets && data.tickets.length > 0) {
          setTickets(data.tickets);
        } else {
          setError("No tickets found in the response");
        }
      } catch (error) {
        setError("Error fetching tickets: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Available Tickets
          </h2>

          {!loading && !error && tickets.length > 0 && (
            <p className="text-white/70 text-sm">
              Showing {tickets.length} events
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-t-orange-500 border-white/30 rounded-full animate-spin mb-4"></div>
            <p className="text-white/70">Loading tickets...</p>
          </div>
        ) : error ? (
          <div className="bg-white/5 rounded-xl p-8 text-center">
            <p className="text-white/70 mb-4">
              Unable to load tickets at this time
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket._id}
                  ticket={ticket}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>

            {tickets.length === 0 && (
              <div className="bg-white/5 rounded-xl p-8 text-center">
                <p className="text-white/70">
                  No tickets available at this time
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// Extracted TicketCard component for better organization
const TicketCard = ({ ticket, formatCurrency }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine availability status and styling
  const getAvailabilityStatus = (quantity) => {
    if (quantity <= 0) return { text: "Sold Out", className: "text-red-500" };
    if (quantity < 10)
      return { text: "Almost Gone", className: "text-orange-500" };
    return { text: `${quantity} Available`, className: "text-green-500" };
  };

  const availability = getAvailabilityStatus(ticket.quantity);

  return (
    <div
      className={`bg-white/5 rounded-xl overflow-hidden transition-all duration-300 ${
        isHovered ? "shadow-lg shadow-white/5 translate-y-[-4px]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-1/3 relative">
          <img
            src={ticket.banner}
            alt={ticket.name}
            className="w-full h-52 md:h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
          <div className="absolute top-0 left-0 bg-black/70 text-xs px-3 py-1 m-2 rounded-full">
            {ticket.date}
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col h-full">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-orange-500 text-sm font-medium">
                {ticket.time}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/50"></span>
              <span className="text-white/70 text-sm font-medium">
                {ticket.venue}
              </span>
            </div>

            <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
              {ticket.name}
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-sm font-semibold ${availability.className}`}
              >
                {availability.text}
              </span>
              <div className="flex items-center">
                <span className="text-white font-bold text-lg">
                  {formatCurrency(ticket.unit_price)}
                </span>
                <span className="text-white/50 text-xs ml-1">per ticket</span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row gap-3">
            <button
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
              disabled={ticket.quantity <= 0}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4V20M4 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Watch
            </button>
            <button
              className={`flex-1 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                isHovered ? "scale-105" : ""
              } ${
                ticket.quantity <= 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
              }`}
              disabled={ticket.quantity <= 0}
            >
              Cop Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsComponent;
