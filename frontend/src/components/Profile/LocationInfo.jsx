import React from 'react';
import { MapPin } from 'lucide-react';

/**
 * Renders location cleanly with a map marker icon.
 */
const LocationInfo = ({ location }) => {
  if (!location) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-600 font-semibold">
      <MapPin className="h-4.5 w-4.5 text-indigo-500 flex-shrink-0" aria-hidden="true" />
      <span>{location}</span>
    </div>
  );
};

export default LocationInfo;
