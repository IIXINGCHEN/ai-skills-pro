const projectData = [
  {
    id: '[ID_1]',
    title: '[ITEM_TITLE_1]',
    description: '[ITEM_DESCRIPTION_1]',
    type: '[TYPE_1]',
  },
  {
    id: '[ID_2]',
    title: '[ITEM_TITLE_2]',
    description: '[ITEM_DESCRIPTION_2]',
    type: '[TYPE_2]',
  },
  {
    id: '[ID_3]',
    title: '[ITEM_TITLE_3]',
    description: '[ITEM_DESCRIPTION_3]',
    type: '[TYPE_3]',
  },
];

const grid = document.querySelector('#content-grid');

function renderCard(item) {
  const article = document.createElement('article');
  article.className = 'card';
  article.dataset.type = item.type;

  const title = document.createElement('h3');
  title.textContent = item.title;

  const description = document.createElement('p');
  description.textContent = item.description;

  article.append(title, description);
  return article;
}

if (grid) {
  grid.replaceChildren(...projectData.map(renderCard));
}
