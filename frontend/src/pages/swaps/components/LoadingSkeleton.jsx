import React from 'react';

/**
 * Loading skeleton to provide premium, interactive visual feedback.
 */
const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 w-full" aria-busy="true" aria-label="Loading contents">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="p-6 bg-white rounded-2xl border border-gray-100/80 shadow-sm animate-pulse space-y-5"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Profile Photo Placeholder */}
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              {/* Name & Date Placeholder */}
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded-md" />
                <div className="h-3 w-24 bg-gray-200 rounded-md" />
              </div>
            </div>
            {/* Badge Placeholder */}
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>

          {/* Message Placeholder */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 rounded" />
          </div>

          {/* Skills Grid Placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100/50">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-6 w-28 bg-gray-200 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-200 rounded" />
              <div className="h-6 w-28 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
