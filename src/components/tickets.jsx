import React, { useEffect, useState } from "react";


const TicketsComponent = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("https://ideological-ardella-emekadefirst-f109542f.koyeb.app/api/v1/tickets/");
        const data = await response.json();

        if (data.tickets && data.tickets.length > 0) {
          setTickets(data.tickets);
        } else {
          console.error("No tickets found in the response");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Available Tickets
        </h2>

        {loading ? (
          <div className="flex justify-center items-center">
            <p className="text-white text-lg">Loading tickets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4">
                    <img
                      src={ticket.banner}
                      alt={ticket.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-orange-500 text-sm font-semibold">
                          {ticket.date}
                        </span>
                        <span className="text-white/50 text-sm">
                          {ticket.time}
                        </span>
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">
                        {ticket.name}
                      </h3>
                      <p className="text-white/70 mb-4">{ticket.venue}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-white/50 text-sm">
                          Available: {ticket.quantity}
                        </span>
                        <span className="text-white/50 text-sm">
                          ₦{ticket.unit_price}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors">
                        Add to Watchlist
                      </button>
                      <button className="flex-1 md:flex-none bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:scale-105 transition-transform">
                        Cop Tickets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TicketsComponent;
