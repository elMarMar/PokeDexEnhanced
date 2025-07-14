import { state, updateFilters } from "../state.js";
import { refreshView, refreshReverseView } from "../util.js";

const toggleFilterBtn = document.getElementById("toggle-filters-btn");
const filterMenu = document.getElementById("filter-menu");
const filterOverlay = document.getElementById("filter-overlay");
const typeCheckBoxes = [...document.querySelectorAll(".type-filter")];
const toggleAllBtn = document.getElementById("toggle-all-filters");

export function initFiltersUI() {
  // Slide-in Filters tab from the left
  toggleFilterBtn.addEventListener("click", () => {
    filterMenu.classList.remove("hidden");
    requestAnimationFrame(() => {
      filterMenu.classList.add("active");
    });
    filterOverlay.classList.remove("hidden");
  });

  filterOverlay.addEventListener("click", () => {
    filterMenu.classList.remove("active");
    filterOverlay.classList.add("hidden");
  });

  filterMenu.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") return;
    if (!filterMenu.classList.contains("active")) {
      filterMenu.classList.add("hidden");
    }
  });

  typeCheckBoxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      updateFilters(typeCheckBoxes);
      refreshView();
    });

    // Start off with all values and loaded into filters
    state.filters.types.push(cb.value);
  });

  toggleAllBtn.addEventListener("click", () => {
    let selectAll = true;

    for (let i = 0; i < typeCheckBoxes.length; i++) {
      if (typeCheckBoxes[i].checked) {
        selectAll = false;
        break;
      }
    }

    if (selectAll)
      typeCheckBoxes.forEach((cb) => {
        cb.checked = true;
      });
    else
      typeCheckBoxes.forEach((cb) => {
        cb.checked = false;
      });

    updateFilters(typeCheckBoxes);
    refreshView();
  });

  //Init Reverse List
  const reverseListBtn = document.getElementById("sort-by-reverse-list");
  reverseListBtn.addEventListener("click", () => {
    refreshReverseView();
  });
  initSearchUI();
}

const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
function initSearchUI() {
  searchBtn.addEventListener("click", () => {
    state.filters.search = searchBar.value;
    refreshView();
  });
}
