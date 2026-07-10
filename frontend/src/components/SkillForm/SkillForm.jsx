import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import SkillInput from './SkillInput';
import { validateSkill } from './SkillValidation';

/**
 * SkillForm modal window.
 * Supports both adding a new skill and editing an existing user skill link.
 */
const SkillForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  title = 'Add Skill',
  isSubmitting = false,
}) => {
  const [formValues, setFormValues] = useState({
    name: '',
    category: '',
    experience: 'Beginner',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormValues({
        name: initialData.skill?.name || initialData.name || '',
        category: initialData.category || '',
        experience: initialData.experience || 'Beginner',
        description: initialData.description || '',
      });
    } else {
      setFormValues({
        name: '',
        category: '',
        experience: 'Beginner',
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateSkill(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formValues);
  };

  const experienceOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Expert', label: 'Expert' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-form-title"
    >
      {/* Modal Dialog */}
      <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 w-full max-w-md shadow-2xl relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-indigo-500/20"
          aria-label="Close skill dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <h3 id="skill-form-title" className="text-xl font-black text-gray-900 mb-6">
          {title}
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <SkillInput
            label="Skill Name"
            id="name"
            placeholder="e.g. React, Photoshop, Docker"
            value={formValues.name}
            onChange={handleChange}
            error={errors.name}
            required
            disabled={isSubmitting}
          />

          <SkillInput
            label="Category"
            id="category"
            placeholder="e.g. Development, Design, DevOps"
            value={formValues.category}
            onChange={handleChange}
            error={errors.category}
            disabled={isSubmitting}
          />

          <SkillInput
            label="Experience Level"
            id="experience"
            type="select"
            options={experienceOptions}
            value={formValues.experience}
            onChange={handleChange}
            error={errors.experience}
            disabled={isSubmitting}
          />

          <SkillInput
            label="Description (Optional)"
            id="description"
            type="textarea"
            placeholder="Provide a brief context or project experience you have with this skill..."
            value={formValues.description}
            onChange={handleChange}
            error={errors.description}
            disabled={isSubmitting}
          />

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-5 border-t border-gray-50 mt-2">
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
              {isSubmitting ? 'Saving...' : 'Save Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillForm;
