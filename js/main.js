import { openModal, closeModal } from './modal.js';
import { addToCart, renderCart, editCartItem, removeFromCart, saveChanges} from './cart.js'

export let products = [];
let productName;

// Загрузка данных и рендеринг карточек
fetch('data/products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    // renderProductCards(products);
  });

// Делегирование события на кнопки "Добавить" в контейнере карточек
document.querySelector('.catalog__wrapper').addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const productId = event.target.closest('.catalog__item').dataset.id;
    // console.log(products)
    console.log(productId);
    productName = productId;
    openModal(productId);
  }
});


document.querySelector('.modal__close').addEventListener('click', closeModal);

export { productName }