
import React from 'react';

interface InputFormProps {
    role: string;
    setRole: (value: string) => void;
    goals: string;
    setGoals: (value: string) => void;
    isLoading: boolean;
    onSubmit: (event: React.FormEvent) => void;
    onClear: () => void;
    hasSuggestions: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ role, setRole, goals, setGoals, isLoading, onSubmit, onClear, hasSuggestions }) => {
    return (
        <form onSubmit={onSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200">
            <div className="space-y-6">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                        Your Current Role / Title
                    </label>
                    <input
                        id="role"
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g., Senior Product Manager at TechCorp"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-slate-900"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-slate-700 mb-2">
                        Your Career Goals
                    </label>
                    <textarea
                        id="goals"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        placeholder="e.g., Attract recruiters for Director-level roles in AI, connect with startup founders."
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-slate-900"
                        disabled={isLoading}
                    />
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
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                        disabled={isLoading}
                    >
                        Start Over
                    </button>
                )}
            </div>
        </form>
    );
};
