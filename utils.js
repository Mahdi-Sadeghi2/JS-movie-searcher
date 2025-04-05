/**
 * Creates a debounced version of a function that delays its execution
 * until after a specified wait time has elapsed since the last time it was invoked.
 *
 * @param {Function} func - The function to debounce
 * @param {number} delay - The number of milliseconds to delay (default: 1000ms)
 * @returns {Function} - A new debounced function
 */
const debounce = (func, delay = 1000) => {
  let timeOutId; // Stores the timeout ID so we can cancel it

  // Return a new function that will manage the debouncing
  return (...args) => {
    // If there's a pending timeout, cancel it
    if (timeOutId) {
      clearTimeout(timeOutId);
    }

    // Set a new timeout
    timeOutId = setTimeout(() => {
      // When the timeout completes, execute the original function
      // with the provided arguments
      func.apply(null, args);
    }, delay);
  };
};
