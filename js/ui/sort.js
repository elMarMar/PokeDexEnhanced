import { refreshView } from "../util.js";
import { state } from "../state.js";

const sortByOptions = [
  "name",
  "id",
  "height",
  "weight",
  "hp",
  "attack",
  "defense",
  "speed",
];

export function initSortUI() {
  sortByOptions.forEach((option) => {
    const btnId = `sort-by-${option}-btn`;
    const btn = document.getElementById(`${btnId}`);
    btn.addEventListener("click", () => {
      state.sortkey = option;
      refreshView();
    });
  });
}
