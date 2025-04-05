// Configuration object for autocomplete functionality
const autocompleteConfig = {
  // Function to render each movie option in the dropdown
  renderOption: (movie) => {
    // Handle missing poster images by using empty string if "N/A"
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `<img src="${imgSrc}"/>
    ${movie.Title} (${movie.Year})`;
  },

  // Function to set the input value when a movie is selected
  inputValue(movie) {
    return movie.Title;
  },

  // Async function to fetch movie data from OMDB API
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "af8341de", // API key for OMDB
        s: searchTerm, // Search query parameter
      },
    });

    // Return empty array if there's an error, otherwise return search results
    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  },
};

// Initialize autocomplete for the left search box
creaAutoComplete({
  ...autocompleteConfig, // Spread the base configuration
  root: document.querySelector("#left-autocomplete"), // DOM element to attach to
  onOptionSelect(movie) {
    // Hide tutorial when a movie is selected
    document.querySelector(".tutorial").classList.add("is-hidden");
    // Fetch and display detailed movie info
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});

// Initialize autocomplete for the right search box (same as left but mirrored)
creaAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

// Variables to store the selected movies for comparison
let leftMovie;
let rightMovie; // Note: There was a typo here ("reightMovie" in original code)

// Function to handle movie selection and display details
const onMovieSelect = async (movie, summaryElement, side) => {
  // Fetch detailed movie info using the IMDB ID
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "af8341de",
      i: movie.imdbID, // Get by ID instead of search term
    },
  });

  // Update the DOM with the movie details
  summaryElement.innerHTML = movieTemplate(response.data);

  // Store the movie data for comparison
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  // If both movies are selected, run the comparison
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

// Function to compare the two selected movies
const runComparison = () => {
  // Get all statistic elements from both sides
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  // Compare each stat pair and highlight the better one
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);

    // Highlight the worse stat with warning color
    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};

// Function to generate HTML template for movie details
const movieTemplate = (movieDetail) => {
  // Parse various numeric values from the movie data
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const Metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

  // Calculate total awards by summing all numbers in Awards string
  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);
    return isNaN(value) ? prev : prev + value;
  }, 0);

  // Return HTML template with all movie information
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image"><img src="${movieDetail.Poster}"/></p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${Metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Meta Score</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
