import React from 'react';
import { Star } from 'lucide-react';
import RatingCard from '../rating/RatingCard';

/**
 * ProfileInfo component.
 * Displays reviews and feedback submitted by other users.
 */
const ProfileInfo = ({ feedbacks = [] }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-5 sm:p-6 shadow-sm">
      <h3 className="text-lg font-black text-gray-900 mb-5">Reviews & Feedback</h3>
      
      {feedbacks.length > 0 ? (
        <div className="space-y-4" role="list">
          {feedbacks.map((feedback) => (
            <RatingCard key={feedback.id} rating={feedback} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
          <Star className="mx-auto h-8 w-8 text-gray-350 mb-3" aria-hidden="true" />
          <p className="text-sm text-gray-450 italic font-semibold">No feedback reviews available yet.</p>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
