# Movie Comparison App 🎬🍿

![Demo Screenshot](screenshot.png) _(optional: add screenshot later)_

A web application that allows users to compare two movies side-by-side, displaying detailed information and highlighting which film performs better across various metrics like ratings, box office earnings, and awards.

## Features ✨

- **Dual Autocomplete Search**: Search for two movies simultaneously with intelligent suggestions
- **Detailed Movie Profiles**: View comprehensive information including:
  - Title, Year, and Genre
  - Plot summary
  - Poster image
  - Awards count
  - Box office earnings
  - Metacritic score
  - IMDB rating and vote count
- **Smart Comparison**: Automatically highlights which movie performs better in each category
- **Responsive Design**: Works well on both desktop and mobile devices

## How It Works ⚙️

1. Type in the left search box to find your first movie
2. Type in the right search box to find your second movie
3. The app automatically:
   - Fetches complete movie details from OMDB API
   - Displays all relevant information in clean cards
   - Compares metrics and visually indicates the better performer

## Technical Implementation 💻

### Core Components

- **Autocomplete System**:

  - Debounced input handling (500ms delay)
  - Dynamic dropdown results
  - Customizable rendering options

- **Comparison Engine**:

  - Numeric value extraction from varied data formats
  - Statistical comparison across multiple metrics
  - Visual highlighting of superior values

- **Data Processing**:
  - API response normalization
  - Special handling for missing/irregular data
  - Award counting algorithm

### Technologies Used

- **Frontend**:

  - Vanilla JavaScript (ES6+)
  - Bulma CSS framework for styling
  - Axios for API requests

- **API**:
  - OMDB API (Open Movie Database)
