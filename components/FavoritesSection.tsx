
import React from 'react';
import type { HeadlineSuggestion } from '../types';

interface FavoritesSectionProps {
    favorites: HeadlineSuggestion[];
    onRemoveFavorite: (suggestion: HeadlineSuggestion) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({ favorites, onRemoveFavorite }) => {
    return (
        <div className="mt-8 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="flex items-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <h2 className="text-2xl font-bold text-slate-800">Your Favorite Headlines</h2>
            </div>
            <ul className="space-y-3">
                {favorites.map((fav, index) => (
                    <li key={index} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg group">
                        <p className="text-slate-800 flex-1 mr-4">{fav.headline}</p>
                        <button
                            onClick={() => onRemoveFavorite(fav)}
                            className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Remove from favorites"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
