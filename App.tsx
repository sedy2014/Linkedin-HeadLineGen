
import React, { useState, useCallback, useEffect } from 'react';
import type { HeadlineSuggestion } from './types';
import { generateHeadlines, summarizeLinkedInProfile } from './services/geminiService';
import { HeadlineCard } from './components/HeadlineCard';
import { HeroSection } from './components/HeroSection';
import { InputForm } from './components/InputForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FavoritesSection } from './components/FavoritesSection';
import { ThemeSwitcher } from './components/ThemeSwitcher';

const FAVORITES_KEY = 'linkedin-headline-favorites';
const THEME_KEY = 'linkedin-headline-theme';

const App: React.FC = () => {
  const [role, setRole] = useState('');
  const [goals, setGoals] = useState('');
  const [linkedInProfileUrl, setLinkedInProfileUrl] = useState('');
  const [useProfileForIdeation, setUseProfileForIdeation] = useState(false);
  const [suggestions, setSuggestions] = useState<HeadlineSuggestion[]>([]);
  const [favorites, setFavorites] = useState<HeadlineSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'gray'>(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_KEY);
      return (storedTheme === 'dark' || storedTheme === 'gray') ? storedTheme : 'light';
    } catch (e) {
      console.error("Failed to parse theme from localStorage", e);
      return 'light';
    }
  });

  // Effect to load/save favorites
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

  // Effect to apply theme class to HTML element
  useEffect(() => {
    document.documentElement.className = ''; // Clear existing theme classes
    document.documentElement.classList.add(`${theme}-theme`);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

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

  const handleEditHeadline = useCallback((index: number, newHeadlineText: string) => {
    const originalSuggestion = suggestions[index];
    if (!originalSuggestion) return;

    // Update in suggestions
    setSuggestions(prevSuggestions => {
      const updatedSuggestions = [...prevSuggestions];
      updatedSuggestions[index] = { ...originalSuggestion, headline: newHeadlineText };
      return updatedSuggestions;
    });

    // Update in favorites if it was a favorite
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.map(fav =>
        fav.headline === originalSuggestion.headline // Compare against the original headline
          ? { ...fav, headline: newHeadlineText }
          : fav
      );
      // If the original headline was not in favorites but the edited one should be, this handles it
      // For simplicity, we assume if it was a favorite, it's still treated as the same 'item'
      // just with updated text. If it wasn't a favorite, it won't be added.
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, [suggestions]);


  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!role.trim() || !goals.trim()) {
      setError('Please fill out both your current role and career goals.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Analyzing your profile and crafting headlines...');
    setError(null);
    setSuggestions([]);

    let profileSummary: string | undefined;

    if (useProfileForIdeation && linkedInProfileUrl.trim()) {
      setLoadingMessage('Fetching and summarizing LinkedIn profile...');
      try {
        profileSummary = await summarizeLinkedInProfile(linkedInProfileUrl.trim());
        if (!profileSummary) {
          setError('Could not summarize the LinkedIn profile. Please ensure it\'s a public profile and the URL is correct.');
          setIsLoading(false);
          setLoadingMessage(null); // Clear loading message on error
          return;
        }
      } catch (err) {
        setError(
          'Failed to summarize LinkedIn profile. Please check the URL or try again later.'
        );
        console.error(err);
        setIsLoading(false);
        setLoadingMessage(null); // Clear loading message on error
        return;
      }
    }

    setLoadingMessage('Generating headline suggestions...');
    try {
      const results = await generateHeadlines(role, goals, profileSummary);
      setSuggestions(results);
    } catch (err) {
      setError(
        'Failed to generate headlines. Please check your connection or API key and try again.'
      );
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, [role, goals, linkedInProfileUrl, useProfileForIdeation]);
  
  const handleClear = useCallback(() => {
    setRole('');
    setGoals('');
    setLinkedInProfileUrl('');
    setUseProfileForIdeation(false);
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
    setLoadingMessage(null);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] text-[var(--color-text)] transition-colors duration-300">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="absolute top-4 right-4 z-10">
          <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
        </div>
        <HeroSection />

        <div className="max-w-3xl mx-auto">
          <InputForm 
            role={role} 
            setRole={setRole} 
            goals={goals} 
            setGoals={setGoals}
            linkedInProfileUrl={linkedInProfileUrl}
            setLinkedInProfileUrl={setLinkedInProfileUrl}
            useProfileForIdeation={useProfileForIdeation}
            setUseProfileForIdeation={setUseProfileForIdeation}
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
            {isLoading && <LoadingSpinner message={loadingMessage} />}
            
            {suggestions.length > 0 && (
              <div className="space-y-6">
                 <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] text-center mb-6">
                    Generated Headlines
                </h2>
                {suggestions.map((suggestion, index) => (
                  <HeadlineCard
                    key={index}
                    suggestion={suggestion}
                    index={index}
                    isFavorited={favorites.some(fav => fav.headline === suggestion.headline)}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={handleEditHeadline} // Pass the new onEdit prop
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-[var(--color-text-secondary)] text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;