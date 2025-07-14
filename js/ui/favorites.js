import { state } from "../state.js";
import { formatId } from "../util.js";
import { showModal } from "../modal.js";
import { buildCard } from "./card.js";

const favoritesBtn = document.getElementById("favorites-btn");
export function initFavoritesUI() {
  favoritesBtn.addEventListener("click", () => {
    showPokemonFavoritesModal(state.favorites);
  });
}

export function showPokemonFavoritesModal(pokemonDataFavorites) {
  const favoritesTemplate = document.getElementById("pokemon-favorites-modal");
  const content = favoritesTemplate.content.cloneNode(true);
  const favoritesCard = content.querySelector(".modal-favorites-card");
  const favoritesContent = favoritesCard.querySelector(
    ".modal-favorites-content"
  );

  pokemonDataFavorites.forEach((fav) => {
    const cardTemplate = document.getElementById("pokemon-card-template");
    const fragment = cardTemplate.content.cloneNode(true);
    const modalCard = fragment.querySelector(".card-container");

    modalCard.querySelector(".pokemon-name").textContent = fav.name;
    modalCard.querySelector(".pokemon-id").textContent = formatId(fav.id);
    modalCard.querySelector(".pokemon-species").textContent = fav.species;
    modalCard.querySelector(".pokemon-type1").textContent = fav.type1;
    modalCard.querySelector(".pokemon-type2").textContent = fav.type2 ?? "N/A";
    modalCard.querySelector(".pokemon-pixel-sprite").src = fav.pixelSprite;
    modalCard.querySelector(".pokemon-pixel-sprite").alt = fav.name;

    modalCard.dataset.id = fav.id;
    favoritesContent.appendChild(modalCard);
  });

  const modalContainer = showModal(content, true);
}
