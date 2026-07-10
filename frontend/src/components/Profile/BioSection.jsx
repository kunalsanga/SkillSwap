import React, { useState } from 'react';

/**
 * Renders user bio with an expandable "Read More" trigger.
 */
const BioSection = ({ bio }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!bio) {
    return (
      <p className="text-sm text-gray-450 italic">
        No bio has been added to this profile yet.
      </p>
    );
  }

  const limit = 180;
  const shouldTruncate = bio.length > limit;
  const displayText = shouldTruncate && !isExpanded ? `${bio.slice(0, limit)}...` : bio;

  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap font-medium">
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-extrabold text-indigo-650 hover:text-indigo-800 transition-colors focus:outline-none focus:underline"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default BioSection;
