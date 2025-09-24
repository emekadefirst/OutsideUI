import React, { memo } from "react";

const LoadingState = memo(() => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-t-orange-500 border-white/20 rounded-full animate-spin"></div>
      <div className="w-16 h-16 border-4 border-t-white/40 border-transparent rounded-full animate-spin absolute top-2 left-2"></div>
    </div>
    <p className="text-white/70 mt-6 text-lg">Discovering events near you...</p>
    <p className="text-white/50 mt-2 text-sm">This may take a moment</p>
  </div>
));

LoadingState.displayName = 'LoadingState';

export default LoadingState;