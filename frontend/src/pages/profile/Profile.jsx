import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../services/userService';
import { getUserFeedback } from '../../services/ratingService';
import { createSwap } from '../../services/swapService';
import { Star, ArrowLeft } from 'lucide-react';
import RatingCard from '../../components/rating/RatingCard';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStats from '../../components/profile/ProfileStats';
import SkillsSection from '../../components/profile/SkillsSection';
import EditProfileModal from '../../components/profile/EditProfileModal';
import SkillForm from '../../components/SkillForm/SkillForm';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [skillFormType, setSkillFormType] = useState('OFFERED');
  const [editingSkill, setEditingSkill] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default to current user if no ID provided in URL (e.g. /profile)
  const profileId = id || currentUser?.id;
  const isOwner = currentUser?.id === parseInt(profileId, 10) || (!id && !!currentUser);

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
  }, [profileId, currentUser]);

  const handleRequestSwap = async (wantedSkillId, offeredSkillId) => {
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

  const handleProfileUpdate = async (updatedData) => {
    setIsSubmitting(true);
    try {
      const res = await updateUser(updatedData);
      setProfile(res.data);
      setIsEditProfileOpen(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSkillForm = (type, skillToEdit = null) => {
    setSkillFormType(type);
    setEditingSkill(skillToEdit);
    setIsSkillFormOpen(true);
  };

  const closeSkillForm = () => {
    setIsSkillFormOpen(false);
    setEditingSkill(null);
  };

  const handleSkillSubmit = async (skillData) => {
    setIsSubmitting(true);
    try {
      let currentSkills = profile.skills || [];
      const newSkillData = { ...skillData, type: skillFormType };

      if (editingSkill) {
        // Update existing skill
        currentSkills = currentSkills.map(s => 
          s.id === editingSkill.id ? { ...s, ...newSkillData, skill: { name: newSkillData.name } } : s
        );
      } else {
        // Add new skill
        // Note: Backend might need to create the skill record, so we just pass the raw data
        currentSkills = [...currentSkills, newSkillData];
      }

      // Reformat skills array for the backend API which expects { offered: [], wanted: [] } or raw array
      const res = await updateUser({ skills: currentSkills });
      setProfile(res.data);
      closeSkillForm();
      toast.success(editingSkill ? 'Skill updated!' : 'Skill added!');
    } catch (error) {
      toast.error(error.message || 'Failed to save skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillToDelete) => {
    if (!window.confirm(`Are you sure you want to delete ${skillToDelete.skill?.name || skillToDelete.name}?`)) return;
    
    setIsSubmitting(true);
    try {
      const currentSkills = (profile.skills || []).filter(s => s.id !== skillToDelete.id);
      const res = await updateUser({ skills: currentSkills });
      setProfile(res.data);
      toast.success('Skill removed!');
    } catch (error) {
      toast.error(error.message || 'Failed to delete skill');
    } finally {
      setIsSubmitting(false);
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
  const hasSkills = offeredSkills.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {id && (
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
      )}

      {/* Hero Header */}
      <ProfileHeader
        user={profile}
        isOwner={isOwner}
        hasSkills={hasSkills}
        onEditClick={() => setIsEditProfileOpen(true)}
        onRequestSwap={() => handleRequestSwap(offeredSkills[0]?.skillId, currentUser?.skills?.[0]?.skillId || 1)}
      />

      {/* Stats row */}
      <ProfileStats skills={profile.skills} feedbacks={feedbacks} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <SkillsSection
            skills={profile.skills}
            isOwner={isOwner}
            onAddSkill={(type) => openSkillForm(type)}
            onEditSkill={(skill) => openSkillForm(skill.type, skill)}
            onDeleteSkill={handleDeleteSkill}
          />
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews & Feedback</h3>
            {feedbacks.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
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

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSubmit={handleProfileUpdate}
        user={profile}
        isSubmitting={isSubmitting}
      />

      <SkillForm
        isOpen={isSkillFormOpen}
        onClose={closeSkillForm}
        onSubmit={handleSkillSubmit}
        initialData={editingSkill}
        title={editingSkill ? `Edit ${skillFormType === 'OFFERED' ? 'Offered' : 'Wanted'} Skill` : `Add ${skillFormType === 'OFFERED' ? 'Offered' : 'Wanted'} Skill`}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Profile;
