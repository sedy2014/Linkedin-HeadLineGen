
import React from 'react';

export const HeroSection: React.FC = () => {
    return (
        <header className="text-center mb-10 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">
                LinkedIn Headline A/B Tester
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                Craft the perfect first impression. Input your role and goals to generate 10 AI-powered headline variations, each scored for maximum impact.
            </p>
        </header>
    );
};
