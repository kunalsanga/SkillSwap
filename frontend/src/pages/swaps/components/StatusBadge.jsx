import React from 'react';

/**
 * Renders a Tailwind CSS styled status badge representing swap request states.
 * Accessibility-friendly with proper contrast and role attribute.
 */
const StatusBadge = ({ status }) => {
  const normalizedStatus = status ? status.toUpperCase() : 'PENDING';
  
  let badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
  let indicatorStyle = 'bg-amber-400';
  
  switch (normalizedStatus) {
    case 'ACCEPTED':
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      indicatorStyle = 'bg-emerald-500';
      break;
    case 'REJECTED':
      badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200';
      indicatorStyle = 'bg-rose-500';
      break;
    case 'COMPLETED':
      badgeStyle = 'bg-blue-50 text-blue-800 border-blue-200';
      indicatorStyle = 'bg-blue-500';
      break;
    case 'CANCELLED':
      badgeStyle = 'bg-gray-50 text-gray-600 border-gray-200';
      indicatorStyle = 'bg-gray-400';
      break;
    case 'PENDING':
    default:
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
      indicatorStyle = 'bg-amber-400';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeStyle}`}
      role="status"
      aria-label={`Request status: ${normalizedStatus.toLowerCase()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${indicatorStyle}`} aria-hidden="true" />
      {normalizedStatus}
    </span>
  );
};

export default StatusBadge;
