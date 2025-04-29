import "../pages/index.css";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import { setButtonText } from "../utils/helpers.js";

import Api from "../utils/Api.js";

import logoSrc from "../images/logo.svg";
const logo = document.getElementById("spot-logo");
logo.src = logoSrc;

import avatarSrc from "../images/avatar.jpg";
const avatar = document.getElementById("profile-avatar");
avatar.src = avatarSrc;

import pencilSrc from "../images/pencil.svg";
const pencil = document.getElementById("pencil-icon");
pencil.src = pencilSrc;

import plusSrc from "../images/plus.svg";
const plus = document.getElementById("plus-icon");
plus.src = plusSrc;

import closeSrc from "../images/closebtn.svg";
const close = document.getElementById("close-icon");
close.src = closeSrc;

import modalcloseSrc from "../images/closebtn.svg";
const modalclose = document.getElementById("modal-close-icon");
modalclose.src = modalcloseSrc;

import pencilLightIconSrc from "../images/pencil-light.svg";
const pencilLight = document.getElementById("pencil-icon-light");
pencilLight.src = pencilLightIconSrc;

import avatarModalCloseBtnSrc from "../images/closebtn.svg";
const avatarclose = document.getElementById("avatar-close-icon");
avatarclose.src = avatarModalCloseBtnSrc;

import deleteModalCloseBtnSrc from "../images/closebtn.svg";
const deleteModalCloseBtn = document.getElementById("delete-close-icon");
deleteModalCloseBtn.src = deleteModalCloseBtnSrc;

//This is no longer needed as we are getting the data from the API
// const initialCards = [
//   {
//     name: "Golden Gate bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "db594dac-f4d3-4ca5-8583-622198f51c69",
    "Content-Type": "application/json",
  },
});

//destructure the second item in the callback function of the .then()
api
  .getAppInfo()
  .then(([cards, users]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    avatar.src = users.avatar;
    profileName.textContent = users.name;
    profileDescription.textContent = users.about;
  })
  .catch(console.error);

//Profile related
const profileName = document.querySelector(".profile__name");
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileDescription = document.querySelector(".profile__description");
const cardModalButton = document.querySelector(".profile__add-btn");
const avatarModalButton = document.querySelector(".profile__avatar-btn");

//Form related
const editModal = document.querySelector("#edit-profile-modal");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
//advised to change id name from something generic such as "name"
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editFormElement = editModal.querySelector(".modal__form");

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const profileSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardForm = cardModal.querySelector(".modal__form");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//Avatar related
const avatarModal = document.querySelector("#avatar-modal");
// Duplicate declaration removed
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");

//Preview related
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

//Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

//Delete form elements
const cardDeleteModal = document.querySelector("#delete-modal");
const deleteForm = cardDeleteModal.querySelector(".modal__form");
const cancelModalCloseBtn = cardDeleteModal.querySelector(
  ".modal__submit-btn_delete_cancel"
);

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const deleteSubmitBtn = evt.submitter;
  setButtonText(deleteSubmitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(cardDeleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteSubmitBtn, false, "Delete");
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(cardDeleteModal);
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button-liked");
  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button-liked");
    })
    .catch(console.error);
}

//using data as a placeholder but they are objects, precisely the ones above to clone cards
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button-liked");
  }

  cardNameEl.textContent = data.name;
  cardImageEl.setAttribute("src", data.link);
  cardImageEl.setAttribute("alt", data.name);
  // Can also be written as:
  // cardImageEl.src = data.link
  // cardImageEl.alt = data.alt

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function handleEscKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscKey);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const profileSubmitBtn = evt.submitter;
  setButtonText(profileSubmitBtn, true, "Saving...");

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
      disableButton(profileSubmitBtn, settings);
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(profileSubmitBtn, false, "Save");
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const avatarSubmitBtn = evt.submitter;
  setButtonText(avatarSubmitBtn, true, "Saving...");

  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      avatar.src = data.avatar;
      closeModal(avatarModal);
      disableButton(avatarSubmitBtn, settings);
      evt.target.reset();
    })

    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitBtn, false, "Save");
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const addSubmitBtn = evt.submitter;
  setButtonText(addSubmitBtn, true, "Saving...");

  api
    .addNewCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      resetValidation(cardForm, [cardNameInput, cardLinkInput]);
      disableButton(addSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(addSubmitBtn, false, "Save");
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, [
    editModalNameInput,
    editModalDescriptionInput,
  ]);
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
  const submitBtn = cardForm.querySelector(settings.submitButtonSelector);
  disableButton(submitBtn, settings);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
  const submitBtn = avatarForm.querySelector(settings.submitButtonSelector);
  disableButton(submitBtn, settings);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(cardDeleteModal);
});

cancelModalCloseBtn.addEventListener("click", () => {
  closeModal(cardDeleteModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

editFormElement.addEventListener("submit", handleEditFormSubmit);

cardForm.addEventListener("submit", handleAddCardSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

const allModals = document.querySelectorAll(".modal");

allModals.forEach((currentModal) => {
  currentModal.addEventListener("click", (evt) => {
    if (evt.target === currentModal) {
      closeModal(currentModal);
    }
  });
});

enableValidation(settings);
