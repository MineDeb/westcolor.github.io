const button = document.querySelector('.about__btn');
const targetElement = document.querySelector('.catalog');

// Добавляем обработчик события на кнопку
button.addEventListener('click', () => {
  // Прокручиваем страницу к целевому элементу
  targetElement.scrollIntoView({ behavior: 'smooth' });
});