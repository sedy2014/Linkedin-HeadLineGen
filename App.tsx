
import React, { useState, useCallback, useEffect } from 'react';
import type { HeadlineSuggestion } from './types';
import { generateHeadlines } from './services/geminiService';
import { HeadlineCard } from './components/HeadlineCard';
import { HeroSection } from './components/HeroSection';
import { InputForm } from './components/InputForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FavoritesSection } from './components/FavoritesSection';

const FAVORITES_KEY = 'linkedin-headline-favorites';

const App: React.FC = () => {
  const [role, setRole] = useState('');
  const [goals, setGoals] = useState('');
  const [suggestions, setSuggestions] = useState<HeadlineSuggestion[]>([]);
  const [favorites, setFavorites] = useState<HeadlineSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
      setFavorites([]);
    }
  }, []);

  const handleToggleFavorite = useCallback((suggestion: HeadlineSuggestion) => {
    setFavorites(prevFavorites => {
      const isFavorited = prevFavorites.some(fav => fav.headline === suggestion.headline);
      let newFavorites;
      if (isFavorited) {
        newFavorites = prevFavorites.filter(fav => fav.headline !== suggestion.headline);
      } else {
        newFavorites = [...prevFavorites, suggestion];
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!role.trim() || !goals.trim()) {
      setError('Please fill out both your current role and career goals.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const results = await generateHeadlines(role, goals);
      setSuggestions(results);
    } catch (err) {
      setError(
        'Failed to generate headlines. Please check your connection or API key and try again.'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [role, goals]);
  
  const handleClear = useCallback(() => {
    setRole('');
    setGoals('');
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <HeroSection />

        <div className="max-w-3xl mx-auto">
          <InputForm 
            role={role} 
            setRole={setRole} 
            goals={goals} 
            setGoals={setGoals}
            isLoading={isLoading} 
            onSubmit={handleSubmit}
            onClear={handleClear}
            hasSuggestions={suggestions.length > 0}
          />
          
          {favorites.length > 0 && (
            <FavoritesSection favorites={favorites} onRemoveFavorite={handleToggleFavorite} />
          )}

          {error && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            
            {suggestions.length > 0 && (
              <div className="space-y-6">
                 <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-6">
                    Generated Headlines
                </h2>
                {suggestions.map((suggestion, index) => (
                  <HeadlineCard
                    key={index}
                    suggestion={suggestion}
                    index={index}
                    isFavorited={favorites.some(fav => fav.headline === suggestion.headline)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
