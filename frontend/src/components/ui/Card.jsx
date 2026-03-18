export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`bg-white border border-opera-linen rounded-sm transition-transform duration-300 shadow-sm ${hover ? 'hover:-translate-y-1 hover:shadow-lg' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
