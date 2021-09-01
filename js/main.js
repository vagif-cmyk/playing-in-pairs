document.addEventListener('DOMContentLoaded', () => {

  let cardsDefault = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
  let cardsDynamic = [];
  let openСards = [];
  let numberOfCards = 8;
  let counter = 0;
  let cardWidth = 60;
  let timeRuns = false;
  let intervalId;
  const container = document.querySelector('.container');
  const flex = document.querySelector('.flex');
  const title = document.querySelector('.title');

  createForm();

  // функция которая создает форму
  function createForm() {
    const form = document.createElement('form');
    const inputOne = document.createElement('input');
    const inputTwo = document.createElement('input');
    const btnSubmit = document.createElement('button');

    inputOne.type = 'number';
    inputOne.placeholder = 'Кол-во карточек по горизонтали';
    inputTwo.type = 'number';
    inputTwo.placeholder = 'Кол-во карточек по вертикали';
    btnSubmit.type = 'submit';
    btnSubmit.textContent = 'Начать игру';

    form.classList.add('form');
    inputOne.classList.add('input');
    inputTwo.classList.add('input');
    btnSubmit.classList.add('btn-submit');

    container.append(form);
    form.append(inputOne);
    form.append(inputTwo);
    form.append(btnSubmit);

    form.addEventListener('submit', (elem) => {
      getFieldSize(elem);
      createTimer();
      title.classList.add('d-none');
    });
  }

  // функция которая берет из инпутов или из массива по умолчанию кол-во карточек
  // и вычисляет размеры игрового поля (контейнера).
  function getFieldSize(e) {

    gameOver();

    const form = document.querySelector('.form');
    const inputOne = form[0];
    const inputTwo = form[1];

    e.preventDefault();
    form.classList.add('d-none');
    flex.classList.remove('d-none');

    if ((inputOne.value && inputTwo.value) &&
      (inputOne.value % 2 == 0 && inputTwo.value % 2 == 0) &&
      (inputOne.value <= 10 && inputTwo.value <= 10)) {

      let widthContainer = inputOne.value * cardWidth + 2;
      container.style.width = `${widthContainer}px`;

      numberOfCards = (inputOne.value * inputTwo.value) / 2;

      createcardsDynamic(numberOfCards);
      createСards(cardsDynamic, numberOfCards);
    }
    else {
      createСards(cardsDefault, numberOfCards);
      let widthContainer = numberOfCards / 2 * cardWidth + 2;
      container.style.width = `${widthContainer}px`;
    }
  }
  // функция которая создает массив значений карточек на основе инпутов
  function createcardsDynamic(numberOfCards) {

    for (let i = 1; i <= numberOfCards; i++) {
      cardsDynamic.push(i);
      cardsDynamic.push(i);
    }
  }

   // функция которая перемешивает переданный массив
  function shuffle(cards) {

    for (let i = cards.length - 1; i > 0; i--) {

      let j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

   // функция которая перезапускает игру
  function playAgain(cards) {
    counter = 0;
    openСards = [];

    document.querySelector('.game-over').classList.add('d-none');
    document.querySelector('.timer').textContent = '60';
    document.querySelector('.btn').remove();
    document.querySelectorAll('.card').forEach((elem) => {
      elem.remove();
    });

    createСards(cards, numberOfCards);
  }

   // функция которая создает карточки
  function createСards(cards, numberOfCards) {

    cards = shuffle(cards); // перемешиваем

    createButtonAgain(cards);

    for (let i of cards) {
      const card = document.createElement('div');
      const cardValue = document.createElement('div');

      cardValue.textContent = i;
      card.classList.add('card');
      cardValue.classList.add('card-number', 'opasity-0');
      card.append(cardValue);
      flex.append(card);

      addEventForCard(card, cardValue, numberOfCards);
    }
  }

   // функция которая добавляет события на карточки.
  function addEventForCard(card, cardValue, numberOfCards) {

    card.addEventListener('click', () => {

      if (!timeRuns) {       // если timeRuns == false запускаем таймер.
        timeRuns = true;
        startTimer();
      }

      if (cardValue.classList.contains('opasity-0')) {  // если по карточке еще не кликали

        if (openСards.length == 1 &&
          openСards[0].textContent === cardValue.textContent) {  // если это второй клик и значения совпадают с первым: counter++
          counter++;
        }
        if (counter == numberOfCards) {  // если кол-во карточек / 2 совпадает с counter, значит все карточки отгаданы

          clearInterval(intervalId);
          messageGameOver('Победа! Мы это сделали!');
          timeRuns = false;

          document.querySelector('.game-over').classList.remove('d-none');
          document.querySelector('.btn').classList.remove('d-none');
        }
        if (openСards.length == 2 &&
          openСards[0].textContent !== openСards[1].textContent) { // если это третий клик и два предыдущих не совпадают: закрываем две предыдущие карточки

          openСards[0].classList.add('opasity-0');
          openСards[1].classList.add('opasity-0');
          openСards = [];

        }
        else if (openСards.length == 2) { // на третим клике обнуляем массив кот. подщитывает открытые карточки
          openСards = [];
        }

        cardValue.classList.remove('opasity-0');  // открываем карточку
        openСards.push(cardValue);
      }
    });
  }

   // функция которая создает кнопку "Сыграть еще раз"
  function createButtonAgain(cards) {
    const button = document.createElement('button');
    button.textContent = 'Сыграть ещё раз';
    button.classList.add('btn', 'd-none');
    container.append(button);

    button.addEventListener('click', () => {
      playAgain(cards);
    });
  }

  // timer

 // функция которая таймер
  function createTimer() {

    const body = document.querySelector('body');
    const timer = document.createElement('div');

    timer.classList.add('timer');
    timer.textContent = '60';
    body.append(timer);
  }

   // функция которая запускает таймер
  function startTimer() {

    if (timeRuns) {
      intervalId = setInterval(() => { decrement(intervalId) }, 1000);
    }
  }

   // функция которая уменьшает значение таймера
  function decrement(intervalId) {

    const timer = document.querySelector('.timer');

    if (timer.textContent == 0) {

      clearInterval(intervalId);
      messageGameOver('Упс...Время закончилось(');
      timeRuns = false;

      document.querySelector('.game-over').classList.remove('d-none');
      document.querySelector('.btn').classList.remove('d-none');
    }

    else { timer.textContent = parseInt(timer.textContent) - 1; }

  }

  // функция которая создает баннер который будет виден после партии
  function gameOver() {

    const gameOver = document.createElement('div');
    const body = document.querySelector('body');

    gameOver.classList.add('game-over', 'd-none');

    body.append(gameOver);

  }

  function messageGameOver(message) {
    document.querySelector('.game-over').textContent = message;
  }
});

