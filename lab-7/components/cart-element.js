export default class CartElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.items = [];
    }

    connectedCallback() {
        this.render();
    }

    addItem(product) {
        this.items.push(product);
        this.render();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.render();
    }

    render() {
        const total = this.items.reduce((sum, i) => sum + i.price, 0);

        this.shadowRoot.innerHTML = this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: block;
              height: 100%;
            }

            .cart {
              display: flex;
              flex-direction: column;
              max-height: 240px;
            }

            h2 {
              margin: 0 0 8px;
              font-size: 1.1rem;
            }

            ul {
              list-style: none;
              padding: 0;
              margin: 0;
              overflow-y: auto;
              flex: 1;
            }

            li {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 6px;
              font-size: 0.9rem;
            }

            .price {
              white-space: nowrap;
            }

            button {
              margin-left: 6px;
              border: none;
              background: #eee;
              border-radius: 6px;
              padding: 2px 8px;
              cursor: pointer;
              transition: 0.15s;
            }

            button:hover {
              background: #d6d6d6;
            }

            .total {
              border-top: 1px solid #eee;
              margin-top: 8px;
              padding-top: 8px;
              padding-bottom: 10px;
              font-weight: bold;
              text-align: right;
            }
          </style>

          <div class="cart">
            <h2>Koszyk</h2>

            <ul>
              ${this.items
                  .map(
                      (item, i) => `
                <li>
                  <span>${item.name}</span>
                  <span class="price">
                    ${item.price.toFixed(2)} zł
                    <button data-i="${i}" aria-label="Usuń">✕</button>
                  </span>
                </li>
              `
                  )
                  .join('')}
            </ul>

            <div class="total">
              Suma: ${total.toFixed(2)} zł
            </div>
          </div>
          `;

        this.shadowRoot
            .querySelectorAll('button')
            .forEach((btn) =>
                btn.addEventListener('click', (e) =>
                    this.removeItem(e.target.dataset.i)
                )
            );
    }
}

customElements.define('cart-element', CartElement);
