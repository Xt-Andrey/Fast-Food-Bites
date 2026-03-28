class ProductCard extends HTMLElement {
    // Atributos observados para reaccionar a cambios
    static get observedAttributes() {
        return ['name', 'price', 'description', 'image', 'popular', 'product-id'];
    }

    constructor() {
        super();
        // Activar Shadow DOM (encapsulación)
        this.attachShadow({ mode: 'open' });
    }

    // Se llama cuando el componente se inserta en el DOM
    connectedCallback() {
        this.render();
    }

    // Se llama cuando un atributo observado cambia
    attributeChangedCallback() {
        this.render();
    }

    /** Renderiza la tarjeta de producto dentro del Shadow DOM */
    render() {
        const name = this.getAttribute('name') || 'Producto';
        const price = parseInt(this.getAttribute('price')) || 0;
        const description = this.getAttribute('description') || '';
        const image = this.getAttribute('image') || '';
        const popular = this.getAttribute('popular') === 'true';
        const productId = parseInt(this.getAttribute('product-id')) || 0;

        // Los estilos están encapsulados: no afectan ni son afectados por el documento
        this.shadowRoot.innerHTML = `
            <style>
                /* Estilos encapsulados del Web Component */
                :host {
                    display: block;
                }

                .wc-card {
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    cursor: pointer;
                    font-family: 'Poppins', sans-serif;
                }

                .wc-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 35px rgba(255,107,53,0.2);
                }

                .wc-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: #ff6b35;
                    color: white;
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 3px 10px;
                    border-radius: 50px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    z-index: 2;
                }

                .wc-img-wrapper {
                    position: relative;
                    height: 180px;
                    overflow: hidden;
                    background: #f5f5f5;
                }

                .wc-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.4s ease;
                }

                .wc-card:hover .wc-img {
                    transform: scale(1.08);
                }

                .wc-body {
                    padding: 1.1rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .wc-name {
                    font-family: 'Oswald', sans-serif;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1a1a1a;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin: 0;
                }

                .wc-desc {
                    font-size: 0.8rem;
                    color: #777;
                    line-height: 1.5;
                    flex: 1;
                    margin: 0;
                }

                .wc-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.9rem 1.1rem;
                    border-top: 1px solid #f5f5f5;
                }

                .wc-price {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #ff6b35;
                    font-family: 'Oswald', sans-serif;
                }

                .wc-add-btn {
                    background: #ff6b35;
                    color: white;
                    border: none;
                    padding: 0.55rem 1.1rem;
                    border-radius: 8px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    font-family: 'Poppins', sans-serif;
                }

                .wc-add-btn:hover {
                    background: #e55a26;
                    transform: scale(1.05);
                }

                .wc-add-btn:active {
                    transform: scale(0.97);
                }
            </style>

            <!-- Estructura de la tarjeta -->
            <article class="wc-card">
                ${popular ? '<span class="wc-badge">Popular</span>' : ''}
                
                <div class="wc-img-wrapper">
                    <img src="${image}" alt="${name}" class="wc-img" loading="lazy">
                </div>

                <div class="wc-body">
                    <h3 class="wc-name">${name}</h3>
                    <p class="wc-desc">${description}</p>
                </div>

                <div class="wc-footer">
                    <span class="wc-price">${this.formatPrice(price)}</span>
                    <button class="wc-add-btn" id="addBtn">+ Agregar</button>
                </div>
            </article>
        `;

        // Adjuntar evento al botón dentro del Shadow DOM
        const addBtn = this.shadowRoot.getElementById('addBtn');
        addBtn.addEventListener('click', () => {
            // Emite evento personalizado con datos del producto al documento principal
            this.dispatchEvent(new CustomEvent('addToCart', {
                bubbles: true,   // Sube por el DOM
                composed: true,  // Cruza el límite del Shadow DOM
                detail: {
                    id: productId,
                    nombre: name,
                    precio: price,
                    descripcion: description,
                    imagen: image,
                    popular: popular
                }
            }));
        });
    }

    /** Formatea precio en pesos colombianos */
    formatPrice(value) {
        return '$' + value.toLocaleString('es-CO');
    }
}

// Registrar el elemento personalizado en el navegador
customElements.define('product-card', ProductCard);
