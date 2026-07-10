import React from 'react';
import { User, CheckCircle, XCircle, Clock } from 'lucide-react';
import SkillBadge from '../common/SkillBadge';
import { useAuth } from '../../hooks/useAuth';

const SwapRequestCard = ({ request, onAccept, onReject, onComplete, onCancel }) => {
  const { user } = useAuth();
  
  // Determine if current user is sender or receiver
  const isSender = request.senderId === user?.id;
  const otherUser = isSender ? request.receiver : request.sender;

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              {isSender ? `You requested a swap with ${otherUser?.name}` : `${otherUser?.name} requested a swap`}
            </h4>
            <p className="text-xs text-gray-500">
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[request.status]}`}>
          {request.status}
        </span>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
              {isSender ? 'You Offered' : 'They Offered'}
            </span>
            <SkillBadge name={request.offeredSkill?.name || 'Skill'} type="OFFERED" />
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
              {isSender ? 'You Wanted' : 'They Wanted'}
            </span>
            <SkillBadge name={request.wantedSkill?.name || 'Skill'} type="WANTED" />
          </div>
        </div>
        {request.message && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">"{request.message}"</p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        {request.status === 'PENDING' && !isSender && (
          <>
            <button
              onClick={() => onReject(request.id)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => onAccept(request.id)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Accept</span>
            </button>
          </>
        )}
        {request.status === 'PENDING' && isSender && (
          <button
            onClick={() => onCancel(request.id)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <XCircle className="h-4 w-4" />
            <span>Cancel Request</span>
          </button>
        )}
        {request.status === 'ACCEPTED' && (
          <button
            onClick={() => onComplete(request.id)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark as Completed</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SwapRequestCard;
