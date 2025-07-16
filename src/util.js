import { reverseView, updateView } from "./state.js";
import { renderPokemonCards } from "./render.js";

export function getNumberOutOfString(string) {
  if (typeof string !== "string") return string;
  let result = string.replace(/[^0-9.]/g, "");

  if (result === "" || isNaN(result)) return string;
  return parseFloat(result);
}

export function cloneTemplate(id) {
  const template = document.getElementById(id);
  const fragment = template.content.cloneNode(true);
  return fragment.firstElementChild;
}

export function formatId(id) {
  let formatted = "#";
  if (id < 10) formatted += "00" + id;
  else if (id < 100) formatted += "0" + id;
  else formatted += id;

  return formatted;
}

export function refreshView() {
  renderPokemonCards(updateView());
}

export function refreshReverseView() {
  renderPokemonCards(reverseView());
}

export const labelify = (s) =>
  `${s[0].toUpperCase() + s.slice(1).toLowerCase()}: `;

export const capitalize = (s) =>
  `${s[0].toUpperCase() + s.slice(1).toLowerCase()} `;
