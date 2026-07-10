import React from 'react';

/**
 * Reusable input/textarea/select field with label, validation errors, and focus states.
 */
const SkillInput = ({
  label,
  id,
  type = 'text',
  error,
  options = [],
  placeholder = '',
  required = false,
  ...props
}) => {
  const baseStyles = `w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
    error
      ? 'border-rose-300 bg-rose-50/10 focus:ring-rose-500/20 focus:border-rose-500'
      : 'border-gray-200 bg-white focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300'
  }`;

  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor={id} className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
        {label} {required && <span className="text-rose-500" aria-hidden="true">*</span>}
      </label>
      
      {type === 'select' ? (
        <select
          id={id}
          className={`${baseStyles} appearance-none cursor-pointer`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          placeholder={placeholder}
          rows={3}
          className={`${baseStyles} resize-none`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={baseStyles}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      )}
      
      {error && (
        <p id={`${id}-error`} className="text-xs font-semibold text-rose-600 animate-fade-in" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SkillInput;
