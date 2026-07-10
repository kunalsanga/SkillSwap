import React from 'react';
import { Edit3, ArrowRightLeft } from 'lucide-react';
import LocationInfo from './LocationInfo';
import AvailabilityBadge from './AvailabilityBadge';
import BioSection from './BioSection';

/**
 * Top profile hero section showing banner, avatar image, bio details, location badges, and action buttons.
 */
const ProfileHeader = ({
  user,
  isOwner = false,
  onEditClick,
  onRequestSwap,
  hasSkills = false,
}) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden flex flex-col">
      {/* Banner */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-750" />

      {/* Hero Body */}
      <div className="px-5 pb-5 pt-0 relative flex flex-col sm:flex-row justify-between items-start gap-4">
        {/* Profile Avatar absolute overlay */}
        <div className="absolute -top-12 sm:-top-16 left-5 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-1.5 shadow-md flex-shrink-0">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={`${user.name}'s profile avatar`}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = ''; // Fallback to initials
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-black text-xl sm:text-2xl border border-indigo-100">
              {getInitials(user.name)}
            </div>
          )}
        </div>

        {/* User profile descriptions */}
        <div className="mt-14 sm:mt-0 sm:pl-36 flex-grow space-y-4 pt-4">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-none">
              {user.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <LocationInfo location={user.location} />
              <AvailabilityBadge availability={user.availability} />
            </div>
          </div>

          <BioSection bio={user.bio} />
        </div>

        {/* Action button triggers */}
        <div className="sm:pt-4 flex-shrink-0 w-full sm:w-auto">
          {isOwner ? (
            <button
              type="button"
              onClick={onEditClick}
              className="w-full flex items-center justify-center gap-2 px-4.5 py-2.5 text-xs sm:text-sm font-bold text-gray-650 bg-white hover:bg-gray-55 border border-gray-200 rounded-xl transition-all shadow-2xs focus:ring-2 focus:ring-gray-250/50"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            hasSkills && (
              <button
                type="button"
                onClick={onRequestSwap}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-650 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100/50 focus:ring-2 focus:ring-indigo-500/25"
              >
                <ArrowRightLeft className="h-4 w-4" />
                <span>Request Swap</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
