import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "toastify-js/src/toastify.css";

import { mount } from 'svelte';
import { addMessages, init } from "svelte-i18n";
import App from './App.svelte';

import en from "./i18n/en.json";
import fr from "./i18n/fr.json";

// Initialize localization (cookie used to store locale preference)
function initializeLocale() {
  addMessages("en", en);
  addMessages("fr", fr);

  let initialLocale = "en";

  // Check for existing locale cookie
  cookieStore
    .get("locale")
    .then((cookie) => {
      if (cookie) {
        initialLocale = cookie.value;
      }

      init({
        fallbackLocale: "en",
        initialLocale: initialLocale,
      });
    })
    .catch((error) => {
      cookieStore.set("locale", initialLocale);
      console.error("Error accessing cookies:", error);
    });

  init({
    fallbackLocale: "en",
    initialLocale: initialLocale,
  });
}

initializeLocale();

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
