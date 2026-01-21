
import React from 'react';

interface LoadingSpinnerProps {
    message?: string | null;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-[var(--color-text-secondary)]"> {/* Changed to use CSS variable */}
                {message || 'Analyzing your profile and crafting headlines...'}
            </p>
        </div>
    );
};