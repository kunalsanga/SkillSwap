import React, { useState } from 'react';
import { User, MessageSquare, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * Reusable Swap Request Card component.
 * Displays details of the swap request and offers contextual actions based on status and direction.
 */
const RequestCard = ({
  request,
  type = 'incoming', // 'incoming' or 'outgoing'
  onAccept,
  onReject,
  onCancel,
  onComplete,
  isProcessing = false,
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isIncoming = type === 'incoming';
  const partner = isIncoming ? request.sender : request.receiver;
  const status = request.status;

  // Format initials for profile photo fallback
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Format creation date
  const formattedDate = new Date(request.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-150 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-gray-300/80 transition-all duration-300 flex flex-col gap-4"
      role="article"
      aria-label={`Swap request with ${partner?.name || 'User'}`}
    >
      {/* Top Header: Partner details & Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {partner?.profilePhoto ? (
            <img
              src={partner.profilePhoto}
              alt={`${partner.name}'s profile`}
              className="w-11 h-11 rounded-full object-cover border border-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = ''; // Force fallback
              }}
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              {getInitials(partner?.name)}
            </div>
          )}
          <div>
            <h4 className="font-bold text-gray-900 text-sm md:text-base leading-tight">
              {partner?.name || 'Unknown User'}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">{formattedDate}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Message section if available */}
      {request.message && (
        <div className="bg-gray-50/70 border border-gray-100/50 rounded-xl p-3.5 flex gap-2.5 items-start">
          <MessageSquare className="h-4.5 w-4.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 italic">"{request.message}"</p>
        </div>
      )}

      {/* Middle: Skills exchange row */}
      <div className="bg-indigo-50/30 border border-indigo-100/30 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1.5">
            {isIncoming ? 'Offering You' : 'You Offer'}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 w-fit">
            {request.offeredSkill?.name || 'Skill'}
          </span>
        </div>
        
        <div className="flex flex-col relative sm:pl-4 border-t sm:border-t-0 sm:border-l border-indigo-100/30 pt-3 sm:pt-0">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1.5">
            {isIncoming ? 'Wants From You' : 'You Want'}
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-50 text-blue-800 border border-blue-100 w-fit">
            {request.wantedSkill?.name || 'Skill'}
          </span>
          {/* Exchange arrow graphic */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block text-indigo-200">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Bottom: Action buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-1 mt-1 border-t border-gray-50">
        {/* Cancel Confirmation View */}
        {showCancelConfirm && (
          <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-100/60 rounded-xl p-2 px-3 text-xs w-full justify-between animate-fade-in">
            <span className="flex items-center gap-1.5 font-medium text-rose-800">
              <ShieldAlert className="h-4 w-4 text-rose-500 flex-shrink-0" />
              Are you sure you want to cancel this request?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  onCancel(request.id);
                }}
                disabled={isProcessing}
                className="px-2.5 py-1 font-bold text-rose-600 bg-rose-100/60 hover:bg-rose-200/80 rounded-md transition-colors disabled:opacity-50"
                aria-label="Confirm cancel request"
              >
                Yes
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                disabled={isProcessing}
                className="px-2.5 py-1 font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors"
                aria-label="Decline cancel request"
              >
                No
              </button>
            </div>
          </div>
        )}

        {/* Regular Action States */}
        {!showCancelConfirm && (
          <>
            {/* Incoming PENDING state: Accept & Reject */}
            {isIncoming && status === 'PENDING' && (
              <>
                <button
                  onClick={() => onReject(request.id)}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-150 transition-colors focus:ring-2 focus:ring-rose-500 focus:outline-none disabled:opacity-50"
                  aria-label={`Reject request from ${partner?.name}`}
                >
                  <X className="h-4 w-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => onAccept(request.id)}
                  disabled={isProcessing}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm shadow-indigo-200 disabled:opacity-50"
                  aria-label={`Accept request from ${partner?.name}`}
                >
                  <Check className="h-4 w-4" />
                  <span>Accept</span>
                </button>
              </>
            )}

            {/* Outgoing PENDING state: Cancel */}
            {!isIncoming && status === 'PENDING' && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={isProcessing}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200/80 transition-colors focus:ring-2 focus:ring-gray-300 focus:outline-none disabled:opacity-50"
                aria-label="Cancel pending request"
              >
                <X className="h-4 w-4" />
                <span>Cancel Request</span>
              </button>
            )}

            {/* ACCEPTED state (either role): Complete */}
            {status === 'ACCEPTED' && (
              <button
                onClick={() => onComplete(request.id)}
                disabled={isProcessing}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors focus:ring-2 focus:ring-indigo-300 focus:outline-none disabled:opacity-50"
                aria-label="Mark swap as completed"
              >
                <Check className="h-4 w-4" />
                <span>Mark as Completed</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
