import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, ArrowRightLeft, MessageSquare, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import { getUserFeedback } from '../../services/ratingService';
import { addUserSkill, updateUserSkill, deleteUserSkill } from '../../services/skillService';
import { sendRequest } from '../Swaps/api/swapsApi';

import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileStats from '../../components/Profile/ProfileStats';
import ProfileInfo from '../../components/Profile/ProfileInfo';
import SkillsSection from '../../components/Profile/SkillsSection';
import EditProfileModal from '../../components/Profile/EditProfileModal';
import SkillForm from '../../components/SkillForm/SkillForm';

/**
 * Main Profile page module.
 * Coordinates profile viewing, editing, skills CRUD, reviews list, and swap request invitations.
 */
const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals Visibility
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  // Submitting States
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSkill, setIsSavingSkill] = useState(false);
  const [isSendingSwap, setIsSendingSwap] = useState(false);

  // Skill Editor State
  const [activeSkillType, setActiveSkillType] = useState('OFFERED'); // 'OFFERED' or 'WANTED'
  const [editingSkill, setEditingSkill] = useState(null); // null if adding

  // Swap Request Form State
  const [selectedWantedSkillId, setSelectedWantedSkillId] = useState('');
  const [selectedOfferedSkillId, setSelectedOfferedSkillId] = useState('');
  const [swapMessage, setSwapMessage] = useState('');

  const profileId = id ? parseInt(id, 10) : currentUser?.id;
  const isOwner = currentUser && profileId === currentUser.id;

  const fetchData = async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      const [profileRes, feedbackRes] = await Promise.all([
        getUserProfile(profileId),
        getUserFeedback(profileId),
      ]);

      if (profileRes.success) setProfile(profileRes.data);
      if (feedbackRes.success) setFeedbacks(feedbackRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  // Pre-populate Swap Request details when opening swap modal
  useEffect(() => {
    if (profile && currentUser) {
      const partnerOffered = profile.skills?.filter((s) => s.type === 'OFFERED') || [];
      const userOffered = currentUser.skills?.filter((s) => s.type === 'OFFERED') || [];

      if (partnerOffered.length > 0) {
        setSelectedWantedSkillId(partnerOffered[0].skill.id);
      }
      if (userOffered.length > 0) {
        setSelectedOfferedSkillId(userOffered[0].skill.id);
      }
    }
  }, [profile, currentUser, isSwapModalOpen]);

  // Edit profile submit handler
  const handleEditProfileSubmit = async (formData) => {
    setIsSavingProfile(true);
    try {
      const res = await updateUserProfile(formData);
      if (res.success) {
        toast.success('Profile updated successfully!');
        
        // Sync local storage user details if current user is owner
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const u = JSON.parse(storedUser);
          localStorage.setItem('user', JSON.stringify({ ...u, ...res.data }));
        }

        setIsEditProfileOpen(false);
        await fetchData();
      } else {
        toast.error(res.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error occurred while saving profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Skill submit handler (add or edit)
  const handleSkillFormSubmit = async (skillData) => {
    setIsSavingSkill(true);
    try {
      if (editingSkill) {
        // Edit Skill
        const res = await updateUserSkill(editingSkill.id, {
          name: skillData.name,
          category: skillData.category,
          experience: skillData.experience,
          description: skillData.description,
        });
        if (res.success) {
          toast.success('Skill updated successfully!');
          setIsSkillFormOpen(false);
          await fetchData();
        } else {
          toast.error(res.message || 'Failed to update skill.');
        }
      } else {
        // Add Skill
        const res = await addUserSkill({
          name: skillData.name,
          type: activeSkillType,
          category: skillData.category,
          experience: skillData.experience,
          description: skillData.description,
        });
        if (res.success) {
          toast.success('Skill added to profile successfully!');
          setIsSkillFormOpen(false);
          await fetchData();
        } else {
          toast.error(res.message || 'Failed to add skill.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred while saving skill.');
    } finally {
      setIsSavingSkill(false);
    }
  };

  // Delete skill handler
  const handleDeleteSkill = async (userSkillId) => {
    if (!window.confirm('Are you sure you want to remove this skill from your profile?')) {
      return;
    }
    try {
      const res = await deleteUserSkill(userSkillId);
      if (res.success) {
        toast.success('Skill removed successfully.');
        await fetchData();
      } else {
        toast.error(res.message || 'Failed to delete skill.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while deleting skill.');
    }
  };

  // Send swap request submit handler
  const handleSwapRequestSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWantedSkillId || !selectedOfferedSkillId) {
      toast.error('Please select both skills to complete the request.');
      return;
    }

    setIsSendingSwap(true);
    try {
      const res = await sendRequest({
        receiverId: profileId,
        wantedSkillId: parseInt(selectedWantedSkillId, 10),
        offeredSkillId: parseInt(selectedOfferedSkillId, 10),
        message: swapMessage.trim() || null,
      });

      if (res.success) {
        toast.success('Swap request sent successfully!');
        setIsSwapModalOpen(false);
        setSwapMessage('');
      } else {
        toast.error(res.message || 'Failed to send swap request.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error sending swap request.');
    } finally {
      setIsSendingSwap(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4" aria-busy="true">
        <Loader className="h-9 w-9 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500 font-semibold">Loading profile information...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 bg-white border border-gray-150 rounded-3xl max-w-md mx-auto shadow-sm">
        <h3 className="text-lg font-black text-gray-900">Profile Not Found</h3>
        <p className="text-sm text-gray-500 mt-2">The user you are trying to view does not exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const partnerOffered = profile.skills?.filter((s) => s.type === 'OFFERED') || [];
  const userOffered = currentUser?.skills?.filter((s) => s.type === 'OFFERED') || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-6 md:py-10">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-650 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Hero Header */}
      <ProfileHeader
        user={profile}
        isOwner={isOwner}
        onEditClick={() => setIsEditProfileOpen(true)}
        onRequestSwap={() => setIsSwapModalOpen(true)}
        hasSkills={partnerOffered.length > 0 && userOffered.length > 0}
      />

      {/* Analytics Widget */}
      <ProfileStats skills={profile.skills} feedbacks={feedbacks} />

      {/* Grid: Skills CRUD on top/middle, Reviews detailed */}
      <div className="space-y-6">
        <SkillsSection
          skills={profile.skills}
          isOwner={isOwner}
          onAddSkill={(type) => {
            setActiveSkillType(type);
            setEditingSkill(null);
            setIsSkillFormOpen(true);
          }}
          onEditSkill={(skill) => {
            setEditingSkill(skill);
            setIsSkillFormOpen(true);
          }}
          onDeleteSkill={handleDeleteSkill}
        />

        <div className="w-full">
          <ProfileInfo feedbacks={feedbacks} />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmit={handleEditProfileSubmit}
        user={profile}
        isSubmitting={isSavingProfile}
      />

      {/* Skill Add/Edit Modal */}
      <SkillForm
        isOpen={isSkillFormOpen}
        onClose={() => setIsSkillFormOpen(false)}
        onSubmit={handleSkillFormSubmit}
        initialData={editingSkill}
        title={editingSkill ? 'Edit Skill' : `Add ${activeSkillType === 'OFFERED' ? 'Offered' : 'Wanted'} Skill`}
        isSubmitting={isSavingSkill}
      />

      {/* Premium Request Swap Modal */}
      {isSwapModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="swap-modal-title"
        >
          <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 w-full max-w-md shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setIsSwapModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-950 p-1.5 rounded-full hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-indigo-500/20"
              aria-label="Close swap modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-650 border border-indigo-100/50">
                <ArrowRightLeft className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 id="swap-modal-title" className="text-lg font-black text-gray-900">
                  Request Skill Swap
                </h3>
                <p className="text-2xs text-gray-450 font-bold uppercase tracking-wider mt-0.5">
                  Propose an exchange with {profile.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleSwapRequestSubmit} className="space-y-4">
              {/* Select Wanted Skill */}
              <div className="space-y-1.5">
                <label htmlFor="wanted-skill" className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Skill you want from them
                </label>
                <select
                  id="wanted-skill"
                  value={selectedWantedSkillId}
                  onChange={(e) => setSelectedWantedSkillId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  disabled={isSendingSwap}
                  required
                >
                  {partnerOffered.map((s) => (
                    <option key={s.skill.id} value={s.skill.id}>
                      {s.skill.name} ({s.experience || 'Beginner'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Offered Skill */}
              <div className="space-y-1.5">
                <label
                  htmlFor="offered-skill"
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wide"
                >
                  Skill you will offer in exchange
                </label>
                <select
                  id="offered-skill"
                  value={selectedOfferedSkillId}
                  onChange={(e) => setSelectedOfferedSkillId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  disabled={isSendingSwap}
                  required
                >
                  {userOffered.map((s) => (
                    <option key={s.skill.id} value={s.skill.id}>
                      {s.skill.name} ({s.experience || 'Beginner'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="swap-message"
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wide"
                >
                  Message (Optional)
                </label>
                <textarea
                  id="swap-message"
                  rows={3}
                  placeholder="Introduce yourself or clarify schedules..."
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  disabled={isSendingSwap}
                />
              </div>

              <div className="flex gap-3 justify-end pt-5 border-t border-gray-150 mt-2">
                <button
                  type="button"
                  onClick={() => setIsSwapModalOpen(false)}
                  disabled={isSendingSwap}
                  className="px-5 py-2.5 text-sm font-bold text-gray-650 bg-white hover:bg-gray-55 border border-gray-200 rounded-xl transition-all focus:ring-2 focus:ring-gray-200/50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingSwap}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 transition-all focus:ring-2 focus:ring-indigo-500/25 disabled:opacity-50"
                >
                  {isSendingSwap ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Add standard inline CSS animations support
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.25s ease-out forwards;
  }
  .animate-scale-up {
    animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;
document.head.appendChild(style);

export default ProfilePage;
