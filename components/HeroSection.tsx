
import React from 'react';

export const HeroSection: React.FC = () => {
    return (
        <header className="text-center mb-10 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text)] mb-3"> {/* Changed to use CSS variable */}
                LinkedIn Headline A/B Tester
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto"> {/* Changed to use CSS variable */}
                Craft the perfect first impression. Input your role and goals to generate 10 AI-powered headline variations, each scored for maximum impact.
            </p>
        </header>
    );
};