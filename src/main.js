// Import core modules
import { initData, initialPokemonData } from "./data.js";
import { initState, updateView, updateFilters, state } from "./state.js";
import { refreshView } from "./util.js";
import { startHeroSlideshow } from "./slideshow.js";

// Import UI modules
import { initCardUI } from "./ui/card.js";
import { initFiltersUI } from "./ui/filters.js";
import { initSortUI } from "./ui/sortUI.js";
import { initFavoritesUI } from "./ui/favorites.js";
import { initAddPokemonUI } from "./ui/forms.js";
import { closeModal } from "./modal.js";

async function main() {
  try {
    await initData(["data/pokedex.json"]);
  } catch (error) {
    console.error(`Failed to load data from all sources`, error);
    return;
  }
  initState(initialPokemonData.arr);
  initUI();
}

function initUI() {
  const typeFilterCheckboxes = [...document.querySelectorAll(".type-filter")];
  updateFilters(typeFilterCheckboxes);

  initFiltersUI();
  initSortUI();
  initFavoritesUI();
  initAddPokemonUI();

  initCardUI();
  refreshView();

  startHeroSlideshow(state.all);
}

main();
