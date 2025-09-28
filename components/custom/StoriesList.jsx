'use client';

import StoryCard from './StoryCard';

/**
 * StoriesList Component - Horizontal scrollable list of story thumbnails
 */
export default function StoriesList({ users, onStoryClick, viewedUsers = [] }) {
  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="px-4">
        <h2 className="text-sm font-semibold text-orange-700 mb-3">Stories</h2>
        
        {/* Horizontal scrollable container */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {users.map((user, index) => (
            <div key={user.userId} className="flex-shrink-0">
              <StoryCard
                user={user}
                onClick={() => onStoryClick(index)}
                isViewed={viewedUsers.includes(user.userId)}
              />
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}