import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Mail, CreditCard } from 'lucide-react';
import { useOrdersStore, useAuthStore } from '../../stores';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createOrder, loading } = useOrdersStore();
  const { user, isAuthenticated, getUser } = useAuthStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && !user) {
      getUser();
    }
  }, [isAuthenticated, user, getUser]);

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
        detail: details
      };
      
      if (isAuthenticated && user) {
        orderData.buyer_id = user.id;
      } else {
        orderData.buyer_email = buyerEmail;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6">
              {/* Event Info */}
              <div>
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

              {/* User Details */}
              {isAuthenticated && user && (
                <div className="border-t border-white/10 pt-6">
                  <h2 className="text-xl font-bold mb-4">Buyer Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <User className="w-4 h-4 text-orange-400" />
                      <span className="flex-1">{user.first_name} {user.last_name}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <Mail className="w-4 h-4 text-orange-400" />
                      <span className="flex-1">{user.email}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Ticket Recipients */}
              <div className="border-t border-white/10 pt-6">
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
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-lg text-white">{ticket.name}</p>
                      <p className="text-sm text-white/70">{recipients.length} ticket{recipients.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-400">
                        {ticket.currency} {ticket.cost}
                      </p>
                    </div>
                  </div>
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
                className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                {loading ? 'Processing...' : 'Get Tickets'}
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