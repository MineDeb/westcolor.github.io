import { products } from "./main.js";
import { calculatePrice, price } from "./calculation.js";
import { closeModal } from "./modal.js";
import { productName } from "./main.js";
import { openModal } from "./modal.js";

let cart = [];
let currentEditIndex = null;

function addToCart(productId) {
  const product = products[productId];

  const requiredOptions = document.querySelectorAll(".modal__option");
  const selectedOptions = [
    ...document.querySelectorAll(".modal__choice.active"),
  ].map((select) => ({
    value: select.textContent,
  }));

  if (selectedOptions.length < requiredOptions.length) {
    let notification = document.getElementById("notification");
    notification.innerText = "Пожалуйста, выберите все необходимые опции";
    notification.classList.add("show");
    setTimeout(() => notification.classList.remove("show"), 5000);
    return;
  }

  const imageInput = document.getElementById("images");
  const uploadedFile = imageInput?.files[0]
    ? URL.createObjectURL(imageInput.files[0])
    : null; // Если файл не выбран, сохраняем null

  cart.push({
    productId,
    options: selectedOptions,
    price: price,
    title: product.title,
    uploadedFile, // Сохраняем загруженный макет или null
  });

  closeModal();
  renderCart();
  updateTotalPrice();
}

const cartContainer = document.querySelector(".calculator__list");
const empty = document.querySelector(".calculator__empty");

function renderCart() {
  // Очищаем только дочерние элементы, кроме `empty`
  cartContainer.querySelectorAll(".calculator__item").forEach((item) => item.remove());

  // Проверка, если корзина пуста
  if (cart.length === 0) {
    empty.classList.remove("hidden"); // Показать элемент empty
    cartContainer.style.justifyContent = "center";
    document.querySelector('.calculator__order').style.display = 'none';
    updateTotalPrice(); // Обновляем общую стоимость (сбрасываем на 0)
    return; // Завершаем выполнение функции
  }

  empty.classList.add("hidden"); // Скрыть элемент empty, если корзина не пуста

  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("calculator__item");
    cartItem.setAttribute('itemIndex', `${index}`);
    cartItem.innerHTML = `
      <h3 class='calculator__product'>${item.title}</h3>
      <p class='calculator__count'>${item.options[0].value}</p>
      <div class="calculator__controls">
        <img src="./assets/icons/edit.svg" alt="edit" class="calculator__edit" onclick="editCartItem(${index})">
        <img src="./assets/icons/remove.svg" alt="remove" class="calculator__remove" onclick="removeFromCart(${index})">
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });
  document.querySelector('.calculator__order').style.display = 'block';
  cartContainer.style.justifyContent = "flex-start";
}


function updateTotalPrice() {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const totalPriceElement = document.querySelector(".order__price > span");
  if (totalPriceElement) {
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }
}

function saveChanges() {
  const index = currentEditIndex;

  if (!cart[index]) {
    console.error(`Error: No item found in cart at index ${index}`);
    return;
  }

  const selectedOptions = [...document.querySelectorAll(".modal__choice.active")].map(
    (select) => ({
      value: select.textContent,
    })
  );

  const imageInput = document.getElementById("images");
  const uploadedFile = imageInput?.files[0]
    ? URL.createObjectURL(imageInput.files[0])
    : cart[index].uploadedFile;

  cart[index].options = selectedOptions;
  cart[index].price = price;
  cart[index].uploadedFile = uploadedFile;

  closeModal();
  renderCart();
  updateTotalPrice();
}

function editCartItem(index) {
  currentEditIndex = index;
  const item = cart[index];
  openModal(item.productId, true);

  const allChoices = document.querySelectorAll(".modal__choice");
  allChoices.forEach((choice) => choice.classList.remove("active"));

  item.options.forEach((option) => {
    const matchingChoice = Array.from(allChoices).find(
      (choice) => choice.textContent === option.value
    );
    if (matchingChoice) {
      matchingChoice.classList.add("active");
    }
  });

  const dropContainer = document.getElementById("dropcontainer");

  if (item.uploadedFile) {
    dropContainer.style.backgroundImage = `url(${item.uploadedFile})`;
    dropContainer.style.backgroundSize = "cover";
    dropContainer.style.backgroundPosition = "center";
  } else {
    // Убираем фон, если файл отсутствует
    dropContainer.style.backgroundImage = "none";
  }

  const priceElement = document.querySelector(".price span");
  if (priceElement) {
    priceElement.textContent = item.price || "0 ₽";
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
  updateTotalPrice();
}

window.editCartItem = editCartItem;
window.removeFromCart = removeFromCart;
window.saveChanges = saveChanges;

export { addToCart, renderCart, editCartItem, removeFromCart, saveChanges };
