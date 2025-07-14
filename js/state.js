export const state = {
  all: [],
  view: [],
  favorites: [],
  filters: {
    types: [],
    search: "",
  },
  sortkey: "id",
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
  return state.view;
}

export function updateFavorites() {
  state.favorites = [];

  state.favorites = state.all.filter((pokemon) => {
    return pokemon.favorite;
  });
}

// Helper Function:
function quickSortByObjectAttribute(arr, attribute) {
  if (arr.length <= 1) return arr;

  const pivotObject = arr[arr.length - 1];
  const pivotAttribute = pivotObject[attribute];

  const leftArr = [];
  const rightArr = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][attribute] < pivotAttribute) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }

  return [
    ...quickSortByObjectAttribute(leftArr, attribute),
    pivotObject,
    ...quickSortByObjectAttribute(rightArr, attribute),
  ];
}

export function getNextID() {
  if (state.all.length === 0) return 1;

  for (var i = 1; i < state.all.length; i++) {
    if (state.all[i].id - state.all[i - 1].id != 1) {
      return state.all[i].id - 1;
    }
  }

  return state.all.length + 1;
}

export function reverseView() {
  return state.view.reverse();
}
