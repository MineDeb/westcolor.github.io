// modal.js
import { products } from './main.js';
import { renderCart, addToCart } from './cart.js';
import { colorToggle } from './options.js';
import { updatePriceDisplay } from './calculation.js';
import { productName } from './main.js';

let currentProductId = null;
let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {}; // Загруженные файлы по ID товара

// Открытие модального окна
function openModal(productId, isEdit = false) {
    currentProductId = productId;
    const product = products[productId];
    window.product = product;

    const modal = document.querySelector('.modal');
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('open'), 10);
    document.body.style.overflowY = 'hidden';
    document.body.classList.add('modal-open');

    const modalData = document.querySelector('.modal__data');
    modalData.innerHTML = ''; // Очистка содержимого

    // Заголовок модального окна
    let title = document.createElement('div');
    title.innerHTML = `<h2 class="modal__title">${product.title}</h2>`;
    modalData.prepend(title);

    // Контейнер для количества (count)
    let countContainer = document.createElement('div');
    countContainer.classList.add('modal__option');
    countContainer.id = 'count';

    product.count.forEach(count => {
        let countSpan = document.createElement('span');
        countSpan.classList.add('modal__choice');
        countSpan.textContent = count;
        countContainer.append(countSpan);

        countSpan.addEventListener('click', () => {
            colorToggle(countSpan);
            updateSelectedOptions();
        });
    });
    modalData.append(countContainer);

    // Опции
    product.options.forEach(option => {
        let optionContainer = document.createElement('div');
        optionContainer.classList.add('modal__option');
    
        // Проверяем, если товар - шары, и название опции - "Материал", задаем data-type="material"
        if (productId === 'balls' && option.title === 'Материал') {
            optionContainer.setAttribute('data-type', 'material');
        } else {
            optionContainer.setAttribute('data-type', 'type'); // Для остальных стандартное значение
        }
    
        let optionTitle = document.createElement('div');
        optionTitle.classList.add('option__title');
        optionTitle.textContent = option.title;
        optionContainer.append(optionTitle);
    
        option.choices.forEach(choice => {
            let choiceButton = document.createElement('span');
            choiceButton.textContent = choice;
            choiceButton.classList.add('modal__choice');
            optionContainer.append(choiceButton);
    
            choiceButton.addEventListener('click', () => {
                colorToggle(choiceButton);
                updateSelectedOptions();
            });
        });
    
        if (productId === 'balls' && option.title === 'Материал') {
            let additionalInfo = document.createElement('div');
            additionalInfo.classList.add('modal__descr');
            additionalInfo.id = "material";
            additionalInfo.style.color = '#DD6342';
            additionalInfo.textContent = 'Более точные цены и наличие шаров уточняйте у менеджера.';
            optionContainer.appendChild(additionalInfo);
        }
    
        modalData.append(optionContainer);
    });
    

    const actionButton = document.createElement('button');
    actionButton.classList.add('modal__btn');
    actionButton.textContent = isEdit ? 'Сохранить' : 'Добавить';
    actionButton.onclick = () => isEdit ? saveChanges(productId) : addToCart(productId);

    let footer = document.createElement('div');
    footer.classList.add('modal__footer');
    footer.innerHTML = `
        <label for="images" class="drop-container" id="dropcontainer">
            <img src="assets/icons/upload.svg" alt="upload">
            <span class="drop-title">Загрузите макет (при наличии)</span>
            <input type="file" id="images" accept="image/svg+xml,image/png,video/webm" title=" ">
        </label>
        <h3 class="price">Цена: <span>0 ₽</span></h3>
    `;
    footer.appendChild(actionButton);
    modalData.append(footer);

    const imageInput = document.getElementById('images');
    imageInput.addEventListener('change', handleFileUpload);

    // Если это редактирование и файл уже загружен для товара, показываем его
    if (isEdit && uploadedFiles[currentProductId]) {
        applyBackgroundImage(uploadedFiles[currentProductId]);
    }
}

// Обработчик загрузки файла
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && ['image/svg+xml', 'image/png', 'video/webm'].includes(file.type)) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64Image = e.target.result;
            uploadedFiles[currentProductId] = base64Image; // Сохраняем файл по ID товара
            localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles)); // Сохраняем в localStorage
            applyBackgroundImage(base64Image); // Применяем фон
        };
        reader.readAsDataURL(file);
    } else {
        alert('Пожалуйста, загрузите файл в формате SVG, PNG или WebM');
    }
}

// Применяет изображение как фон input
function applyBackgroundImage(base64Image) {
    const dropContainer = document.getElementById('dropcontainer');
    dropContainer.style.backgroundImage = `url(${base64Image})`;
    dropContainer.style.backgroundSize = 'cover';
    dropContainer.style.backgroundPosition = 'center';
}

// Функция для обновления отображения цены

function updateSelectedOptions() {
    const selectedCountElement = document.querySelector('#count .modal__choice.active');
    const selectedTypeElement = document.querySelector('.modal__option[data-type="type"] .modal__choice.active');
    const selectedMaterialElement = document.querySelector('.modal__option[data-type="material"] .modal__choice.active');

    const selectedType = selectedTypeElement ? selectedTypeElement.textContent : null;
    const selectedMaterial = selectedMaterialElement ? selectedMaterialElement.textContent : null;
    const selectedCount = selectedCountElement ? selectedCountElement.textContent : null;

    if (currentProductId === 'balls') {
        // Логика для шаров
        if (!selectedType || !selectedMaterial || !selectedCount) {
            return;
        }
        updatePriceDisplay(currentProductId, selectedType, selectedCount, selectedMaterial);
    } else {
        // Логика для остальных товаров
        if (!selectedType || !selectedCount) {
            return;
        }
        updatePriceDisplay(currentProductId, selectedType, selectedCount);
    }
}


function closeModal() {
    const modal = document.querySelector('.modal');
    modal.classList.add('closing');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('open', 'closing');
        document.body.classList.remove('modal-open');
        document.body.style.overflowY = 'auto';
    }, 300);
}

export { openModal, closeModal, currentProductId };
