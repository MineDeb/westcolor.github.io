// calculation.js

import { products } from './main.js';
import { currentProductId } from './modal.js';

let price = 0;
window.price = price;

// calculation.js

function calculatePrice(productId, selectedType, selectedCount, selectedMaterial = null) {
  const product = products[productId];
  // Если текущий товар — "Шары"
  if (productId === 'balls') {
      if (product.prices[selectedMaterial] && product.prices[selectedMaterial][selectedType] && product.prices[selectedMaterial][selectedType][selectedCount]) {
          price = product.prices[selectedMaterial][selectedType][selectedCount];
          return price;
      } else {
          return 0; // Возвращаем 0, если цена не найдена
      }
  }

  // Для остальных товаров
  if (product && product.prices && product.prices[selectedType] && product.prices[selectedType][selectedCount]) {
      price = product.prices[selectedType][selectedCount];
      return product.prices[selectedType][selectedCount];
  } else {
      console.error("Цена не найдена для указанных опций:", { productId, selectedType, selectedCount });
      return 0; // Возвращаем 0, если цена не найдена
  }
}



function updatePriceDisplay(productId, selectedType, selectedCount, selectedMaterial = null) {
  let price;

  if (productId === 'balls') {
      // Обработка для товара "Шары"
      price = calculatePrice(productId, selectedType, selectedCount, selectedMaterial);
  } else {
      // Обработка для остальных товаров
      price = calculatePrice(productId, selectedType, selectedCount);
  }

  // Обновляем отображение цены в интерфейсе
  const priceElement = document.querySelector('.price span');
  if (priceElement) {
      priceElement.textContent = `${price} ₽`;
  } else {
      console.error("Не удалось обновить отображение цены: элемент .price span не найден.");
  }
}



// Экспортируем функцию для использования в других модулях
export { updatePriceDisplay, calculatePrice, price };
