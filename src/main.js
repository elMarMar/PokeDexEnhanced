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
  const data = await initData("../rawData/pokedex.json");
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

function initUtilUI() {
  document.addEventListener("click", (e) => {
    if (e.target.matches(".modal-exit-btn")) {
      const wrapper = e.target.closest(".modal-wrapper");
      if (wrapper) closeModal(wrapper);
    }
  });
}

main();
