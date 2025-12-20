import './components/product-list.js';
import './components/cart-element.js';

const header = document.querySelector('.site-header');
const toggleBtn = document.getElementById('toggle-cart');
const cart = document.querySelector('cart-element');
const toast = document.querySelector('.cart-toast');

let toastTimeout;

toggleBtn.addEventListener('click', () => {
    header.classList.toggle('open');
});

document.addEventListener('add-to-cart', (e) => {
    cart.addItem(e.detail);
    showToast();
});

function showToast() {
    clearTimeout(toastTimeout);

    toast.hidden = false;

    toastTimeout = setTimeout(() => {
        toast.hidden = true;
    }, 1800);
}
