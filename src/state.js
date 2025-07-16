import { quickSortByObjectAttribute } from "./sortLogic.js";

export const state = {
  all: [],
  view: [],
  favorites: [],
  filters: {
    types: [],
    search: "",
  },
  sortkey: "id",
  pageSize: 24,
  currentPage: 1,
};

export function initState(data) {
  state.all = data.map((p) => p.clone());
  state.view = [...state.all];
}

export function updateFilters(filterCheckboxes) {
  state.filters.types = [];

  state.filters.types = filterCheckboxes
    .filter((f) => f.checked)
    .map((f) => f.value.toLowerCase());
}

function applySort(data) {
  return quickSortByObjectAttribute(data, state.sortkey);
}

function applyFilters(data) {
  const filteredArray = data.filter((pokemon) => {
    const matchesType =
      state.filters.types.includes(pokemon.type1?.toLowerCase()) ||
      state.filters.types.includes(pokemon.type2?.toLowerCase());

    const matchesSearch =
      pokemon.name.toLowerCase().includes(state.filters.search.toLowerCase()) ||
      pokemon.species
        .toLowerCase()
        .includes(state.filters.search.toLowerCase());

    return matchesType && matchesSearch;
  });

  return filteredArray;
}

export function updateView() {
  state.view = applyFilters(state.all);
  state.view = applySort(state.view);

  const maxPage = Math.max(1, Math.ceil(state.view.length / state.pageSize));
  state.currentPage = Math.min(state.currentPage, maxPage);

  return state.view;
}

export function updateFavorites() {
  state.favorites = [];
  state.favorites = state.all.filter((pokemon) => {
    return pokemon.favorite;
  });
}

export function getNextID() {
  if (state.all.length === 0) return 1;
  const nextID = Math.max(...state.all.map((p) => p.id)) + 1;
  return nextID;
}

export function reverseView() {
  return state.view.reverse();
}

export function deletePokemon(pokemon) {
  const toDelete = state.all.indexOf(pokemon);
  if (toDelete > -1) {
    state.all.splice(toDelete, 1);
    return true;
  } else return false;
}
