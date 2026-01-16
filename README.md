
# LinkedIn Headline A/B Tester

This application helps users generate and score multiple LinkedIn headline variations based on their current role and career goals. It uses the Google Gemini API to provide 10 optimized headline options, each with a detailed score and rationale to help enhance their professional profile.

## Features

-   **AI-Powered Suggestions**: Leverages the Gemini API to generate creative and effective LinkedIn headlines.
-   **Scoring System**: Each headline is scored out of 100 based on key metrics.
-   **Detailed Rationale**: Provides a clear breakdown for each score, analyzing:
    -   **Clarity & Conciseness**: How easy the headline is to understand.
    -   **Keyword Optimization**: Use of relevant keywords for the user's industry.
    -   **Audience Appeal**: How compelling the headline is to the target audience (recruiters, clients, etc.).
-   **Responsive UI**: Clean and modern interface built with React and Tailwind CSS.
-   **Save Favorites**: Star your favorite headlines and they will be saved in your browser for future reference.

## How It Works

1.  **Enter Your Details**: Fill in your current role/title and your primary career goals.
2.  **Generate Headlines**: The app sends your input to the Gemini API.
3.  **Review Results**: The app displays 10 headline suggestions, sorted by their score. Each suggestion includes the detailed rationale, now formatted as a clear, readable list.
4.  **Favorite Headlines**: Click the star icon on any headline to save it to your "Favorites" list, which persists across sessions.

## Getting Started

To run this application, you need to have an API key from Google AI Studio.

1.  Set up your environment with the `API_KEY` variable.
2.  Open `index.html` in your web browser.

The application will then be ready to use.
