import React from 'react';

const SkillBadge = ({ name, type = 'OFFERED' }) => {
  const isOffered = type === 'OFFERED';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isOffered
          ? 'bg-green-100 text-green-800'
          : 'bg-blue-100 text-blue-800'
      }`}
    >
      {name}
    </span>
  );
};

export default SkillBadge;
