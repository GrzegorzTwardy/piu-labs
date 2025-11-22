import { store } from './store.js';
import { initUI } from './ui.js';
import { randomColor } from './helpers.js';

const addCircle = document.getElementById('addCircle');
const addSquare = document.getElementById('addSquare');
const recolorSquares = document.getElementById('recolorSquares');
const recolorCircles = document.getElementById('recolorCircles');

function uuid() {
    return Math.random().toString(36).substr(2, 9);
}

addCircle.addEventListener('click', () => {
    store.addShape({ id: uuid(), type: 'circle', color: randomColor() });
});

addSquare.addEventListener('click', () => {
    store.addShape({ id: uuid(), type: 'square', color: randomColor() });
});

recolorCircles.addEventListener('click', () => {
    store.recolorShapeType(randomColor, 'circle');
});

recolorSquares.addEventListener('click', () => {
    store.recolorShapeType(randomColor, 'square');
});

initUI();
