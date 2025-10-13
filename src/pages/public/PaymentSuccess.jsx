import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-white/70 mb-8">
            Your tickets have been purchased successfully. Check your email for confirmation and ticket details.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            
            <button
              onClick={() => navigate('/events')}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Browse More Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;