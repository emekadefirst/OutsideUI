import React, { useState } from 'react';
import { X, Plus, Trash2, Mail } from 'lucide-react';
import { useAuthStore, useOrdersStore } from '../../stores';

const TicketPurchaseModal = ({ isOpen, onClose, ticket, eventId }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { createOrder, loading } = useOrdersStore();
  const [step, setStep] = useState('initial'); // 'initial', 'others', 'email', 'success', 'error'
  const [emails, setEmails] = useState(['']);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [includeMe, setIncludeMe] = useState(true);
  const [error, setError] = useState(null);

  const resetModal = () => {
    setStep('initial');
    setEmails(['']);
    setBuyerEmail('');
    setIncludeMe(true);
    setError(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleJustMe = async () => {
    if (!isAuthenticated) {
      setStep('email');
      return;
    }
    await submitOrder([]);
  };

  const handleBuyForOthers = () => {
    setStep('others');
  };

  const submitOrder = async (otherEmails = []) => {
    try {
      const details = [];
      
      // Add buyer if they want to include themselves
      if (includeMe) {
        const buyerEmailFormatted = isAuthenticated ? user?.email : buyerEmail;
        if (buyerEmailFormatted) {
          details.push({
            email: buyerEmailFormatted,
            ticket_id: ticket.id
          });
        }
      }

      // Add other recipients
      otherEmails.forEach(email => {
        if (email.trim()) {
          details.push({
            email: email.trim(),
            ticket_id: ticket.id
          });
        }
      });

      const buyerEmailFormatted = isAuthenticated ? user?.email : buyerEmail;
      const orderData = {
        buyer_email: buyerEmailFormatted,
        detail: details
      };
      
      // Only add buyer_id if user is authenticated
      if (isAuthenticated && user?.id) {
        orderData.buyer_id = user.id;
      }

      const response = await createOrder(orderData);
      if (response?.url) {
        window.location.href = response.url;
      } else {
        setStep('success');
      }
    } catch (err) {
      console.error('Order failed:', err);
      setError(err.response?.data?.message || 'Failed to process order');
      setStep('error');
    }
  };

  const handleSubmitOthers = () => {
    const validEmails = emails.filter(email => email.trim());
    if (validEmails.length === 0 && !includeMe) {
      return;
    }
    
    if (!isAuthenticated && !buyerEmail.trim()) {
      setStep('email');
      return;
    }

    submitOrder(validEmails);
  };

  const handleEmailSubmit = () => {
    if (step === 'email' && buyerEmail.trim()) {
      if (emails.some(email => email.trim())) {
        submitOrder(emails.filter(email => email.trim()));
      } else {
        submitOrder([]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Purchase Tickets</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {step === 'initial' && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">{ticket.name}</h3>
                <p className="text-orange-400 font-bold">{ticket.currency} {ticket.cost}</p>
              </div>
              
              {!isAuthenticated && (
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm">Your email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              )}
              
              <p className="text-white/70 text-center">Who are you buying tickets for?</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleJustMe}
                  disabled={loading || (!isAuthenticated && !buyerEmail.trim())}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  Just Me
                </button>
                
                <button
                  onClick={handleBuyForOthers}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all border border-white/10"
                >
                  Buy for Others
                </button>
              </div>
            </div>
          )}

          {step === 'others' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Add Recipients</h3>
                <button
                  onClick={() => setStep('initial')}
                  className="text-white/70 hover:text-white text-sm"
                >
                  Back
                </button>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="block text-white/70 text-sm mb-2">Include myself</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={includeMe}
                    onChange={(e) => setIncludeMe(e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500"
                  />
                  <span className="text-white text-sm">
                    {isAuthenticated ? `Yes, include a ticket for ${user?.email || 'me'}` : 'Yes, include a ticket for me'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-white/70 text-sm">Email addresses</label>
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        placeholder="Enter email address"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    {emails.length > 1 && (
                      <button
                        onClick={() => removeEmailField(index)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  onClick={addEmailField}
                  className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add another email</span>
                </button>
              </div>

              <button
                onClick={handleSubmitOthers}
                disabled={loading || (!includeMe && !emails.some(email => email.trim()))}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Purchase Tickets'}
              </button>
            </div>
          )}

          {step === 'email' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Your Email</h3>
                <button
                  onClick={() => setStep(emails.some(email => email.trim()) ? 'others' : 'initial')}
                  className="text-white/70 hover:text-white text-sm"
                >
                  Back
                </button>
              </div>

              <p className="text-white/70 text-sm">We need your email to process the order</p>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-10 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                onClick={handleEmailSubmit}
                disabled={loading || !buyerEmail.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Purchase Tickets'}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Order Successful!</h3>
              <p className="text-white/70">Your tickets have been purchased successfully. Check your email for confirmation.</p>
              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all"
              >
                Done
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Order Failed</h3>
              <p className="text-white/70">{error}</p>
              <div className="space-y-2">
                <button
                  onClick={() => setStep('initial')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketPurchaseModal;