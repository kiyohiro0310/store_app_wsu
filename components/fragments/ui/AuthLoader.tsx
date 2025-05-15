import React from 'react';
import CircleLoadingIndicator from './CircleLoadingIndicator';

/**
 * A lightweight loading indicator specifically for auth state transitions
 * Displays a simple loading state without full-screen overlay
 */
const AuthLoader: React.FC = () => {
  return (
    <div className="inline-flex items-center px-3 py-1">
      <div className="h-4 w-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin mr-2"></div>
      <CircleLoadingIndicator />
    </div>
  );
};

export default AuthLoader; 