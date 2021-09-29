'use strict';

const {
  getRandomInt,
  shuffle,
  writeJsonFile,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

const generateRandomTitle = (titles) => {
  return titles[getRandomInt(0, TITLES.length - 1)];
};

const generateRandomCreatedDate = (date) => {
  return new Date(getRandomInt(date.setMonth(date.getMonth() - 3), date));
};

const generateRandomAnnounce = (sentences) => {
  return shuffle(sentences).slice(0, 4).join(` `);
};

const generateRandomFullText = (sentences) => {
  return shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `);
};

const generateRandomCategory = (categories) => {
  return categories[getRandomInt(0, categories.length - 1)];
};

const generatePublications = (count) => {
  const currentDate = new Date();
  return Array(count).fill({}).map(() => ({
    title: generateRandomTitle(TITLES),
    createdDate: generateRandomCreatedDate(currentDate),
    announce: generateRandomAnnounce(SENTENCES),
    fullText: generateRandomFullText(SENTENCES),
    category: generateRandomCategory(CATEGORIES),
  }));
};

const isCountPublicationsOverflow = (countPublications) => {
  if (countPublications <= 1000) {
    return;
  } else {
    throw new Error(`Не больше 1000 публикаций`);
  }
};


module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;
    try {
      isCountPublicationsOverflow(countPublications);
      const content = generatePublications(countPublications);
      writeJsonFile(FILE_NAME, content);
    } catch (err) {
      console.log(err);
    }
  }
};
