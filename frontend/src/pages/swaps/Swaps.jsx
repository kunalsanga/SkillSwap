import React, { useState, useEffect } from 'react';
import { listSwaps, acceptSwap, rejectSwap, cancelSwap, completeSwap } from '../../services/swapService';
import SwapRequestCard from '../../components/swap/SwapRequestCard';
import { toast } from 'react-toastify';
import { Loader, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Swaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const res = await listSwaps();
      if (res.success) {
        setSwaps(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch swap requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handleAction = async (actionFn, id, successMsg) => {
    try {
      await actionFn(id);
      toast.success(successMsg);
      fetchSwaps(); // Refresh list
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Swap Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your incoming and outgoing skill swap requests.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      ) : swaps.length > 0 ? (
        <div className="space-y-4">
          {swaps.map((swap) => (
            <SwapRequestCard
              key={swap.id}
              request={swap}
              onAccept={(id) => handleAction(acceptSwap, id, 'Swap accepted')}
              onReject={(id) => handleAction(rejectSwap, id, 'Swap rejected')}
              onCancel={(id) => handleAction(cancelSwap, id, 'Swap cancelled')}
              onComplete={(id) => handleAction(completeSwap, id, 'Swap marked as completed')}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <ArrowRightLeft className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No requests yet</h3>
          <p className="mt-1 text-gray-500">When you send or receive a swap request, it will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Swaps;
