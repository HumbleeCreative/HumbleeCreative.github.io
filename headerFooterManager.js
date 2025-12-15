// headerFooterManager.js

// * Define the current year once for use in the footer.
const currentYear = new Date().getFullYear();

// -----------------------------------------------------------------------------
// * 1. CONSTRUCTABLE STYLESHEETS SETUP (The Magic for External CSS)
// -----------------------------------------------------------------------------

// * Create two new empty CSSStyleSheet objects. These are JavaScript objects
// * that will hold the CSS rules from our external files. This is the modern high-performance way.
const headerSheet = new CSSStyleSheet();
const footerSheet = new CSSStyleSheet();

// * We create a Promise that will wait for BOTH CSS files to load and parse.
// * Our custom components will wait for this promise to resolve before they become visible
// * to prevent a nasty Flash of Unstyled Content (FOUC).
const stylePromise = Promise.all([
  // * We use the native fetch API to grab the CSS file content.
  fetch("./header.css")
    .then((response) => response.text()) // * Get the raw CSS code as a string.
    // * replaceSync() is a method that converts the CSS string into a usable Stylesheet object.
    .then((css) => headerSheet.replaceSync(css))
    // ! Basic error handling for file loading. If this fails, the component won't be styled.
    .catch((err) => console.error("! Failed to load header.css:", err)),

  // * Repeat the process for the footer's CSS file.
  fetch("./footer.css")
    .then((response) => response.text())
    .then((css) => footerSheet.replaceSync(css))
    .catch((err) => console.error("! Failed to load footer.css:", err)),
]);

// -----------------------------------------------------------------------------
// * 2. CUSTOM HEADER COMPONENT DEFINITION
// -----------------------------------------------------------------------------
// * We extend the HTMLElement class to tell the browser this is a new type of HTML element.
class CustomHeader extends HTMLElement {
  // * The constructor runs instantly when the browser sees <custom-header> in index.html.
  constructor() {
    super(); // * Always call super() first!

    // * Attach the Shadow DOM. This creates an isolated, private DOM tree (#shadow-root).
    const shadowRoot = this.attachShadow({ mode: "open" });

    // * The HTML structure for a tight single-row header (10vh)
    shadowRoot.innerHTML = `
    <header>
        <h1>Lee Curtis</h1>

        <nav>
            <ul>
                <li><a href="#placeholder">Placeholder</a></li>
                <li><a href="/weather-dashboard/">Weather Dashboard</a></li>
            </ul>
        </nav>

        <div class="toggle-container">
            <input type="checkbox" id="darkModeToggle" class="checkbox" />
            <label for="darkModeToggle" class="switch">
            <span class="icon sun">☀</span>
            <span class="icon moon">⏾</span>
            </label>
        </div>

        </header>
        `;

    // * Now we wait for the CSS to load.
    stylePromise.then(() => {
      // * When the styles are ready, we apply them to the Shadow Root.
      shadowRoot.adoptedStyleSheets = [headerSheet];

      // * Anti-FOUC Fix: We remove the hiding class to make the component visible.
      this.classList.remove("fouc-hidden");
    });
  }
}

// -----------------------------------------------------------------------------
// * 3. CUSTOM FOOTER COMPONENT DEFINITION (No change needed here)
// -----------------------------------------------------------------------------
class CustomFooter extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });

    // * Render the footer's HTML structure. We use the JavaScript variable
    // * ${currentYear} inside the template literal.
    shadowRoot.innerHTML = `
<div class="footer-part-1">
<a href="#top">Back to top</a>
</div>
<div class="footer-part-2">
© Lee Curtis ${currentYear}
</div>
`;

    // * Wait for the CSS loading promise to finish.
    stylePromise.then(() => {
      // * Apply the external footer styles.
      shadowRoot.adoptedStyleSheets = [footerSheet];

      // * Reveal the footer once the styling is complete.
      this.classList.remove("fouc-hidden");
    });
  }
}

// -----------------------------------------------------------------------------
// * 4. ELEMENT REGISTRATION
// -----------------------------------------------------------------------------
customElements.define("custom-header", CustomHeader);
customElements.define("custom-footer", CustomFooter);
