const variants = {
  danger: "bg-opera-burgundy/10 text-opera-burgundy border border-opera-burgundy/20",
  success: "bg-green-100 text-green-800 border border-green-200",
  warning: "bg-opera-brass/20 text-yellow-800 border border-opera-brass/40",
  info: "bg-opera-indigo/10 text-opera-indigo border border-opera-indigo/20",
  default: "bg-opera-plaster text-opera-indigo border border-opera-linen"
};

export const Badge = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
