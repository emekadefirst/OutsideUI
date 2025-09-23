import React, { memo } from "react";

const ErrorState = memo(({ onRetry }) => (
  <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-12 text-center border border-red-500/20">
    <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-white text-xl font-semibold mb-2">Oops! Something went wrong</h3>
    <p className="text-white/70 mb-8 max-w-md mx-auto">
      We couldn't load the events right now. Please check your connection and try again.
    </p>
    <button
      onClick={onRetry}
      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
    >
      Try Again
    </button>
  </div>
));

ErrorState.displayName = 'ErrorState';

export default ErrorState;