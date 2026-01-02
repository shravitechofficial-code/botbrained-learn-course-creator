
import React from 'react';

interface SelectionCardProps {
  label: string;
  description?: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ label, description, icon, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all duration-300 text-left w-full
        ${selected 
          ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
          : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`}
    >
      {icon && <span className="text-3xl mb-4">{icon}</span>}
      <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
      {description && <p className="text-slate-400 text-sm leading-relaxed">{description}</p>}
    </button>
  );
};
