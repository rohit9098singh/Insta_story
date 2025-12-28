'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * StoryViewer Component - Full-screen story viewer with auto-progression and navigation
 */
export default function StoryViewer({ users, initialUserIndex, onClose, onUserViewed }) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const STORY_DURATION = 5000; // 5 seconds
  
  const currentUser = users[currentUserIndex];
  const currentStoryData = currentUser?.stories[currentStoryIndex];

  // Reset and start progress timer
  const startProgressTimer = () => {
    if (isPaused) return;
    
    // Clear existing timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    setProgress(0);
    startTimeRef.current = Date.now();
    
    // Progress bar animation
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(progressIntervalRef.current);
      }
    }, 50);
    
    // Auto advance timer
    timerRef.current = setTimeout(() => {
      goToNext();
    }, STORY_DURATION);
  };

  // Navigate to next story
  const goToNext = () => {
    // Check if there are more stories for current user
    if (currentStoryIndex < currentUser.stories.length - 1) {
      // Go to next story of same user
      setCurrentStoryIndex(prev => prev + 1);
      setIsLoading(true);
    } else {
      // Mark current user as viewed when all their stories are done
      onUserViewed(currentUser.userId);
      
      if (currentUserIndex < users.length - 1) {
        // Go to first story of next user
        setCurrentUserIndex(prev => prev + 1);
        setCurrentStoryIndex(0);
        setIsLoading(true);
      } else {
        // Close viewer when reaching the end
        onClose();
      }
    }
  };

  // Navigate to previous story
  const goToPrevious = () => {
    // Check if there are previous stories for current user
    if (currentStoryIndex > 0) {
      // Go to previous story of same user
      setCurrentStoryIndex(prev => prev - 1);
      setIsLoading(true);
    } else if (currentUserIndex > 0) {
      // Go to last story of previous user
      const prevUser = users[currentUserIndex - 1];
      setCurrentUserIndex(prev => prev - 1);
      setCurrentStoryIndex(prevUser.stories.length - 1);
      setIsLoading(true);
    } else {
      // Close viewer if at first story
      onClose();
    }
  };

  // Handle close and mark as viewed
  const handleClose = () => {
    // Mark current user as viewed when closing
    if (currentStoryIndex === currentUser.stories.length - 1) {
      onUserViewed(currentUser.userId);
    }
    onClose();
  };

  // Handle tap navigation
  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    // Clear current timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    if (x < width / 2) {
      // Tapped left side - go to previous
      goToPrevious();
    } else {
      // Tapped right side - go to next
      goToNext();
    }
  };

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Start timer when story loads
  useEffect(() => {
    if (!isLoading) {
      startProgressTimer();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentUserIndex, currentStoryIndex, isLoading, isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
        case ' ':
          goToNext();
          break;
        case 'Escape':
          handleClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUserIndex, currentStoryIndex]);

  if (!currentStoryData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header with progress bars */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        {/* Progress indicators - Show progress for current user's stories */}
        <div className="flex gap-1 mb-4">
          {currentUser.stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: index < currentStoryIndex ? '100%' : 
                         index === currentStoryIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Story header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500 p-0.5">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <img
                  src={currentUser.profileImage || currentStoryData.image}
                  alt={currentUser.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-white font-medium text-sm">
              {currentUser.username}
            </span>
            <span className="text-white/70 text-xs">now</span>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white text-2xl font-light leading-none"
            aria-label="Close story"
          >
            ×
          </button>
        </div>
      </div>

      {/* Story content */}
      <div 
        className="flex-1 relative flex items-center justify-center cursor-pointer"
        onClick={handleTap}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent"></div>
          </div>
        )}
        
        {/* Story image */}
        <img
          src={currentStoryData.image}
          alt={`${currentUser.username}'s story`}
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={() => setIsLoading(false)}
        />
        
        {/* Invisible tap areas for navigation hints */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" aria-label="Previous story" />
          <div className="flex-1" aria-label="Next story" />
        </div>
      </div>

      {/* Navigation indicators (optional visual hint) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 text-white/50 text-xs">
        <span>← Tap left</span>
        <span>|</span>
        <span>Tap right →</span>
      </div>
    </div>
  );
}