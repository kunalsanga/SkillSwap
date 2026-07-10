import React from 'react';
import RequestCard from './RequestCard';
import EmptyState from './EmptyState';

/**
 * Renders the list of incoming swap requests.
 */
const IncomingRequests = ({
  requests = [],
  onAccept,
  onReject,
  onComplete,
  processingId,
}) => {
  if (requests.length === 0) {
    return (
      <EmptyState
        message="No incoming requests yet"
        description="When another user proposes a skill swap with you, their request will show up here. Make sure your profile details highlight the skills you offer!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          type="incoming"
          onAccept={onAccept}
          onReject={onReject}
          onComplete={onComplete}
          isProcessing={processingId === request.id}
        />
      ))}
    </div>
  );
};

export default IncomingRequests;
