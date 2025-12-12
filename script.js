const main = document.querySelector(`main`);

const darkModeToggle = document.querySelector(`#darkMode`);
let darkMode = false;
darkModeToggle.addEventListener(`click`, function () {
  if (!darkMode) {
    main.style.backgroundColor = `#121212`;
    main.style.color = `#f2f2f2`;
    darkMode = true;
  } else {
    main.style.backgroundColor = `#f2f2f2`;
    main.style.color = `#121212`;
    darkMode = false;
  }
});
