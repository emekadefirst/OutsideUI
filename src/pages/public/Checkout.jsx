import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Mail, CreditCard } from 'lucide-react';
import { useOrdersStore } from '../../stores';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createOrder, loading } = useOrdersStore();
  const [error, setError] = useState(null);

  const checkoutData = location.state;

  if (!checkoutData) {
    navigate('/');
    return null;
  }

  const { event, ticket, recipients, buyerEmail, buyerId } = checkoutData;
  const totalAmount = recipients.length * ticket.cost;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handlePayment = async () => {
    try {
      setError(null);
      
      const details = recipients.map(recipient => ({
        email: recipient.email,
        ticket_id: ticket.id
      }));

      const orderData = {
        buyer_email: buyerEmail,
        detail: details
      };
      
      if (buyerId) {
        orderData.buyer_id = buyerId;
      }

      const response = await createOrder(orderData);
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event & Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-4">Event Details</h2>
              <div className="flex gap-4">
                <img
                  src={event.banner}
                  alt={event.title}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <div className="space-y-1 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.time[0])} at {formatTime(event.time[0])}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Hosted by {event.host.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Recipients */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-4">Ticket Recipients</h2>
              <div className="space-y-3">
                {recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span className="flex-1">{recipient.email}</span>
                    {recipient.isMe && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{ticket.name}</p>
                    <p className="text-sm text-white/70">{recipients.length} ticket{recipients.length > 1 ? 's' : ''}</p>
                  </div>
                  <p className="font-bold text-orange-400">
                    {ticket.currency} {ticket.cost}
                  </p>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl text-orange-400">
                      {ticket.currency} {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {loading ? 'Processing...' : 'Pay Now'}
              </button>

              <p className="text-xs text-white/50 text-center mt-4">
                Secure checkout powered by Paystack
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;