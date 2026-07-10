import React, { useState } from 'react';
import RequestCard from './RequestCard';
import EmptyState from './EmptyState';

/**
 * Renders outgoing requests partitioned into tabs.
 */
const OutgoingRequests = ({
  requests = [],
  onCancel,
  onComplete,
  processingId,
}) => {
  const [activeTab, setActiveTab] = useState('PENDING');

  const tabs = [
    { label: 'Pending', status: 'PENDING' },
    { label: 'Accepted', status: 'ACCEPTED' },
    { label: 'Rejected', status: 'REJECTED' },
    { label: 'Completed', status: 'COMPLETED' },
  ];

  const filteredRequests = requests.filter((req) => {
    if (activeTab === 'COMPLETED') {
      return req.status === 'COMPLETED' || req.status === 'CANCELLED';
    }
    return req.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Premium Tab Bar */}
      <div className="flex border border-gray-200/60 p-1 bg-gray-50/50 backdrop-blur-sm rounded-2xl gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.status;
          return (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={`flex-1 py-2.5 px-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                isActive
                  ? 'bg-white text-indigo-650 shadow-sm border border-gray-100'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/40'
              }`}
              aria-selected={isActive}
              role="tab"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              type="outgoing"
              onCancel={onCancel}
              onComplete={onComplete}
              isProcessing={processingId === request.id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          message={`No ${activeTab.toLowerCase()} requests`}
          description={`Your outgoing requests flagged as ${activeTab.toLowerCase()} will appear here once initiated.`}
        />
      )}
    </div>
  );
};

export default OutgoingRequests;
