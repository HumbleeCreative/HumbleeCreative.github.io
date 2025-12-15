// script.js

// * Get a reference to the body element where our theme class will be applied.
const bodyElement = document.body; // Changed from document.documentElement

// ----------------------------------------------------------------------
// * Function to apply the chosen theme class
// ----------------------------------------------------------------------
function applyThemeClass(themeName) {
  // * This function now only adds/removes the class on the body
  if (themeName === "dark") {
    bodyElement.classList.add("dark-theme");
  } else {
    bodyElement.classList.remove("dark-theme");
  }
}

// ----------------------------------------------------------------------
// * INITIALIZATION LOGIC: Wait for the header component to load
// ----------------------------------------------------------------------
customElements.whenDefined("custom-header").then(() => {
  // * 1. Get the custom-header element from the page
  const customHeader = document.querySelector("custom-header");

  // * 2. Access the Shadow DOM root of the component
  const shadowRoot = customHeader.shadowRoot;

  // * 3. Query for the toggle inside the Shadow DOM (This is the crucial step!)
  const darkModeToggle = shadowRoot.querySelector("#darkModeToggle");

  if (darkModeToggle) {
    // ----------------------------------------------------------------------
    // * Event listener for the Dark Mode toggle (checkbox change)
    // ----------------------------------------------------------------------
    darkModeToggle.addEventListener("change", function () {
      if (this.checked) {
        // * SWITCH TO DARK MODE: Add the class
        applyThemeClass("dark");
        localStorage.setItem("theme", "dark");
      } else {
        // * SWITCH TO LIGHT MODE: Remove the class
        applyThemeClass("light");
        localStorage.setItem("theme", "light");
      }
    });

    // ----------------------------------------------------------------------
    // * Initializer: Check localStorage on page load
    // ----------------------------------------------------------------------
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      // * Apply the class immediately if saved
      applyThemeClass("dark");

      // * Manually set the checkbox to the 'checked' state
      darkModeToggle.checked = true;
    }
  } else {
    console.error(
      "Error: Dark Mode toggle element not found in custom-header's Shadow DOM."
    );
  }
});
