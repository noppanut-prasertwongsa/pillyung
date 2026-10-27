import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  seniorMode?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  seniorMode = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled = false,
  type = 'button',
  ...rest
}) => {
  // Base styles
  const baseClasses =
    'inline-flex items-center justify-center font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066cc] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none rounded-2xl active:scale-[0.98]';

  // Variant classes (White & Blue Healthcare System)
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-[#0066cc] text-white hover:bg-[#0052a3] active:bg-[#004080] shadow-sm hover:shadow border border-transparent',
    secondary:
      'bg-[#e8f1fa] text-[#0066cc] hover:bg-[#d6e7f7] active:bg-[#c2daf2] border border-[#b8d5f2]',
    outline:
      'bg-white text-[#1f2937] hover:bg-[#f8fafc] active:bg-[#f1f5f9] border border-[#d1d5db] hover:border-[#0066cc] hover:text-[#0066cc] shadow-2xs',
    text:
      'bg-transparent text-[#0066cc] hover:bg-[#f0f6ff] active:bg-[#e1edff] border border-transparent shadow-none',
    danger:
      'bg-[#dc2626] text-white hover:bg-[#b91c1c] active:bg-[#991b1b] shadow-sm hover:shadow border border-transparent',
  };

  // Size classes
  const sizeClasses: Record<ButtonSize, string> = {
    sm: seniorMode
      ? 'min-h-[46px] px-3.5 py-2 text-sm gap-2'
      : 'min-h-[38px] px-3 py-1.5 text-xs gap-1.5',
    md: seniorMode
      ? 'min-h-[52px] px-5 py-3 text-base sm:text-lg gap-2.5'
      : 'min-h-[44px] px-4 py-2.5 text-sm gap-2',
    lg: seniorMode
      ? 'min-h-[58px] px-6 py-3.5 text-lg sm:text-xl gap-3'
      : 'min-h-[48px] px-5 py-3 text-base gap-2',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...rest}
    >
      {leftIcon && <span className="shrink-0 flex items-center justify-center">{leftIcon}</span>}
      <span className="leading-tight text-center break-words">{children}</span>
      {rightIcon && <span className="shrink-0 flex items-center justify-center">{rightIcon}</span>}
    </button>
  );
};
