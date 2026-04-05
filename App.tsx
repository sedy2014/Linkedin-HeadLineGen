
import React, { useState, useCallback, useEffect } from 'react';
import type { HeadlineSuggestion } from './types';
import { generateHeadlines, summarizeLinkedInProfile } from './services/geminiService';
import { HeadlineCard } from './components/HeadlineCard';
import { HeroSection } from './components/HeroSection';
import { InputForm } from './components/InputForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FavoritesSection } from './components/FavoritesSection';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import mammoth from 'mammoth';

const FAVORITES_KEY = 'linkedin-headline-favorites';
const THEME_KEY = 'linkedin-headline-theme';

const App: React.FC = () => {
  const [role, setRole] = useState('');
  const [goals, setGoals] = useState('');
  const [linkedInProfileUrl, setLinkedInProfileUrl] = useState('');
  const [useProfileForIdeation, setUseProfileForIdeation] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
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

  const handleEditSuggestion = useCallback((index: number, newHeadlineText: string, newRationaleText: string) => {
    const originalSuggestion = suggestions[index];
    if (!originalSuggestion) return;

    // Update in suggestions
    setSuggestions(prevSuggestions => {
      const updatedSuggestions = [...prevSuggestions];
      updatedSuggestions[index] = { 
        ...originalSuggestion, 
        headline: newHeadlineText,
        rationale: newRationaleText 
      };
      return updatedSuggestions;
    });

    // Update in favorites if it was a favorite
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.map(fav =>
        fav.headline === originalSuggestion.headline // Compare against the original headline
          ? { ...fav, headline: newHeadlineText, rationale: newRationaleText }
          : fav
      );
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, [suggestions]);


  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!role.trim() && !linkedInProfileUrl.trim() && !resumeFile) {
      setError('Please provide at least a role, a LinkedIn profile, or a resume.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Analyzing your profile and crafting headlines...');
    setError(null);
    setSuggestions([]);

    let profileSummary: string | undefined;
    let resumeText: string | undefined;
    let synthesizedRole = role.trim();

    // 1. Extract Resume Text if available
    if (resumeFile) {
      setLoadingMessage('Extracting information from your resume...');
      try {
        const arrayBuffer = await resumeFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        resumeText = result.value;
      } catch (err) {
        console.error('Error extracting text from resume:', err);
        setError('Failed to extract text from the resume. Please ensure it\'s a valid .docx file.');
        setIsLoading(false);
        setLoadingMessage(null);
        return;
      }
    }

    // 2. Fetch LinkedIn Profile Summary if requested
    if (useProfileForIdeation && linkedInProfileUrl.trim()) {
      setLoadingMessage('Fetching and summarizing LinkedIn profile...');
      try {
        profileSummary = await summarizeLinkedInProfile(linkedInProfileUrl.trim());
        if (profileSummary) {
          // Try to extract role from profile summary
          const roleMatch = profileSummary.match(/current role is ([^,.]+)/i) || profileSummary.match(/works as a ([^,.]+)/i);
          if (roleMatch) {
            synthesizedRole = roleMatch[1].trim(); // Prioritize LinkedIn info as requested
          }
        }
      } catch (err) {
        console.error('LinkedIn summary error:', err);
        // We can continue if we have other info
      }
    }

    // Final check: if we still don't have a role and no resume/goals, it might be too vague
    if (!synthesizedRole && !resumeText && !goals.trim()) {
      setError('Insufficient information to generate headlines. Please provide more details.');
      setIsLoading(false);
      setLoadingMessage(null);
      return;
    }

    setLoadingMessage('Generating headline suggestions...');
    try {
      const results = await generateHeadlines(synthesizedRole || 'Professional', goals, profileSummary, resumeText);
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
  }, [role, goals, linkedInProfileUrl, useProfileForIdeation, resumeFile]);
  
  const handleClear = useCallback(() => {
    setRole('');
    setGoals('');
    setLinkedInProfileUrl('');
    setUseProfileForIdeation(false);
    setResumeFile(null);
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
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
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
                    onEdit={handleEditSuggestion} // Pass the new onEdit prop
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