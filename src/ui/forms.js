import {
  cloneTemplate,
  getNumberOutOfString,
  labelify,
  refreshView,
} from "../util.js";
import { state, getNextID } from "../state.js";
import { showModal, closeModal } from "../modal.js";
import { Pokemon } from "../data.js";
import { buildCard } from "./card.js";

const editableFields = [
  { key: "name", class: "js-name", type: "text", placement: "left" },
  { key: "id", class: "js-id", type: "number", placement: "left" },
  { key: "species", class: "js-species", type: "text", placement: "left" },
  {
    key: "type1",
    class: "js-type1",
    control: "select",
    type: "select",
    placement: "left",
  },
  {
    key: "type2",
    class: "js-type2",
    control: "select",
    type: "select",
    placement: "left",
  },
  {
    key: "pixelSprite",
    class: "js-pixelSprite",
    control: "image",
    type: "file",
    placement: "left",
  },
  {
    key: "hireImg",
    class: "js-hireImg",
    control: "image",
    type: "file",
    placement: "left",
  },

  {
    key: "description",
    class: "js-description",
    control: "textarea",
    type: "text",
    placement: "right",
  },
  { key: "height", class: "js-height", type: "number", placement: "right" },
  { key: "weight", class: "js-weight", type: "number", placement: "right" },
  { key: "hp", class: "js-hp", type: "number", placement: "right" },
  { key: "attack", class: "js-attack", type: "number", placement: "right" },
  { key: "defense", class: "js-defense", type: "number", placement: "right" },
  { key: "speed", class: "js-speed", type: "number", placement: "right" },
];

export function initAddPokemonUI() {
  const addPokemonBtn = document.getElementById("add-pokemon-btn");
  addPokemonBtn.addEventListener("click", () => {
    const modalWrapper = launchPokemonAddForm();
    const card = modalWrapper.querySelector(".modal-card");
    const saveInputBtn = modalWrapper.querySelector(".js-save-input-btn");
    saveInputBtn.innerHTML = "Add Pokemon";
  });
}

export function launchPokemonInputForm(pokemon) {
  const card = cloneTemplate("pokemon-input-form-template");

  buildFields(card);
  fillEditFields(card, pokemon);

  const modalWrapper = showModal(card, true);

  const saveInputBtn = card.querySelector(".js-save-input-btn");
  saveInputBtn.addEventListener("click", () => {
    for (let i = 0; i < editableFields.length; i++) {
      const ef = editableFields[i];
      const success = validateInput(
        card.querySelector(`.${ef.class}-input`).value,
        ef
      );
      if (!success) return;
    }

    editableFields.forEach((ef) => {
      applyPokemonEdit(card, ef, pokemon);
    });

    refreshView();
    closeModal(modalWrapper);
    buildCard(pokemon);
  });

  return modalWrapper;
}

export function launchPokemonAddForm() {
  const card = cloneTemplate("pokemon-input-form-template");
  buildFields(card);

  const modalWrapper = showModal(card, true);

  // Auto-fill  *some* inputs
  // ID autofill:
  const idInput = card.querySelector(".js-id-input");
  idInput.value = getNextID();

  // Image Preview Set Up
  editableFields.forEach((ef) => {
    if (ef.control !== "image") return;

    const input = card.querySelector(`.${ef.class}-input`);
    const preview = card.querySelector(`.${ef.class}-preview`);
    input.addEventListener("change", () => {
      updatePreview(input.files[0], preview);
    });
  });

  modalWrapper.appendChild(card);

  const saveInputBtn = card.querySelector(".js-save-input-btn");
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

function buildFields(parentContainer) {
  const modalInputFormLeft = parentContainer.querySelector(
    ".modal-input-form-left"
  );
  const modalInputFormRight = parentContainer.querySelector(
    ".modal-input-form-right"
  );
  editableFields.forEach((ef) => {
    const inputField = cloneTemplate("input-field-template");
    inputField.classList.add(`modal-${ef.key}-field`);
    const input = inputField.querySelector("input");
    input.classList.add(`${ef.class}-input`);

    const label = inputField.querySelector("label");
    label.setAttribute("for", `${ef.key}-input`);
    label.textContent = labelify(`${ef.key}`);

    if (ef.type === "select") {
      const select = document.createElement("select");
      input.replaceWith(select);
      select.classList.add(`${ef.class}-input`);

      const selectTypeOption = document.createElement("option");
      selectTypeOption.value = "";
      selectTypeOption.textContent = "Select Type";

      const naOption = document.createElement("option");
      naOption.value = "N/A";
      naOption.textContent = "N/A";

      select.appendChild(selectTypeOption);
      select.appendChild(naOption);

      Pokemon.types.forEach((type) => {
        const option = document.createElement("option");
        option.value = `${type}`;
        option.textContent = `${type}`;
        select.appendChild(option);
      });
    } else if (ef.control === "image") {
      inputField.classList.add("drop-zone");
      input.type = "file";
      input.accept = "image/*";
      input.name = ef.key;

      const preview = document.createElement("img");
      preview.classList.add("modal-img-preview");
      preview.classList.add(`${ef.class}-preview`);
      preview.alt = "Image Preview";

      inputField.appendChild(preview);
    } else if (ef.control === "textarea") {
      const textarea = document.createElement("textArea");
      input.replaceWith(textarea);
      textarea.classList.add(`modal-${ef.key}-input`);
      textarea.classList.add(`${ef.class}-input`);
    } else {
      input.type = ef.type;
      input.name = ef.key;
    }

    if (ef.placement === "left") modalInputFormLeft.appendChild(inputField);
    else if (ef.placement === "right")
      modalInputFormRight.appendChild(inputField);
  });
}

function fillEditFields(parentContainer, pokemon) {
  editableFields.forEach((field) => {
    const key = field.key;
    const input = parentContainer.querySelector(`.${field.class}-input`);
    if (!input) return;

    if (field.control === "image") {
      const preview = parentContainer.querySelector(`.${field.class}-preview`);
      preview.src = pokemon[`${key}Override`]
        ? URL.createObjectURL(pokemon[`${key}Override`])
        : pokemon[key];

      input.addEventListener("change", () => {
        updatePreview(input.files[0], preview);
      });
    } else if (field.control === "select") {
      input.value = pokemon[key] ?? "N/A";
    } else {
      input.value = pokemon[key];
    }
  });
}

//todo: clean this function up
export function applyPokemonEdit(card, editableField, pokemon) {
  const key = editableField.key;

  const input = card.querySelector(`.${editableField.class}-input`);

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

function updatePreview(file, preview) {
  const url = URL.createObjectURL(file);
  preview.src = url;

  preview.onload = () => {
    URL.revokeObjectURL(url);
  };
}
