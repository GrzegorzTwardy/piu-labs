class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        // Pobierz template z osobnego pliku
        const res = await fetch('./product-card.template.html');
        const templateText = await res.text();

        const template = document.createElement('template');
        template.innerHTML = templateText;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('product-card', ProductCard);
