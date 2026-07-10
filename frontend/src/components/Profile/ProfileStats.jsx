import React from 'react';
import { Award, HelpCircle, Star, MessageSquare } from 'lucide-react';

/**
 * Renders user statistics cards (skills count, average rating, feedbacks count).
 */
const ProfileStats = ({ skills = [], feedbacks = [] }) => {
  const offeredCount = skills.filter((s) => s.type === 'OFFERED').length;
  const wantedCount = skills.filter((s) => s.type === 'WANTED').length;
  const reviewsCount = feedbacks.length;
  const averageRating = reviewsCount
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / reviewsCount).toFixed(1)
    : 'N/A';

  const stats = [
    {
      label: 'Teaching',
      value: offeredCount,
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border border-emerald-100/50',
    },
    {
      label: 'Learning',
      value: wantedCount,
      icon: HelpCircle,
      color: 'text-blue-600 bg-blue-50 border border-blue-100/50',
    },
    {
      label: 'Rating',
      value: averageRating,
      icon: Star,
      color: 'text-yellow-600 bg-yellow-50 border border-yellow-100/50',
    },
    {
      label: 'Reviews',
      value: reviewsCount,
      icon: MessageSquare,
      color: 'text-indigo-650 bg-indigo-50 border border-indigo-100/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/50 backdrop-blur-sm border border-gray-150 p-4 rounded-3xl shadow-2xs">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/70 transition-all duration-300"
        >
          <div className={`p-2.5 rounded-xl ${stat.color} flex-shrink-0`}>
            <stat.icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-base font-black text-gray-900 leading-none">{stat.value}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
