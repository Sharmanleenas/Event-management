import { X } from 'lucide-react';
import { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opera-indigo/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-lg bg-white border-t-4 border-opera-brass rounded-sm shadow-2xl ${className}`}>
        <div className="flex items-center justify-between p-6 border-b border-opera-linen">
          <h3 className="text-xl font-serif text-opera-indigo">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-opera-burgundy transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
