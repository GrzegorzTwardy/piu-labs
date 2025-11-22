import { store } from './store.js';

const shapesContainer = document.getElementById('shapes');
const countCircles = document.getElementById('countCircles');
const countSquares = document.getElementById('countSquares');

export function initUI() {
    store.subscribe(render);
    shapesContainer.addEventListener('click', onShapeClick);
}

function onShapeClick(e) {
    const id = e.target.dataset.id;
    if (id) {
        store.removeShape(id);
        const el = document.querySelector(`[data-id="${id}"]`);
        if (el) el.remove();
    }
}

function render(state) {
    const counts = store.getCounts();
    countCircles.textContent = counts.circles;
    countSquares.textContent = counts.squares;

    const existingIds = new Set(
        [...shapesContainer.children].map((c) => c.dataset.id)
    );

    state.shapes.forEach((shape) => {
        if (!existingIds.has(shape.id)) {
            const el = document.createElement('div');
            el.classList.add('shape', shape.type);
            el.style.backgroundColor = shape.color;
            el.dataset.id = shape.id;
            shapesContainer.appendChild(el);
        } else {
            const el = document.querySelector(`[data-id="${shape.id}"]`);
            if (el) el.style.backgroundColor = shape.color;
        }
    });
}