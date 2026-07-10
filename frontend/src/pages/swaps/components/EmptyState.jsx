import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

/**
 * Reusable premium Empty State view.
 */
const EmptyState = ({ message, description }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100/60 mb-5">
        <ArrowRightLeft className="h-8 w-8 text-indigo-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{message || 'No swap requests found'}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md">
        {description || 'Once swap activities begin, they will populate here. Explore skill matches to initiate a request!'}
      </p>
    </div>
  );
};

export default EmptyState;
