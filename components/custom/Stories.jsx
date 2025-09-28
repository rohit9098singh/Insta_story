'use client';

import { useState, useEffect } from 'react';
import StoriesList from './StoriesList';
import StoryViewer from './StoryViewer';

/**
 * Main Stories Component - Manages story data and viewer state
 */
export default function Stories() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [viewedUsers, setViewedUsers] = useState([]);

  // Fetch stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/stories.json');
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching stories:', error);
        // Set empty array as fallback
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Handle story selection
  const handleStoryClick = (index) => {
    setSelectedUserIndex(index);
  };

  // Handle story viewer close
  const handleViewerClose = () => {
    setSelectedUserIndex(null);
  };

  // Mark user stories as viewed
  const handleUserViewed = (userId) => {
    setViewedUsers(prev => {
      if (!prev.includes(userId)) {
        return [...prev, userId];
      }
      return prev;
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-20 bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  // No stories state
  if (users.length === 0) {
    return (
      <div className="bg-white p-4 text-center">
        <p className="text-gray-500">No stories available</p>
      </div>
    );
  }

  return (
    <div className="stories-container">
      {/* Stories List */}
      <StoriesList
        users={users}
        onStoryClick={handleStoryClick}
        viewedUsers={viewedUsers}
      />
      
      {/* Story Viewer - Full screen overlay */}
      {selectedUserIndex !== null && (
        <StoryViewer
          users={users}
          initialUserIndex={selectedUserIndex}
          onClose={handleViewerClose}
          onUserViewed={handleUserViewed}
        />
      )}
    </div>
  );
}