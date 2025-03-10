import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  options: { value: string; label: string }[];
  value?: string;
  name?: string;
  onChange?: (value: string) => void; // Simplified type
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  name = "",
  onChange,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    if (onChange) {
      onChange(optionValue); // Call onChange with just the value
    }
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === selectedValue);

  return (
    <div className={`relative p-2 w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hover:border-violet-300 transition-all duration-300 ease-in-out disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed flex items-center justify-between"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2 text-left text-gray-900 hover:bg-violet-50 hover:text-sky-500 transition-colors duration-200 ${
                selectedValue === option.value ? 'bg-violet-100 text-sky-500 font-medium' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;