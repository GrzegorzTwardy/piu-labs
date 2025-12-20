import loadTemplate from '../utils/loadTemplate.js';

const templateUrl = new URL(
    '../templates/product-card-template.html',
    import.meta.url
);

const template = await loadTemplate(templateUrl);

export default class ProductCardElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('product-card', ProductCardElement);
