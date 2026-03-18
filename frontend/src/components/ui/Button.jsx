import { Loader2 } from 'lucide-react';

const variants = {
  primary: "bg-opera-burgundy text-white hover:bg-opacity-90 active:bg-opacity-100",
  secondary: "bg-opera-indigo text-white hover:bg-opacity-90 active:bg-opacity-100",
  outline: "border border-opera-brass text-opera-indigo hover:bg-opera-plaster",
  ghost: "text-opera-indigo hover:bg-opera-plaster"
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled, 
  ...props 
}) => {
  return (
    <button
      className={`relative inline-flex items-center justify-center px-6 py-2.5 font-sans font-medium transition-all duration-200 rounded-sm disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
