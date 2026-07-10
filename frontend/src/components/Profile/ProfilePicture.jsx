import React, { useRef } from 'react';
import { Camera, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

/**
 * Renders avatar preview and triggers base64 image uploading.
 */
const ProfilePicture = ({ value, onChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported file format. Please upload JPEG, PNG, GIF, or WEBP.');
      return;
    }

    // Validate size (max 1MB for Scram/scrypt strings storage in Postgres)
    const limit = 1 * 1024 * 1024;
    if (file.size > limit) {
      toast.error('Image size must be smaller than 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
      toast.success('Image preview loaded. Click Save to apply.');
    };
    reader.onerror = () => {
      toast.error('Could not process image.');
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange(null);
    toast.info('Profile picture queued for removal.');
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="relative group w-24 h-24 sm:w-28 sm:h-28">
        {value ? (
          <img
            src={value}
            alt="Profile Preview"
            className="w-full h-full rounded-full object-cover border-4 border-indigo-50/50 shadow-md transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-indigo-50 border-4 border-white flex items-center justify-center text-indigo-500 shadow-md font-extrabold text-xl">
            ?
          </div>
        )}

        {/* Hover Upload Button */}
        <button
          type="button"
          onClick={handleTriggerUpload}
          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          aria-label="Upload profile image"
        >
          <Camera className="h-6 w-6 text-white" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleTriggerUpload}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-650 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
        >
          <RefreshCw className="h-3 w-3" />
          <span>{value ? 'Replace' : 'Upload'}</span>
        </button>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
          >
            <Trash2 className="h-3 w-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />
      <p className="text-[10px] text-gray-400">JPG, PNG, GIF, or WEBP (Max 1MB).</p>
    </div>
  );
};

export default ProfilePicture;
