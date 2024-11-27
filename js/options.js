// options.js
import { updatePriceDisplay } from './calculation.js';
import { productName } from './main.js';

function colorToggle(element) {
    // Сначала убираем класс active у всех опций в данном блоке
    const optionBlock = element.closest('.modal__option');
    optionBlock.querySelectorAll('.modal__choice').forEach(choice => {
        choice.classList.remove('active');
    });

    // Добавляем класс active выбранной опции
    element.classList.add('active');

    // Обновляем выбранные опции и вызываем пересчет цены
    updateSelectedOptions();
}

function updateSelectedOptions() {
    const selectedCountElement = document.querySelector('#count .modal__choice.active');
    const selectedTypeElement = document.querySelector('.modal__option[data-type="type"] .modal__choice.active');

    const selectedType = selectedTypeElement ? selectedTypeElement.textContent : null;
    const selectedCount = selectedCountElement ? selectedCountElement.textContent : null;

    if (selectedType && selectedCount) {
        updatePriceDisplay(productName, selectedType, selectedCount);
    }
}

export { colorToggle };
