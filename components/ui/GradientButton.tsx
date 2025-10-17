import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
  secondary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
  success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
  danger: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function GradientButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: GradientButtonProps) {
  return (
    <button
      className={cn(
        'text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
