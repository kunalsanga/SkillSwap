import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

/**
 * SkillCard component.
 * Displays details for a single skill (offered or wanted), displaying metadata badges, description, and action triggers.
 */
const SkillCard = ({ skill, isOwner = false, onEdit, onDelete }) => {
  const name = skill.skill?.name || skill.name || 'Skill';

  // Define premium categories color mapping
  const getCategoryStyles = (category) => {
    if (!category) return 'bg-gray-50 text-gray-600 border-gray-150';
    const lower = category.toLowerCase();

    if (lower.includes('develop') || lower.includes('code') || lower.includes('engine') || lower.includes('program')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-100/50';
    }
    if (lower.includes('design') || lower.includes('creative') || lower.includes('figma') || lower.includes('art')) {
      return 'bg-pink-50 text-pink-700 border-pink-100/50';
    }
    if (lower.includes('marketing') || lower.includes('sale') || lower.includes('seo') || lower.includes('writing')) {
      return 'bg-amber-50 text-amber-700 border-amber-100/50';
    }
    if (lower.includes('devops') || lower.includes('cloud') || lower.includes('infra') || lower.includes('sys')) {
      return 'bg-sky-50 text-sky-700 border-sky-100/50';
    }
    
    return 'bg-teal-50 text-teal-700 border-teal-100/50';
  };

  const getExperienceStyles = (level) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-50 text-purple-700 border border-purple-100/50';
      case 'Advanced':
        return 'bg-blue-50 text-blue-700 border border-blue-100/50';
      case 'Intermediate':
        return 'bg-emerald-550/10 text-emerald-800 border border-emerald-500/10';
      case 'Beginner':
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200/50';
    }
  };

  return (
    <div
      className="bg-white border border-gray-150 p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
      role="listitem"
    >
      <div className="space-y-2">
        {/* Title and Edit/Delete Actions */}
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-extrabold text-gray-900 text-sm md:text-base leading-snug group-hover:text-indigo-650 transition-colors duration-300">
            {name}
          </h4>
          {isOwner && (
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                type="button"
                onClick={() => onEdit(skill)}
                className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500/20"
                aria-label={`Edit ${name}`}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(skill.id)}
                className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:ring-2 focus:ring-rose-500/20"
                aria-label={`Delete ${name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {skill.category && (
            <span
              className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md border ${getCategoryStyles(
                skill.category
              )}`}
            >
              {skill.category}
            </span>
          )}
          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md ${getExperienceStyles(skill.experience)}`}>
            {skill.experience || 'Beginner'}
          </span>
        </div>

        {/* Optional Description */}
        {skill.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 pt-1">
            {skill.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
