import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ArrowDownLeft, ArrowUpRight, RotateCw } from 'lucide-react';
import {
  getIncomingRequests,
  getOutgoingRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
} from './api/swapsApi';
import IncomingRequests from './components/IncomingRequests';
import OutgoingRequests from './components/OutgoingRequests';
import LoadingSkeleton from './components/LoadingSkeleton';

/**
 * Main Swap Requests dashboard.
 * Manages lists retrieval, triggers mutations, shows skeletons, and displays toast feedback.
 */
const SwapsPage = () => {
  const [activeView, setActiveView] = useState('incoming'); // 'incoming' or 'outgoing'
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Fetch all swap requests
  const loadData = async (showSkeleton = true) => {
    if (showSkeleton) setLoading(true);
    setError(null);
    try {
      const [incomingRes, outgoingRes] = await Promise.all([
        getIncomingRequests(),
        getOutgoingRequests(),
      ]);

      if (incomingRes.success) {
        setIncoming(incomingRes.data || []);
      }
      if (outgoingRes.success) {
        setOutgoing(outgoingRes.data || []);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve swap requests. Please check connection and try again.');
      toast.error('Failed to load swap requests.');
    } finally {
      if (showSkeleton) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  // Mutate swap requests state
  const handleAction = async (actionFn, id, successMsg) => {
    if (processingId) return; // Prevent double submits
    setProcessingId(id);
    try {
      const res = await actionFn(id);
      if (res.success) {
        toast.success(successMsg);
        // Refresh without full skeleton for smoother UX
        await loadData(false);
      } else {
        toast.error(res.message || 'Action failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'An error occurred during operation.');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingIncomingCount = incoming.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-6 md:py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Swap Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, approve, or cancel your skill swap requests.</p>
        </div>
        <button
          onClick={() => loadData(true)}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold bg-white text-gray-600 border border-gray-200/80 rounded-xl hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
          aria-label="Reload requests"
        >
          <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Main Mode Swapper */}
      <div className="flex border-b border-gray-200" role="tablist">
        <button
          onClick={() => setActiveView('incoming')}
          className={`flex items-center gap-2.5 py-4 px-6 text-sm font-bold border-b-2 transition-all duration-300 focus:outline-none ${
            activeView === 'incoming'
              ? 'border-indigo-600 text-indigo-650'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
          role="tab"
          aria-selected={activeView === 'incoming'}
        >
          <ArrowDownLeft className="h-4.5 w-4.5" />
          <span>Incoming Requests</span>
          {pendingIncomingCount > 0 && (
            <span className="px-2 py-0.5 text-2xs font-extrabold bg-indigo-50 text-indigo-650 border border-indigo-100 rounded-full">
              {pendingIncomingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveView('outgoing')}
          className={`flex items-center gap-2.5 py-4 px-6 text-sm font-bold border-b-2 transition-all duration-300 focus:outline-none ${
            activeView === 'outgoing'
              ? 'border-indigo-600 text-indigo-650'
              : 'border-transparent text-gray-550 hover:text-gray-800 hover:border-gray-300'
          }`}
          role="tab"
          aria-selected={activeView === 'outgoing'}
        >
          <ArrowUpRight className="h-4.5 w-4.5" />
          <span>Outgoing Requests</span>
        </button>
      </div>

      {/* Main Switchable Contents */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 border border-rose-100/60 rounded-2xl max-w-lg mx-auto">
          <p className="text-sm text-rose-800 font-semibold">{error}</p>
          <button
            onClick={() => loadData(true)}
            className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          >
            Retry Loading
          </button>
        </div>
      ) : activeView === 'incoming' ? (
        <IncomingRequests
          requests={incoming}
          onAccept={(id) => handleAction(acceptRequest, id, 'Swap request accepted!')}
          onReject={(id) => handleAction(rejectRequest, id, 'Swap request rejected.')}
          onComplete={(id) => handleAction(completeRequest, id, 'Swap marked as completed!')}
          processingId={processingId}
        />
      ) : (
        <OutgoingRequests
          requests={outgoing}
          onCancel={(id) => handleAction(cancelRequest, id, 'Swap request cancelled successfully.')}
          onComplete={(id) => handleAction(completeRequest, id, 'Swap marked as completed!')}
          processingId={processingId}
        />
      )}
    </div>
  );
};

export default SwapsPage;
