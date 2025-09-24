import React, { memo } from "react";

const EmptyState = memo(() => (
  <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
    <div className="w-20 h-20 mx-auto mb-6 bg-orange-500/20 rounded-full flex items-center justify-center">
      <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 5V3a2 2 0 012-2h4a2 2 0 012 2v4M3 11h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V11z" />
      </svg>
    </div>
    <h3 className="text-white text-xl font-semibold mb-2">No Events Available</h3>
    <p className="text-white/70">
      There are no events available at this time. Check back soon for exciting new events!
    </p>
  </div>
));

EmptyState.displayName = 'EmptyState';

export default EmptyState;