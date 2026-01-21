
import React, { useState } from 'react';
import type { HeadlineSuggestion } from '../types';

interface ScoreCircleProps {
  score: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-emerald-500';
    if (s >= 75) return 'text-sky-500';
    if (s >= 60) return 'text-yellow-500';
    return 'text-rose-500';
  };

  const colorClass = getScoreColor(score);
  const circumference = 2 * Math.PI * 45; // 45 is the radius
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-[var(--color-border)]" /* Changed to use CSS variable */
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-in-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${colorClass}`}>
        {score}
      </span>
    </div>
  );
};

// SVG Icons for rationale points
const RationaleIcons = {
  clarity: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M7.408 2.225A1 1 0 018.36 2h3.28a1 1 0 01.953.775L14.73 8H5.27l1.46-5.775zM10 18a6 6 0 100-12 6 6 0 000 12zM9 10a1 1 0 011-1h.01a1 1 0 011 1v.01a1 1 0 01-1 1H9a1 1 0 01-1-1v-.01z" />
    </svg>
  ),
  keywords: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M11.604 13.911L6.711 9.017a.75.75 0 010-1.06L11.604 3.96a.75.75 0 011.06 0L17.5 8.796a.75.75 0 010 1.06L12.664 14.96a.75.75 0 01-1.06 0zM5.5 12h2.25V9.75H5.5V12z" clipRule="evenodd" />
    </svg>
  ),
  audience: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M1 9a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H2a1 1 0 01-1-1V9zM7 9a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H8a1 1 0 01-1-1V9zM13 9a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1V9z" />
    </svg>
  ),
  default: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const RationaleList: React.FC<{ rationale: string }> = ({ rationale }) => {
  const points = rationale.split('\n')
    .map(p => p.trim())
    .filter(p => p.startsWith('*'))
    .map(p => p.substring(1).trim());

  if (points.length === 0) {
    return <p className="text-[var(--color-text-secondary)] leading-relaxed">{rationale}</p>;
  }

  const getIconForTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('clarity')) return RationaleIcons.clarity;
    if (lowerTitle.includes('keyword')) return RationaleIcons.keywords;
    if (lowerTitle.includes('audience')) return RationaleIcons.audience;
    return RationaleIcons.default;
  };

  return (
    <ul className="list-none space-y-2 text-[var(--color-text-secondary)]">
      {points.map((point, i) => {
        const parts = point.split(/:(.*)/s);
        const title = parts[0];
        const description = parts[1] || '';
        const IconComponent = getIconForTitle(title);

        return (
          <li key={i} className="flex items-start text-sm">
            <span className="mr-2 mt-0.5 text-indigo-500 flex-shrink-0">
              {IconComponent}
            </span>
            <span>
              <strong className="font-semibold text-[var(--color-text)]">{title}:</strong>{description}
            </span>
          </li>
        );
      })}
    </ul>
  );
};


interface HeadlineCardProps {
  suggestion: HeadlineSuggestion;
  index: number;
  isFavorited: boolean;
  onToggleFavorite: (suggestion: HeadlineSuggestion) => void;
  onEdit: (index: number, newHeadlineText: string) => void; // New prop for editing
}

export const HeadlineCard: React.FC<HeadlineCardProps> = ({ suggestion, index, isFavorited, onToggleFavorite, onEdit }) => {
    const { headline, score, rationale } = suggestion;
    const [isCopied, setIsCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedHeadlineText, setEditedHeadlineText] = useState(headline);
    const [favoriteActionMessage, setFavoriteActionMessage] = useState<string | null>(null); // New state for favorite confirmation

    const handleCopy = () => {
        navigator.clipboard.writeText(headline).then(() => {
            setIsCopied(true);
            // Clear other messages
            setFavoriteActionMessage(null);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy headline:', err);
        });
    };

    const handleEditToggle = () => {
      if (isEditing) {
        // If we were editing, now we save
        if (editedHeadlineText.trim() !== headline) { // Only save if text changed
          onEdit(index, editedHeadlineText.trim());
        }
        setIsEditing(false);
      } else {
        // Start editing
        setEditedHeadlineText(headline); // Initialize with current headline
        setIsEditing(true);
        // Clear other messages when starting edit
        setIsCopied(false);
        setFavoriteActionMessage(null); 
      }
    };

    const handleToggleFavoriteClick = () => {
      const wasFavorited = isFavorited;
      onToggleFavorite(suggestion); // This triggers App.tsx to update favorites and re-render with new `isFavorited` prop
      setFavoriteActionMessage(wasFavorited ? 'Removed from favorites!' : 'Added to favorites!');
      // Clear other messages
      setIsCopied(false);
      setTimeout(() => setFavoriteActionMessage(null), 2000);
    };

    return (
        <div className="bg-[var(--color-secondary-bg)] rounded-xl shadow-theme overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-[var(--color-border)] relative"> {/* Changed to use CSS variables and custom shadow-theme */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-full transition-colors duration-200 ease-in-out text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]" /* Changed to use CSS variables */
                    aria-label="Copy headline"
                    disabled={isEditing} // Disable while editing
                >
                    {isCopied ? (
                        <span className="flex items-center text-emerald-500">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>
                 <button
                    onClick={handleToggleFavoriteClick} // Use the new handler
                    className={`p-2 rounded-full transition-colors duration-200 ease-in-out ${isFavorited ? 'text-yellow-400 bg-yellow-100 hover:bg-yellow-200' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`} /* Changed to use CSS variable */
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    disabled={isEditing} // Disable while editing
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
                <button
                    onClick={handleEditToggle}
                    className={`p-2 rounded-full transition-colors duration-200 ease-in-out ${isEditing ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`}
                    aria-label={isEditing ? 'Save edited headline' : 'Edit headline'}
                >
                    {isEditing ? (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    )}
                </button>
            </div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                <ScoreCircle score={score} />
                <div className="flex-1 pr-16">
                    <p className="text-indigo-600 font-semibold text-sm mb-2">Option {index + 1}</p>
                    {isEditing ? (
                        <textarea
                            className="w-full p-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-[var(--color-secondary-bg)] text-[var(--color-text)] mb-3 resize-none"
                            value={editedHeadlineText}
                            onChange={(e) => setEditedHeadlineText(e.target.value)}
                            rows={3}
                            maxLength={120} // LinkedIn headline max length
                            aria-label="Edit headline"
                        />
                    ) : (
                        <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">{headline}</h3>
                    )}
                    <RationaleList rationale={rationale} />
                </div>
            </div>
            {(isCopied || favoriteActionMessage) && ( // Show either message
                <div className="absolute bottom-4 right-4 bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10"> {/* Added z-10 for layering */}
                    {isCopied ? 'Copied to clipboard!' : favoriteActionMessage}
                </div>
            )}
        </div>
    );
};