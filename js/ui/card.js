import { formatId, refreshView } from "../util.js";
import { showModal, closeModal } from "../modal.js";
import { state, updateFavorites, deletePokemon } from "../state.js";
import { launchPokemonInputForm } from "./forms.js";

export function initCardUI() {
  const grid = document.getElementById("pokemon-grid");
  fillCardGrid(grid, state.all);
}

function fillCardGrid(grid, data) {
  grid.addEventListener("click", (e) => {
    const cardEl = e.target.closest(".card");
    if (!cardEl) return; // clicked outside a card

    const id = cardEl.dataset.id;
    const pokemon = data.find((p) => p.id == id);
    if (pokemon) buildCard(pokemon);
  });
}

export function buildCard(pokemon) {
  if (!pokemon) return;

  const template = document.getElementById("pokemon-detailed-modal-template");
  const card = template.content.cloneNode(true);

  card.querySelector(".modal-name").textContent = pokemon.name;
  card.querySelector(".modal-id").textContent = formatId(pokemon.id);
  card.querySelector(".modal-species").textContent = pokemon.species;
  card.querySelector(".modal-type1").textContent = pokemon.type1;
  card.querySelector(".modal-type2").textContent = pokemon.type2 ?? "N/A";
  card.querySelector(".modal-hire-img").src = pokemon.hireImgOverride
    ? URL.createObjectURL(pokemon.hireImgOverride)
    : pokemon.hireImg;
  //card.querySelector(".modal-pixel-sprite").src = pokemon.pixelSprite;
  card.querySelector(".modal-description").textContent = pokemon.description;
  card.querySelector(
    ".modal-height"
  ).textContent = `Height: ${pokemon.height} m`;
  card.querySelector(
    ".modal-weight"
  ).textContent = `Weight: ${pokemon.weight} kg`;
  card.querySelector(".modal-hp").textContent = `HP: ${pokemon.hp}`;
  card.querySelector(".modal-attack").textContent = `Attack: ${pokemon.attack}`;
  card.querySelector(
    ".modal-defense"
  ).textContent = `Defense: ${pokemon.defense}`;
  card.querySelector(".modal-speed").textContent = `Speed: ${pokemon.speed}`;

  const modalContainer = showModal(card, true);

  //add button functionality
  const modalFavoriteBtn = modalContainer.querySelector(".modal-favorite-btn");
  const modalEditBtn = modalContainer.querySelector(".modal-edit-btn");

  const favoriteStar = modalFavoriteBtn.querySelector("span");
  if (pokemon.favorite) favoriteStar.style.color = "gold";

  modalFavoriteBtn.addEventListener("click", () => {
    pokemon.toggleFavorite();
    if (pokemon.favorite) favoriteStar.style.color = "gold";
    else favoriteStar.style.color = "gray";
    updateFavorites();
  });

  modalEditBtn.addEventListener("click", () => {
    closeModal(modalContainer);
    launchPokemonInputForm(pokemon);
  });

  const modalDeletePokemonBtn = modalContainer.querySelector(
    ".modal-delete-pokemon-btn"
  );

  modalDeletePokemonBtn.addEventListener("click", () => {
    handleDeletePokemon(modalContainer, pokemon);
  });
}

function handleDeletePokemon(modalParent, pokemon) {
  const template = document.getElementById("modal-confirm-delete-pokemon");
  const card = template.content.cloneNode(true);

  const confirmDeleteBtn = card.querySelector("#confirm-delete-btn");
  const backBtn = card.querySelector("#back-btn");
  const name = card.querySelector("#delete-name");

  name.textContent = pokemon.name;

  const modalWrapper = showModal(card, true);
  backBtn.addEventListener("click", () => {
    closeModal(modalWrapper);
  });

  confirmDeleteBtn.addEventListener("click", () => {
    if (modalParent) closeModal(modalParent);
    closeModal(modalWrapper);
    if (pokemon) {
      deletePokemon(pokemon);
      refreshView();
    }
  });
}
