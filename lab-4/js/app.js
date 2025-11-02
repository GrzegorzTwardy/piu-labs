let kanbanState;

function getKanbanState() {
    return JSON.parse(localStorage.getItem('kanbanState'));
}

function saveKanbanState(state) {
    localStorage.setItem('kanbanState', JSON.stringify(state));
}

if (!localStorage.getItem('kanbanState')) {
    const newState = {
        idAssigner: 0,
        todo: { color: '', count: 0, cards: [] },
        inProgress: { color: '', count: 0, cards: [] },
        done: { color: '', count: 0, cards: [] },
    };
    saveKanbanState(newState);
}

kanbanState = getKanbanState();
const columns = Array.from(document.querySelectorAll('.column'));

class Card {
    constructor(id, title, text, color) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.color = color;
    }
}

function getTextColor(r, g, b) {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 186 ? 'black' : 'white';
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

function rgbToHex(r, g, b) {
    return (
        '#' +
        [r, g, b]
            .map((x) => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
    );
}

function updateCardContent(id, newTitle, newText) {
    ['todo', 'inProgress', 'done'].forEach((key) => {
        kanbanState[key].cards.forEach((card) => {
            if (String(card.id) === String(id)) {
                card.title = newTitle;
                card.text = newText;
            }
        });
    });
    saveKanbanState(kanbanState);
}

function getColumnType(column) {
    if (column.classList.contains('todo')) return 'todo';
    if (column.classList.contains('in-progress')) return 'in-progress';
    return 'done';
}

function createCard(column, cardData, save = true) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const arrowLeft = document.createElement('div');
    arrowLeft.classList.add('arrow', 'arrow-left');

    const arrowRight = document.createElement('div');
    arrowRight.classList.add('arrow', 'arrow-right');

    const newCard = document.createElement('div');
    newCard.classList.add('card');
    if (cardData) newCard.id = cardData.id;
    else {
        newCard.id = kanbanState.idAssigner;
        kanbanState.idAssigner += 1;
    }

    const header = document.createElement('div');
    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('icon-wrapper');

    const title = document.createElement('h3');
    title.contentEditable = 'true';
    title.textContent = cardData ? cardData.title : `Title #${newCard.id}`;
    header.appendChild(title);

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = `card-color-${newCard.id}`;
    colorInput.classList.add('card-color');
    if (cardData) colorInput.value = cardData.color;

    const colorIcon = document.createElement('label');
    colorIcon.title = 'Change Color';
    colorIcon.textContent = `≡`;
    colorIcon.classList.add('color-icon', 'icon');
    colorIcon.htmlFor = `card-color-${newCard.id}`;
    iconWrapper.appendChild(colorIcon);

    const deleteIcon = document.createElement('div');
    deleteIcon.textContent = `x`;
    deleteIcon.title = 'Remove Card';
    deleteIcon.classList.add('delete-icon', 'icon');
    iconWrapper.appendChild(deleteIcon);

    const text = document.createElement('p');
    text.contentEditable = 'true';
    text.classList.add('card-text');
    text.dataset.placeholder = 'Dodaj tekst...';

    if (cardData && cardData.text) {
        text.textContent = cardData.text;
    } else {
        text.innerHTML = '';
    }

    text.addEventListener('input', () => {
        if (text.innerHTML === '<br>' || text.innerHTML.trim() === '') {
            text.innerHTML = '';
        }
        updateCardContent(newCard.id, title.textContent, text.textContent);
    });

    title.addEventListener('input', () => {
        updateCardContent(newCard.id, title.textContent, text.textContent);
    });

    header.appendChild(iconWrapper);
    newCard.appendChild(header);
    newCard.appendChild(text);

    if (cardData) {
        newCard.style.backgroundColor = cardData.color;
        const rgb = hexToRgb(cardData.color);
        if (rgb) newCard.style.color = getTextColor(rgb.r, rgb.g, rgb.b);
    } else {
        const color = [0, 0, 0].map(() => Math.floor(Math.random() * 256));
        newCard.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        newCard.style.color = getTextColor(color[0], color[1], color[2]);
        colorInput.value = rgbToHex(...color);
    }

    const gap = document.createElement('div');
    gap.classList.add('card-gap');

    const colType = getColumnType(column);
    const counter = column.querySelector('.counter');

    if (colType === 'todo') {
        cardContainer.appendChild(gap);
        cardContainer.appendChild(newCard);
        cardContainer.appendChild(arrowRight);
        if (save)
            kanbanState.todo.cards.push(
                new Card(
                    newCard.id,
                    title.textContent,
                    text.textContent,
                    colorInput.value
                )
            );
        counter.innerHTML = kanbanState.todo.cards.length;
    } else if (colType === 'in-progress') {
        cardContainer.appendChild(arrowLeft);
        cardContainer.appendChild(newCard);
        cardContainer.appendChild(arrowRight);
        if (save)
            kanbanState.inProgress.cards.push(
                new Card(
                    newCard.id,
                    title.textContent,
                    text.textContent,
                    colorInput.value
                )
            );
        counter.innerHTML = kanbanState.inProgress.cards.length;
    } else {
        cardContainer.appendChild(arrowLeft);
        cardContainer.appendChild(newCard);
        cardContainer.appendChild(gap);
        if (save)
            kanbanState.done.cards.push(
                new Card(
                    newCard.id,
                    title.textContent,
                    text.textContent,
                    colorInput.value
                )
            );
        counter.innerHTML = kanbanState.done.cards.length;
    }

    cardContainer.appendChild(colorInput);
    column.appendChild(cardContainer);
    setupColorChange(colorInput);

    if (save) saveKanbanState(kanbanState);
}

kanbanState.todo.cards.forEach((c) => {
    createCard(document.querySelector('.todo'), c, false);
});
kanbanState.inProgress.cards.forEach((c) => {
    createCard(document.querySelector('.in-progress'), c, false);
});
kanbanState.done.cards.forEach((c) => {
    createCard(document.querySelector('.done'), c, false);
});
updateColumns();

function updateColumns() {
    columns.forEach((col) => {
        const colType = getColumnType(col);
        const counter = col.querySelector('.counter');

        if (colType === 'todo')
            counter.innerHTML = kanbanState.todo.cards.length;
        else if (colType === 'in-progress')
            counter.innerHTML = kanbanState.inProgress.cards.length;
        else counter.innerHTML = kanbanState.done.cards.length;
    });

    saveKanbanState(kanbanState);
}

function sortColumn(column, type) {
    const containers = Array.from(column.querySelectorAll('.card-container'));
    if (type === 'a-z' || type === 'z-a') {
        containers.sort((a, b) => {
            const textA =
                a.querySelector('h3')?.textContent.trim().toLowerCase() || '';
            const textB =
                b.querySelector('h3')?.textContent.trim().toLowerCase() || '';
            return type === 'a-z'
                ? textA.localeCompare(textB, 'pl', { sensitivity: 'base' })
                : textB.localeCompare(textA, 'pl', { sensitivity: 'base' });
        });
    } else if (type === 'o-n' || type === 'n-o') {
        containers.sort((a, b) => {
            const idA = parseInt(a.querySelector('.card').id);
            const idB = parseInt(b.querySelector('.card').id);
            return type === 'o-n' ? idA - idB : idB - idA;
        });
    }
    containers.forEach((container) => column.appendChild(container));
}

function applyColumnSortIfNeeded(column) {
    const select = column.querySelector('.sort-list');
    if (!select) return;
    const val = select.value;
    sortColumn(column, val);
}

function manageCardArrows(cardContainer, destinationClass) {
    const cardEl = cardContainer.querySelector('.card');
    if (!cardEl) return;

    const id = String(cardEl.id);
    const destination = document.querySelector(`.${destinationClass}`);
    const destKey = destinationClass === 'in-progress' ? 'inProgress' : destinationClass;

    const ensure = (selector, createFn, insertFn) => {
        let el = cardContainer.querySelector(selector);
        if (!el) {
            el = createFn();
            insertFn(el);
        }
        return el;
    };
    const make = (...cls) => {
        const el = document.createElement('div');
        el.classList.add(...cls);
        return el;
    };

    cardContainer.querySelectorAll('.arrow, .card-gap')
        .forEach(el => el.remove());

    if (destinationClass === 'todo') {
        cardContainer.prepend(make('card-gap'));
        cardContainer.append(make('arrow', 'arrow-right'));
    } else if (destinationClass === 'done') {
        cardContainer.prepend(make('arrow', 'arrow-left'));
        cardContainer.append(make('card-gap'));
    } else {
        cardContainer.prepend(make('arrow', 'arrow-left'));
        cardContainer.append(make('arrow', 'arrow-right'));
    }

    ['todo', 'inProgress', 'done'].forEach(k => {
        kanbanState[k].cards = kanbanState[k].cards.filter(c => String(c.id) !== id);
    });

    const title = cardEl.querySelector('h3')?.textContent || '';
    const text = cardEl.querySelector('p')?.textContent || '';
    let color = cardEl.style.backgroundColor || '';
    if (color && !color.startsWith('#')) {
        const [r, g, b] = color.match(/\d+/g).map(Number);
        color = rgbToHex(r, g, b);
    }

    kanbanState[destKey].cards.push(new Card(id, title, text, color));
    destination.appendChild(cardContainer);

    cardContainer.querySelector('.card-color')?.addEventListener('input', e => {
        setupColorChange(e.target);
    });

    applyColumnSortIfNeeded(destination);
    updateColumns();
    saveKanbanState(kanbanState);
}


function setupColumnEvents(column) {
    column.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-icon')) {
            const cardContainer = e.target.closest('.card-container');
            const id = cardContainer.querySelector('.card').id;
            const colType = getColumnType(column);
            const stateArr =
                colType === 'todo'
                    ? kanbanState.todo.cards
                    : colType === 'in-progress'
                    ? kanbanState.inProgress.cards
                    : kanbanState.done.cards;
            const idx = stateArr.findIndex((c) => String(c.id) === String(id));
            if (idx > -1) stateArr.splice(idx, 1);
            cardContainer.remove();
            updateColumns();
        }

        if (e.target.classList.contains('add-card-button')) {
            createCard(column, null, true);
            updateColumns();
        }

        if (e.target.classList.contains('sort-button')) {
            const dropdown = column.querySelector('.sort-list');
            dropdown.style.display =
                dropdown.style.display === 'inline' ? 'none' : 'inline';
        }

        if (e.target.classList.contains('arrow')) {
            const colType = getColumnType(column);
            const cardContainer = e.target.closest('.card-container');

            if (colType === 'todo' || colType === 'done') {
                manageCardArrows(cardContainer, 'in-progress');
            } else {
                if (e.target.classList.contains('arrow-left'))
                    manageCardArrows(cardContainer, 'todo');
                else manageCardArrows(cardContainer, 'done');
            }
        }
    });

    const select = column.querySelector('.sort-list');
    if (select) {
        select.addEventListener('change', (e) => {
            sortColumn(column, e.target.value);
        });
    }
}

