import React from 'react';
import { Star, User } from 'lucide-react';

const RatingCard = ({ rating }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{rating.giver?.name || 'User'}</h4>
            <p className="text-xs text-gray-500">{new Date(rating.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      {rating.feedback && (
        <p className="text-sm text-gray-600 italic">"{rating.feedback}"</p>
      )}
    </div>
  );
};

export default RatingCard;
