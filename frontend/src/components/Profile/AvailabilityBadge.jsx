import React from 'react';

/**
 * AvailabilityBadge component renders styled status badges representing availability.
 */
const AvailabilityBadge = ({ availability }) => {
  if (!availability) return null;
  
  const lower = availability.trim().toLowerCase();
  
  let bgStyles = 'bg-amber-50 text-amber-800 border-amber-200';
  let indicatorStyles = 'bg-amber-500';

  if (lower.includes('available') || lower === 'open') {
    bgStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    indicatorStyles = 'bg-emerald-550';
  } else if (lower.includes('busy') || lower === 'unavailable') {
    bgStyles = 'bg-rose-50 text-rose-800 border-rose-200';
    indicatorStyles = 'bg-rose-550';
  } else if (lower.includes('collaboration')) {
    bgStyles = 'bg-purple-50 text-purple-800 border-purple-200';
    indicatorStyles = 'bg-purple-550';
  } else if (lower.includes('opportunities') || lower.includes('looking')) {
    bgStyles = 'bg-blue-50 text-blue-800 border-blue-200';
    indicatorStyles = 'bg-blue-550';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${bgStyles}`}
      role="status"
      aria-label={`Availability: ${availability}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${indicatorStyles}`} aria-hidden="true" />
      {availability}
    </span>
  );
};

export default AvailabilityBadge;