columns.forEach(setupColumnEvents);

function setupColorChange(input) {
    function applyCardColor(color) {
        const card = input.closest('.card-container')?.querySelector('.card');
        if (!card) return;
        card.style.backgroundColor = color;
        const c = hexToRgb(color);
        card.style.color = getTextColor(c.r, c.g, c.b);
        const id = card.id;
        ['todo', 'inProgress', 'done'].forEach((k) => {
            kanbanState[k].cards.forEach((cd) => {
                if (String(cd.id) === String(id)) cd.color = color;
            });
        });
        saveKanbanState(kanbanState);
    }

    function applyColumnColor(color) {
        const column = input.closest('.column');
        if (!column) return;

        const cards = column.querySelectorAll('.card');
        cards.forEach((card) => {
            card.style.backgroundColor = color;
            const rgb = hexToRgb(color);
            card.style.color = getTextColor(rgb.r, rgb.g, rgb.b);
        });

        const type = getColumnType(column);
        const key = type === 'in-progress' ? 'inProgress' : type;
        kanbanState[key].color = color;
        kanbanState[key].cards.forEach((c) => (c.color = color));
        saveKanbanState(kanbanState);
    }

    if (input.classList.contains('card-color')) {
        input.addEventListener('input', (e) => applyCardColor(e.target.value));
        input.addEventListener('change', (e) => applyCardColor(e.target.value));
    }

    if (input.classList.contains('column-color-picker')) {
        input.addEventListener('input', (e) =>
            applyColumnColor(e.target.value)
        );
        input.addEventListener('change', (e) =>
            applyColumnColor(e.target.value)
        );
    }
}

const colorInputs = document.querySelectorAll(
    '.card-color, .column-color-picker'
);
colorInputs.forEach(setupColorChange);
