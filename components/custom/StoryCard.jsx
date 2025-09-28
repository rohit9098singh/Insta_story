'use client';

import { useState } from 'react';

/**
 * StoryCard Component - Individual story thumbnail with gradient border
 */
export default function StoryCard({ user, onClick, isViewed = false }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-105"
      onClick={onClick}
    >
      {/* Story thumbnail with Instagram-like gradient border */}
      <div className={`
        relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr
        ${isViewed 
          ? 'from-gray-300 to-gray-400' 
          : 'from-purple-400 via-pink-500 to-red-500'
        }
      `}>
        {/* White inner circle */}
        <div className="w-full h-full rounded-full bg-white p-0.5">
          {imageError ? (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">!</span>
            </div>
          ) : (
            <img
              src={user.profileImage || user.stories[0]?.image}
              alt={`${user.username}'s story`}
              className="w-full h-full rounded-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>
      </div>
      
      {/* Username */}
      <span className="text-xs text-black font-semibold mt-1 text-center truncate max-w-16">
        {user.username}
      </span>
    </div>
  );
}