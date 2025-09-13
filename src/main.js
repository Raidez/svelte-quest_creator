import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "toastify-js/src/toastify.css";

import { mount } from "svelte";
import { addMessages, init } from "svelte-i18n";
import App from "./App.svelte";

import en from "./i18n/en.json";
import fr from "./i18n/fr.json";

// Initialize localization (localStorage saved the locale preference)
addMessages("en", en);
addMessages("fr", fr);

init({
  fallbackLocale: "en",
  initialLocale: localStorage.getItem("locale"),
});

// Svelte app initialization
const app = mount(App, {
  target: document.getElementById("app"),
});

export default app;
