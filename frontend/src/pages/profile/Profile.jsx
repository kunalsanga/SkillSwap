import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../services/userService';
import { getUserFeedback } from '../../services/ratingService';
import { createSwap } from '../../services/swapService';
import { User, MapPin, Clock, Star, ArrowLeft } from 'lucide-react';
import SkillBadge from '../../components/common/SkillBadge';
import RatingCard from '../../components/rating/RatingCard';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  // Default to current user if no ID provided in URL (e.g. /profile)
  const profileId = id || currentUser?.id;

  useEffect(() => {
    if (!profileId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, feedbackRes] = await Promise.all([
          getUserProfile(profileId),
          getUserFeedback(profileId)
        ]);
        
        if (profileRes.success) setProfile(profileRes.data);
        if (feedbackRes.success) setFeedbacks(feedbackRes.data);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profileId]);

  const handleRequestSwap = async (wantedSkillId, offeredSkillId) => {
    // In a real app, you would open a modal to let the user select which of their skills to offer
    // For this hackathon version, we'll just pick the first skill they offer and want, or prompt them
    if (!offeredSkillId) {
      toast.info('Please select a skill you want to offer in exchange.');
      return;
    }
    
    setRequesting(true);
    try {
      await createSwap({
        receiverId: parseInt(profileId, 10),
        wantedSkillId,
        offeredSkillId
      });
      toast.success('Swap request sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-gray-900">User not found</h3>
      </div>
    );
  }

  const offeredSkills = profile.skills?.filter((s) => s.type === 'OFFERED') || [];
  const wantedSkills = profile.skills?.filter((s) => s.type === 'WANTED') || [];
  const averageRating = feedbacks.length 
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1) 
    : 'No ratings';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>
        <div className="px-6 py-6 sm:px-10 relative">
          <div className="absolute -top-12 h-24 w-24 bg-white rounded-full p-2 flex items-center justify-center border-4 border-white shadow-sm">
            <div className="h-full w-full bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                {profile.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" /> {profile.location}
                  </div>
                )}
                {profile.availability && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" /> {profile.availability}
                  </div>
                )}
                <div className="flex items-center text-yellow-600 font-medium">
                  <Star className="h-4 w-4 mr-1 fill-current" /> {averageRating}
                </div>
              </div>
            </div>
            
            {currentUser?.id !== profile.id && (
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
                onClick={() => handleRequestSwap(offeredSkills[0]?.skillId, currentUser?.skills?.[0]?.skillId || 1)}
              >
                Request Swap
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Offered</h3>
            <div className="flex flex-wrap gap-2">
              {offeredSkills.length > 0 ? (
                offeredSkills.map(s => <SkillBadge key={s.id} name={s.skill.name} type="OFFERED" />)
              ) : (
                <p className="text-sm text-gray-500">No skills offered yet.</p>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Wanted</h3>
            <div className="flex flex-wrap gap-2">
              {wantedSkills.length > 0 ? (
                wantedSkills.map(s => <SkillBadge key={s.id} name={s.skill.name} type="WANTED" />)
              ) : (
                <p className="text-sm text-gray-500">No skills wanted yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews & Feedback</h3>
            {feedbacks.length > 0 ? (
              <div className="space-y-4">
                {feedbacks.map(feedback => (
                  <RatingCard key={feedback.id} rating={feedback} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Star className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
