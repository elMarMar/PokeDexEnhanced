import { labelify, getNumberOutOfString, refreshView } from "../util.js";
import { state, getNextID } from "../state.js";
import { showModal, closeModal } from "../modal.js";
import { Pokemon } from "../data.js";
import { buildCard } from "./card.js";

const editableFields = [
  { key: "name", class: "modal-name", type: "text" },
  { key: "id", class: "modal-id", type: "number" },
  { key: "species", class: "modal-species", type: "text" },
  {
    key: "description",
    class: "modal-description",
    control: "textarea",
    type: "text",
  },
  { key: "type1", class: "modal-type1", control: "select", type: "select" },
  { key: "type2", class: "modal-type2", control: "select", type: "select" },
  {
    key: "pixelSprite",
    class: "modal-pixel-sprite",
    control: "image",
    type: "file",
  },
  { key: "hireImg", class: "modal-hire-img", control: "image", type: "file" },
  { key: "height", class: "modal-height", type: "number" },
  { key: "weight", class: "modal-weight", type: "number" },
  { key: "hp", class: "modal-hp", type: "number" },
  { key: "attack", class: "modal-attack", type: "number" },
  { key: "defense", class: "modal-defense", type: "number" },
  { key: "speed", class: "modal-speed", type: "number" },
];

const pokemonTypes = [
  "N/A",
  "Normal",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dark",
  "Dragon",
  "Steel",
  "Fairy",
];

export function launchPokemonAddForm() {
  const template = document.getElementById("pokemon-input-form-template");
  const cardFragment = template.content.cloneNode(true);

  const modalWrapper = showModal("", true);

  // Auto-fill  *some* inputs
  // ID autofill:
  const idInputField = cardFragment.querySelector(".modal-id-field");
  const idInput = idInputField.querySelector("#modal-id-input");
  idInput.value = getNextID();

  // Image Preview Set Up
  editableFields.forEach((ef) => {
    if (ef.control !== "image") return;

    const key = ef.key;
    const fieldContainer = cardFragment.querySelector(`.${ef.class}-field`);
    const input = fieldContainer.querySelector(`#${ef.class}-input`);

    const preview = cardFragment.querySelector(`.${ef.class}-preview`);
    input.addEventListener("change", () => {
      updatePreview(input.files[0], preview);
    });
  });

  modalWrapper.appendChild(cardFragment);

  const card = modalWrapper.querySelector(".modal-card");
  const saveInputBtn = card.querySelector(".modal-save-input-btn");

  saveInputBtn.addEventListener("click", () => {
    //validate inputs
    for (let i = 0; i < editableFields.length; i++) {
      const ef = editableFields[i];
      const success = validateInput(
        card.querySelector(`.${ef.class}-input`).value,
        ef
      );
      if (!success) return;
    }

    // Create Pokemon if we're not editing a pokemon
    const pokemon = Pokemon.createEmptyPokemon();
    state.all.push(pokemon);

    editableFields.forEach((ef) => {
      applyPokemonEdit(card, ef, pokemon);
    });

    refreshView();
    closeModal(modalWrapper);
    buildCard(pokemon);
  });

  return modalWrapper;
}

export function launchPokemonInputForm(pokemon) {
  const template = document.getElementById("pokemon-input-form-template");
  const cardFragment = template.content.cloneNode(true);

  const modalWrapper = showModal("", true);

  editableFields.forEach((ef) => {
    fillEditFields(cardFragment, ef, pokemon);
  });

  modalWrapper.appendChild(cardFragment);

  const card = modalWrapper.querySelector(".modal-card");
  const saveInputBtn = card.querySelector(".modal-save-input-btn");

  saveInputBtn.addEventListener("click", () => {
    //validate inputs
    for (let i = 0; i < editableFields.length; i++) {
      const ef = editableFields[i];
      const success = validateInput(
        card.querySelector(`.${ef.class}-input`).value,
        ef
      );
      if (!success) return;
    }

    // Create Pokemon if we're not editing a pokemon
    editableFields.forEach((ef) => {
      applyPokemonEdit(card, ef, pokemon);
    });

    refreshView();
    closeModal(modalWrapper);
    buildCard(pokemon);
  });

  return modalWrapper;
}

function fillEditFields(card, editableField, pokemon) {
  const key = editableField.key;

  const fieldContainer = card.querySelector(`.${editableField.class}-field`);
  const input = fieldContainer.querySelector(`#${editableField.class}-input`);

  if (editableField.control === "image") {
    const preview = card.querySelector(`.${editableField.class}-preview`);
    preview.src = pokemon[`${key}Override`]
      ? URL.createObjectURL(pokemon[`${key}Override`])
      : pokemon[key];

    input.addEventListener("change", () => {
      updatePreview(input.files[0], preview);
    });
  } else input.value = pokemon[key];
}

export function applyPokemonEdit(card, editableField, pokemon) {
  const key = editableField.key;

  const fieldContainer = card.querySelector(`.${editableField.class}-field`);
  const input = fieldContainer.querySelector(`#${editableField.class}-input`);

  if (editableField.control === "image") {
    if (input.files[0]) {
      pokemon[`${key}Override`] = input.files[0];
    }
  } else if (editableField.control === "select") {
    if (input.value === "") pokemon[key] = null;
    else pokemon[key] = input.value;
  } else if (editableField.type === "number") {
    pokemon[key] = Number(getNumberOutOfString(input.value) || 0);
  } else {
    pokemon[key] = input.value;
  }

  return true;
}

function validateInput(value, field) {
  const key = field.key;
  const type = field.type;
  const ctrl = field.control;

  if ((type === "text" && !ctrl) || ctrl === "textarea") {
    if (value.trim() === "") {
      alert(`Please enter a value for ${key}.`);
      return false;
    }
    return true;
  }

  if (type === "number") {
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      alert(`Please enter a valid (non‑negative) number for ${key}.`);
      return false;
    }
    return true;
  }

  if (ctrl === "select") {
    const isBlank = value === "" || value === "N/A";
    if (key === "type1" && isBlank) {
      alert("Type 1 cannot be blank or N/A.");
      return false;
    }
    // type2 may be blank: allow it
    return true;
  }
  return true;
}

export function initAddPokemonUI() {
  const addPokemonBtn = document.getElementById("add-pokemon-btn");
  addPokemonBtn.addEventListener("click", () => {
    const modalWrapper = launchPokemonAddForm();
    const card = modalWrapper.querySelector(".modal-card");
    const saveInputBtn = modalWrapper.querySelector(".modal-save-input-btn");
    saveInputBtn.innerHTML = "Add Pokemon";
  });
}

function updatePreview(file, preview) {
  const url = URL.createObjectURL(file);
  preview.src = url;

  preview.onload = () => {
    URL.revokeObjectURL(url);
  };
}
