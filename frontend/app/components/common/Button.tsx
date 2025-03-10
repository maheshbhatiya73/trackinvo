import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'glass' | 'gradient' | 'neon' | 'hover-scale' | 'border-scale' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  children: React.ReactNode;
  icon?: React.ReactNode; // Explicit icon prop
  iconPosition?: 'left' | 'right'; // Icon placement
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any; // For additional HTML button attributes
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = `
    font-semibold cursor-pointer rounded-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
    focus:outline-none focus:ring-3 focus:ring-offset-2 focus:ring-opacity-75
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    relative overflow-hidden group
    ${icon ? 'flex items-center justify-center' : ''} // Flexbox for icon + text
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r gap-2 from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/30
      hover:shadow-xl hover:shadow-blue-500/40 hover:to-blue-700
      focus:ring-blue-400
      active:scale-[0.98]
    `,
    glass: `
      backdrop-blur-lg bg-white/10 text-white border border-white/20
      hover:bg-white/20 hover:border-white/30
      focus:ring-white/50
      shadow-glass
    `,
    gradient: `
      bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white
      shadow-lg shadow-pink-500/30
      hover:shadow-xl hover:shadow-pink-500/40
      hover:animate-gradient-flow
      focus:ring-pink-300
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent
      before:opacity-0 before:transition-opacity before:duration-300
      hover:before:opacity-100
    `,
    neon: `
      bg-black text-cyan-400 border-2 border-cyan-400/50
      hover:border-cyan-400 hover:text-cyan-300
      shadow-glow hover:shadow-cyan-400/20
      focus:ring-cyan-400/50
      before:absolute before:inset-0 before:bg-cyan-400/10 before:opacity-0
      hover:before:opacity-100
      transition-[border-color,box-shadow] duration-300
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30
      hover:shadow-xl hover:shadow-red-500/40 hover:to-red-800
      focus:ring-red-400
      active:scale-[0.98]
      before:absolute before:inset-0 before:bg-red-400/20 before:opacity-0
      hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    'hover-scale': `
      bg-emerald-500 text-white shadow-lg
      hover:scale-105 hover:shadow-emerald-500/40
      focus:ring-emerald-300
      active:scale-95
    `,
    'border-scale': `
      bg-white text-gray-900 border-2 border-gray-200
      hover:border-transparent
      hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-600
      hover:text-white
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-violet-600 before:to-fuchsia-600
      before:opacity-0 before:transition-opacity before:duration-300
      hover:before:opacity-100
      after:absolute after:inset-0 after:border-2 after:border-transparent
      after:bg-gradient-to-r after:from-violet-600 after:to-fuchsia-600
      after:mask-border after:transition-opacity after:duration-300
      hover:after:opacity-0
      focus:ring-violet-400
    `,
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-5 py-2   text-base',
    large: 'px-8 py-4 text-lg',
    xlarge: 'px-10 py-5 text-xl',
  };

  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
      {...props}
    >
      <span className="relative z-10 flex items-center space-x-2">
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </button>
  );
};

export default Button;