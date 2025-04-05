/**
 * Creates an autocomplete dropdown widget
 * @param {Object} config - Configuration object
 * @param {HTMLElement} config.root - DOM element to render the autocomplete in
 * @param {Function} config.renderOption - Function to render each dropdown item
 * @param {Function} config.onOptionSelect - Callback when an item is selected
 * @param {Function} config.inputValue - Gets the value to put in input when item selected
 * @param {Function} config.fetchData - Async function to fetch search results
 */
const creaAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  // Initialize the autocomplete HTML structure
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input"/>
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
  `;

  // DOM element references
  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  /**
   * Handles the input event - fetches and displays results
   * @param {Event} event - Input event
   */
  const onInput = async (event) => {
    // Fetch data using the provided search term
    const items = await fetchData(event.target.value);

    // Close dropdown if no results
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    // Clear previous results and open dropdown
    resultsWrapper.innerHTML = ``;
    dropdown.classList.add("is-active");

    // Create and append each result item
    for (let item of items) {
      const option = document.createElement("a");
      option.classList.add("dropdown-item");

      // Render the option content using provided function
      option.innerHTML = renderOption(item);

      // Set up click handler for this option
      option.addEventListener("click", () => {
        // Close dropdown and update input value
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);

        // Execute the provided selection callback
        onOptionSelect(item);
      });

      resultsWrapper.appendChild(option);
    }
  };

  // Set up debounced input event listener (500ms delay)
  input.addEventListener("input", debounce(onInput, 500));

  // Close dropdown when clicking outside the widget
  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
