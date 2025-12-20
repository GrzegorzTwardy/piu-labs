import productsData from '../data/data.json' with { type: 'json' };
import './product-card-element.js';

export default class ProductList extends HTMLElement {
    constructor() {
        super();
        this.products = productsData;
    }

    connectedCallback() {
        this.classList.add('products');
        this.render();
    }

    render() {
        this.innerHTML = '';
        this.products.forEach((product) => {
            const card = document.createElement('product-card');
            card.product = product;
            this.appendChild(card);
        });
    }
}

customElements.define('product-list', ProductList);
