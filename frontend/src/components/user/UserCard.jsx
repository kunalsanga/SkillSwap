import React from 'react';
import { User, MapPin, Clock } from 'lucide-react';
import SkillBadge from '../common/SkillBadge';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  const offeredSkills = user.skills?.filter((s) => s.type === 'OFFERED') || [];
  const wantedSkills = user.skills?.filter((s) => s.type === 'WANTED') || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </div>
              )}
              {user.availability && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {user.availability}
                </div>
              )}
            </div>
          </div>
        </div>
        <Link
          to={`/profile/${user.id}`}
          className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          View Profile
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Can Teach</h4>
          <div className="flex flex-wrap gap-2">
            {offeredSkills.length > 0 ? (
              offeredSkills.map((s) => (
                <SkillBadge key={s.id} name={s.skill.name} type="OFFERED" />
              ))
            ) : (
              <span className="text-sm text-gray-500">None listed</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Wants to Learn</h4>
          <div className="flex flex-wrap gap-2">
            {wantedSkills.length > 0 ? (
              wantedSkills.map((s) => (
                <SkillBadge key={s.id} name={s.skill.name} type="WANTED" />
              ))
            ) : (
              <span className="text-sm text-gray-500">None listed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
