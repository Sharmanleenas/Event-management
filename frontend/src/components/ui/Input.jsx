export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-opera-indigo">{label}</label>}
      <input
        className={`px-4 py-2.5 bg-white border outline-none font-sans rounded-sm transition-colors duration-200
          ${error ? 'border-opera-burgundy focus:border-opera-burgundy' : 'border-opera-linen focus:border-opera-brass'}
        `}
        {...props}
      />
      {error && <span className="text-xs text-opera-burgundy mt-1">{error}</span>}
    </div>
  );
};
