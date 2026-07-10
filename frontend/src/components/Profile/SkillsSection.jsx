import React from 'react';
import { Plus } from 'lucide-react';
import SkillCard from './SkillCard';

/**
 * SkillsSection component.
 * Organizes the view into offered skills and wanted skills grids, providing Add skill trigger handlers.
 */
const SkillsSection = ({
  skills = [],
  isOwner = false,
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
}) => {
  const offered = skills.filter((s) => s.type === 'OFFERED');
  const wanted = skills.filter((s) => s.type === 'WANTED');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Offered section */}
      <div className="bg-white rounded-3xl border border-gray-150 p-5 sm:p-6 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-black text-gray-900">Skills Offered</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Expertise you can teach others
            </p>
          </div>
          {isOwner && (
            <button
              type="button"
              onClick={() => onAddSkill('OFFERED')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-100/50 focus:ring-2 focus:ring-indigo-500/20"
              aria-label="Add offered skill"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          )}
        </div>

        {offered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
            {offered.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isOwner={isOwner}
                onEdit={onEditSkill}
                onDelete={onDeleteSkill}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-sm text-gray-450 italic font-semibold">No skills offered yet.</p>
          </div>
        )}
      </div>

      {/* Wanted section */}
      <div className="bg-white rounded-3xl border border-gray-150 p-5 sm:p-6 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-black text-gray-900">Skills Wanted</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Expertise you want to learn
            </p>
          </div>
          {isOwner && (
            <button
              type="button"
              onClick={() => onAddSkill('WANTED')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-100/50 focus:ring-2 focus:ring-indigo-500/20"
              aria-label="Add wanted skill"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          )}
        </div>

        {wanted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
            {wanted.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isOwner={isOwner}
                onEdit={onEditSkill}
                onDelete={onDeleteSkill}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-sm text-gray-450 italic font-semibold">No skills wanted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;
