
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

const RationaleList: React.FC<{ rationale: string }> = ({ rationale }) => {
    // Split by newline, filter out empty lines, and remove the leading '*'
    const points = rationale.split('\n')
                           .map(p => p.trim())
                           .filter(p => p.startsWith('*'))
                           .map(p => p.substring(1).trim());

    if (points.length === 0) {
        // Fallback for unexpected format
        return <p className="text-[var(--color-text-secondary)] leading-relaxed">{rationale}</p>; /* Changed to use CSS variable */
    }

    return (
        <ul className="list-none space-y-2 text-[var(--color-text-secondary)]"> {/* Changed to use CSS variable */}
            {points.map((point, i) => {
                const parts = point.split(/:(.*)/s); // Split on the first colon
                const title = parts[0];
                const description = parts[1] || ''; // Ensure description is not undefined
                return (
                    <li key={i} className="flex items-start text-sm">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>
                            <strong className="font-semibold text-[var(--color-text)]">{title}:</strong>{description} {/* Changed to use CSS variable */}
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
}

export const HeadlineCard: React.FC<HeadlineCardProps> = ({ suggestion, index, isFavorited, onToggleFavorite }) => {
    const { headline, score, rationale } = suggestion;
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(headline).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy headline:', err);
        });
    };

    return (
        <div className="bg-[var(--color-secondary-bg)] rounded-xl shadow-theme overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-[var(--color-border)] relative"> {/* Changed to use CSS variables and custom shadow-theme */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-full transition-colors duration-200 ease-in-out text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]" /* Changed to use CSS variables */
                    aria-label="Copy headline"
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
                    onClick={() => onToggleFavorite(suggestion)}
                    className={`p-2 rounded-full transition-colors duration-200 ease-in-out ${isFavorited ? 'text-yellow-400 bg-yellow-100 hover:bg-yellow-200' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`} /* Changed to use CSS variable */
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            </div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                <ScoreCircle score={score} />
                <div className="flex-1 pr-16">
                    <p className="text-indigo-600 font-semibold text-sm mb-2">Option {index + 1}</p>
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">{headline}</h3> {/* Changed to use CSS variable */}
                    <RationaleList rationale={rationale} />
                </div>
            </div>
            {isCopied && (
                <div className="absolute bottom-4 right-4 bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    Copied to clipboard!
                </div>
            )}
        </div>
    );
};