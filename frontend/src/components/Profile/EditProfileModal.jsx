import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import SkillInput from '../SkillForm/SkillInput';
import ProfilePicture from './ProfilePicture';

/**
 * EditProfileModal component.
 * Allows editing user parameters such as name, bio, availability, location split, and profile picture.
 */
const EditProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isSubmitting = false,
}) => {
  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [availability, setAvailability] = useState('Available');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setProfilePhoto(user.profilePhoto || '');
      setBio(user.bio || '');
      setAvailability(user.availability || 'Available');

      const locParts = user.location ? user.location.split(',') : [];
      setCity(locParts[0]?.trim() || '');
      setState(locParts[1]?.trim() || '');
      setCountry(locParts[2]?.trim() || '');
    }
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = 'Full name is required.';
    }

    if (bio && bio.length > 300) {
      validationErrors.bio = 'Bio cannot exceed 300 characters.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const combinedLocation = [city, state, country]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(', ');

    onSubmit({
      name: name.trim(),
      profilePhoto,
      bio: bio.trim(),
      location: combinedLocation,
      availability,
    });
  };

  const availabilityOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Busy', label: 'Busy' },
    { value: 'Open to Collaboration', label: 'Open to Collaboration' },
    { value: 'Looking for Opportunities', label: 'Looking for Opportunities' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-55 transition-colors focus:ring-2 focus:ring-indigo-500/25"
          aria-label="Close edit profile modal"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 id="edit-profile-title" className="text-xl font-black text-gray-900 mb-6">
          Edit Profile
        </h3>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Profile Photo Uploader */}
          <div className="pb-3 border-b border-gray-100 flex justify-center">
            <ProfilePicture value={profilePhoto} onChange={setProfilePhoto} />
          </div>

          {/* Name & Read-Only Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkillInput
              label="Full Name"
              id="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
              disabled={isSubmitting}
            />

            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Email Address (Read Only)
              </label>
              <input
                type="email"
                readOnly
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 border border-gray-200 bg-gray-50 text-gray-450 rounded-xl text-sm focus:outline-none cursor-not-allowed font-medium"
                tabIndex="-1"
                aria-disabled="true"
              />
            </div>
          </div>

          {/* Location city, state, country input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Location
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                disabled={isSubmitting}
                aria-label="City"
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                disabled={isSubmitting}
                aria-label="State"
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                disabled={isSubmitting}
                aria-label="Country"
              />
            </div>
          </div>

          <SkillInput
            label="Availability"
            id="availability"
            type="select"
            options={availabilityOptions}
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            disabled={isSubmitting}
          />

          {/* Bio input with characters counter */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="bio" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Bio
              </label>
              <span className={`text-2xs font-extrabold ${bio.length > 300 ? 'text-rose-500' : 'text-gray-400'}`}>
                {bio.length}/300
              </span>
            </div>
            <textarea
              id="bio"
              rows={4}
              maxLength={300}
              placeholder="Write a brief intro about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.bio
                  ? 'border-rose-350 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
              disabled={isSubmitting}
            />
            {errors.bio && (
              <p className="text-xs font-semibold text-rose-600 animate-fade-in" role="alert">
                {errors.bio}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-5 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-bold text-gray-650 bg-white hover:bg-gray-55 border border-gray-200 rounded-xl transition-all focus:ring-2 focus:ring-gray-200/50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 transition-all focus:ring-2 focus:ring-indigo-500/25 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
