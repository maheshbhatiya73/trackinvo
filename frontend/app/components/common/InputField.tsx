import React from 'react';

interface InputFieldProps {
  id: string; // Unique ID for accessibility
  name: string; // Add name prop for form handling
  label?: string; // Optional label text
  type?: string; // Input type (text, email, password, etc.)
  value?: string; // Controlled input value
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
  placeholder?: string; // Optional placeholder
  error?: string; // Optional error message
  disabled?: boolean; // Disable input
  className?: string; // Custom classes for the wrapper
  inputClassName?: string; // Custom classes for the input itself
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name, // Add name to the destructured props
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  className = '',
  inputClassName = '',
}) => {
  return (
    <div className={`relative w-full p-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name} // Pass name to the input element
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
            hover:border-violet-300
            disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed
            transition-all duration-300 ease-in-out
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${inputClassName}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default InputField;