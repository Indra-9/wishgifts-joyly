
import React from 'react';

const WishlistLoading = () => {
  return (
    <div className="animate-pulse mt-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8" />
      
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-xl" />
            <div className="p-4 border border-gray-200 dark:border-gray-800 border-t-0 rounded-b-xl">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistLoading;
