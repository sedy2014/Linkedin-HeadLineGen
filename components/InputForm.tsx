
import React from 'react';

interface InputFormProps {
    role: string;
    setRole: (value: string) => void;
    goals: string;
    setGoals: (value: string) => void;
    linkedInProfileUrl: string;
    setLinkedInProfileUrl: (value: string) => void;
    useProfileForIdeation: boolean;
    setUseProfileForIdeation: (value: boolean) => void;
    isLoading: boolean;
    onSubmit: (event: React.FormEvent) => void;
    onClear: () => void;
    hasSuggestions: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ 
    role, 
    setRole, 
    goals, 
    setGoals, 
    linkedInProfileUrl,
    setLinkedInProfileUrl,
    useProfileForIdeation,
    setUseProfileForIdeation,
    isLoading, 
    onSubmit, 
    onClear, 
    hasSuggestions 
}) => {
    return (
        <form onSubmit={onSubmit} className="bg-[var(--color-secondary-bg)] p-6 md:p-8 rounded-xl shadow-theme border border-[var(--color-border)]"> {/* Changed to use CSS variables and custom shadow-theme */}
            <div className="space-y-6">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-[var(--color-text)] mb-2"> {/* Changed to use CSS variable */}
                        Your Current Role / Title
                    </label>
                    <input
                        id="role"
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g., Senior Product Manager at TechCorp"
                        className="w-full px-4 py-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-[var(--color-secondary-bg)] text-[var(--color-text)]" /* Changed to use CSS variables */
                        disabled={isLoading}
                        aria-describedby="role-help"
                    />
                    <p id="role-help" className="mt-1 text-sm text-[var(--color-text-secondary)]"> {/* Changed to use CSS variable */}
                        Provide your current or target job title and company.
                    </p>
                </div>
                <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-[var(--color-text)] mb-2"> {/* Changed to use CSS variable */}
                        Your Career Goals
                    </label>
                    <textarea
                        id="goals"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        placeholder="e.g., Attract recruiters for Director-level roles in AI, connect with startup founders."
                        rows={4}
                        className="w-full px-4 py-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-[var(--color-secondary-bg)] text-[var(--color-text)]" /* Changed to use CSS variables */
                        disabled={isLoading}
                        aria-describedby="goals-help"
                    />
                    <p id="goals-help" className="mt-1 text-sm text-[var(--color-text-secondary)]"> {/* Changed to use CSS variable */}
                        Describe what you want to achieve with your LinkedIn profile (e.g., land a new job, networking).
                    </p>
                </div>
                <div className="border-t border-[var(--color-border)] pt-6"> {/* Changed to use CSS variable */}
                    <label htmlFor="linkedin-profile" className="block text-sm font-medium text-[var(--color-text)] mb-2"> {/* Changed to use CSS variable */}
                        LinkedIn Profile for Ideation (Optional)
                    </label>
                    <input
                        id="linkedin-profile"
                        type="url"
                        value={linkedInProfileUrl}
                        onChange={(e) => setLinkedInProfileUrl(e.target.value)}
                        placeholder="e.g., https://www.linkedin.com/in/john-doe"
                        className="w-full px-4 py-2 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-[var(--color-secondary-bg)] text-[var(--color-text)]" /* Changed to use CSS variables */
                        disabled={isLoading}
                        aria-describedby="profile-help"
                    />
                    <p id="profile-help" className="mt-1 text-sm text-[var(--color-text-secondary)]"> {/* Changed to use CSS variable */}
                        Paste a public LinkedIn profile URL to give the AI more context for generating tailored headlines.
                    </p>
                    <div className="flex items-center mt-3">
                        <input
                            id="use-profile-ideation"
                            type="checkbox"
                            checked={useProfileForIdeation}
                            onChange={(e) => setUseProfileForIdeation(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-[var(--color-input-border)] rounded" /* Changed to use CSS variable */
                            disabled={isLoading || !linkedInProfileUrl.trim()}
                        />
                        <label htmlFor="use-profile-ideation" className="ml-2 block text-sm text-[var(--color-text)] cursor-pointer"> {/* Changed to use CSS variable */}
                            Use this profile for headline ideation
                        </label>
                    </div>
                </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                    type="submit"
                    className="w-full sm:w-auto flex-grow inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                    disabled={isLoading || !role || !goals}
                >
                    {isLoading ? 'Generating...' : 'Generate Headlines'}
                </button>
                 {hasSuggestions && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-[var(--color-input-border)] text-base font-medium rounded-md text-[var(--color-text)] bg-[var(--color-secondary-bg)] hover:bg-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors" /* Changed to use CSS variables */
                        disabled={isLoading}
                    >
                        Start Over
                    </button>
                )}
            </div>
        </form>
    );
};