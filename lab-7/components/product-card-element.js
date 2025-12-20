import loadTemplate from '../utils/loadTemplate.js';

const templateUrl = new URL(
    '../templates/product-card-template.html',
    import.meta.url
);
const template = await loadTemplate(templateUrl);

export default class ProductCardElement extends HTMLElement {
    static get observedAttributes() {
        return ['name', 'price', 'image', 'promotion'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot
            .querySelector('button')
            .addEventListener('click', () => {
                this.dispatchEvent(
                    new CustomEvent('add-to-cart', {
                        detail: {
                            id: this.product.id,
                            name: this.product.name,
                            price: this.product.price,
                        },
                        bubbles: true,
                    })
                );
            });
    }

    set product(value) {
        this._product = value;
        this.render();
    }

    get product() {
        return this._product;
    }

    render() {
        const { name, price, image, promotion, colors, sizes } = this.product;

        this.shadowRoot.querySelector('.name').textContent = name;
        this.shadowRoot.querySelector('.price').textContent =
            price.toFixed(2) + ' zł';

        this.shadowRoot.querySelector(
            '.image'
        ).innerHTML = `<img src="${image}" alt="${name}">`;

        this.querySelectorAll('[slot="promotion"]').forEach((e) => e.remove());
        if (promotion) {
            const promo = document.createElement('span');
            promo.slot = 'promotion';
            promo.textContent = promotion;
            this.appendChild(promo);
        }

        this.renderSlottedList('colors', colors);

        this.renderSlottedList('sizes', sizes);
    }

    renderSlottedList(slotName, items) {
        this.querySelectorAll(`[slot="${slotName}"]`).forEach((e) =>
            e.remove()
        );

        items.forEach((item) => {
            const el = document.createElement('span');
            el.slot = slotName;
            el.textContent = item;
            this.appendChild(el);
        });
    }

    renderList(type, items) {
        const container = this.shadowRoot.querySelector(`.${type} .list`);
        container.innerHTML = '';
        items.forEach((item) => {
            const el = document.createElement('span');
            el.textContent = item;
            container.appendChild(el);
        });
    }
}

customElements.define('product-card', ProductCardElement);
