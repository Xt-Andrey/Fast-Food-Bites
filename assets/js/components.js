// components.js - Web Components con Shadow DOM para Fast Food Bites

// Shared styles & helpers
const COMPONENT_SHARED_STYLE = `
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
@import url('../assets/css/style.css');
`;

function createComponentTemplate(innerHtml, extraCss = '') {
    return `
        <style>
            ${COMPONENT_SHARED_STYLE}
            ${extraCss}
        </style>
        ${innerHtml}
    `;
}

const MODAL_SHARED_STYLES = `
    .user-modal, .suggestion-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1002;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .user-modal.open, .suggestion-modal.open {
        opacity: 1;
        visibility: visible;
    }

    .user-modal-content {
        background: white;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }

    .user-modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .user-modal-header h3 {
        margin: 0;
        color: #333;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    }

    .tab-button {
        flex: 1;
        padding: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.3s ease;
    }

    .tab-button.active {
        background: #ff6b35;
        color: white;
    }

    .tab-content {
        padding: 1.5rem;
    }

    .tab-content.hidden {
        display: none;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-group label {
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    .form-group input {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
    }

    .form-group textarea {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
        resize: vertical;
    }

    .submit-btn {
        background: #ff6b35;
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.3s ease;
    }

    .submit-btn:hover {
        background: #e55a2b;
    }

    .submit-btn.full-width {
        width: 100%;
    }

    .forgot-password {
        text-align: center;
        margin-top: 1rem;
        color: #666;
        text-decoration: none;
    }

    .forgot-password:hover {
        color: #ff6b35;
    }
`;

// Componente Header
class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = createComponentTemplate(`
            <nav class="navbar">
                <div class="navbar-glass">
                    <div class="logo">
                        <div class="logo-icon">
                            <i class="fas fa-fire-flame-curved"></i>
                        </div>
                        <span>Fast Food <strong>Bites</strong></span>
                    </div>
                    <div class="nav-links">
                        <a href="#products-grid">Menú</a>
                        <a href="#about-us">Nosotros</a>
                        <a href="#contact-us">Contacto</a>
                        <button class="suggestion-button" id="open-suggestion-btn">
                            <i class="fas fa-comment-dots"></i>
                            <span>Sugerencias</span>
                        </button>
                        <button class="login-button" id="open-login-btn-desktop">
                            <i class="fas fa-user-circle"></i>
                            <span>Iniciar Sesión</span>
                        </button>
                    </div>
                    <div class="cart-btn-wrapper">
                        <button class="cart-button suggestion-button-mobile" id="open-suggestion-btn-mobile">
                            <i class="fas fa-comment-dots"></i>
                        </button>
                        <button class="cart-button login-button-mobile" id="open-login-btn-mobile">
                            <i class="fas fa-user-circle"></i>
                            <span>Acceso</span>
                        </button>
                        <button class="cart-button" id="open-cart-btn">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Carrito</span>
                            <span id="cart-count">0</span>
                        </button>
                    </div>
                </div>
            </nav>
        `, `
            nav.navbar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                padding: 1rem 0;
                transition: all 0.3s ease;
            }

            .navbar-glass {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 2rem;
            }

            .logo {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 1.5rem;
                font-weight: bold;
                color: #ff6b35;
            }

            .logo-icon {
                color: #ff6b35;
            }

            .nav-links {
                display: flex;
                gap: 2rem;
                align-items: center;
            }

            .nav-links a {
                text-decoration: none;
                color: #333;
                font-weight: 500;
                transition: color 0.3s ease;
            }

            .nav-links a:hover {
                color: #ff6b35;
            }

            .suggestion-button, .login-button {
                background: none;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #333;
                font-weight: 500;
                transition: color 0.3s ease;
            }

            .suggestion-button:hover, .login-button:hover {
                color: #ff6b35;
            }

            .cart-btn-wrapper {
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            .cart-button {
                background: #ff6b35;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 25px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .cart-button:hover {
                background: #e55a2b;
                transform: translateY(-2px);
            }

            .suggestion-button-mobile, .login-button-mobile {
                display: none;
            }

            @media (max-width: 768px) {
                .nav-links {
                    display: none;
                }

                .suggestion-button-mobile, .login-button-mobile {
                    display: flex;
                }
            }
        `);
    }

                nav.navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 1rem 0;
                    transition: all 0.3s ease;
                }

                .navbar-glass {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 2rem;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #ff6b35;
                }

                .logo-icon {
                    color: #ff6b35;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }

                .nav-links a {
                    text-decoration: none;
                    color: #333;
                    font-weight: 500;
                    transition: color 0.3s ease;
                }

                .nav-links a:hover {
                    color: #ff6b35;
                }

                .suggestion-button, .login-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #333;
                    font-weight: 500;
                    transition: color 0.3s ease;
                }

                .suggestion-button:hover, .login-button:hover {
                    color: #ff6b35;
                }

                .cart-btn-wrapper {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .cart-button {
                    background: #ff6b35;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 25px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .cart-button:hover {
                    background: #e55a2b;
                    transform: translateY(-2px);
                }

                .suggestion-button-mobile, .login-button-mobile {
                    display: none;
                }

                @media (max-width: 768px) {
                    .nav-links {
                        display: none;
                    }

                    .suggestion-button-mobile, .login-button-mobile {
                        display: flex;
                    }
                }
            </style>
            <nav class="navbar">
                <div class="navbar-glass">
                    <div class="logo">
                        <div class="logo-icon">
                            <i class="fas fa-fire-flame-curved"></i>
                        </div>
                        <span>Fast Food <strong>Bites</strong></span>
                    </div>
                    <div class="nav-links">
                        <a href="#products-grid">Menú</a>
                        <a href="#about-us">Nosotros</a>
                        <a href="#contact-us">Contacto</a>
                        <button class="suggestion-button" id="open-suggestion-btn">
                            <i class="fas fa-comment-dots"></i>
                            <span>Sugerencias</span>
                        </button>
                        <button class="login-button" id="open-login-btn-desktop">
                            <i class="fas fa-user-circle"></i>
                            <span>Iniciar Sesión</span>
                        </button>
                    </div>
                    <div class="cart-btn-wrapper">
                        <button class="cart-button suggestion-button-mobile" id="open-suggestion-btn-mobile">
                            <i class="fas fa-comment-dots"></i>
                        </button>
                        <button class="cart-button login-button-mobile" id="open-login-btn-mobile">
                            <i class="fas fa-user-circle"></i>
                            <span>Acceso</span>
                        </button>
                        <button class="cart-button" id="open-cart-btn">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Carrito</span>
                            <span id="cart-count">0</span>
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }

    connectedCallback() {
        // Event listeners para los botones
        const openSuggestionBtn = this.shadowRoot.getElementById('open-suggestion-btn');
        const openSuggestionBtnMobile = this.shadowRoot.getElementById('open-suggestion-btn-mobile');
        const openLoginBtnDesktop = this.shadowRoot.getElementById('open-login-btn-desktop');
        const openLoginBtnMobile = this.shadowRoot.getElementById('open-login-btn-mobile');
        const openCartBtn = this.shadowRoot.getElementById('open-cart-btn');

        if (openSuggestionBtn) openSuggestionBtn.addEventListener('click', () => this.dispatchEvent(new CustomEvent('open-suggestion-modal')));
        if (openSuggestionBtnMobile) openSuggestionBtnMobile.addEventListener('click', () => this.dispatchEvent(new CustomEvent('open-suggestion-modal')));
        if (openLoginBtnDesktop) openLoginBtnDesktop.addEventListener('click', () => this.dispatchEvent(new CustomEvent('open-user-modal')));
        if (openLoginBtnMobile) openLoginBtnMobile.addEventListener('click', () => this.dispatchEvent(new CustomEvent('open-user-modal')));
        if (openCartBtn) openCartBtn.addEventListener('click', () => this.dispatchEvent(new CustomEvent('open-cart')));
    }
}

// Componente Sidebar (Cart)
class SidebarComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = createComponentTemplate(`
            <aside class="cart-sidebar" id="cart-sidebar">
                <div class="cart-header">
                    <h2><i class="fas fa-shopping-basket"></i> Tu Pedido</h2>
                    <button class="close-btn" id="close-cart-btn">×</button>
                </div>

                <div class="cart-items-list" id="cart-items-list">
                    <div class="empty-cart-message">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Tu carrito está vacío</p>
                    </div>
                </div>

                <div class="cart-summary">
                    <p><span>Subtotal:</span> <span id="cart-subtotal">$0.00</span></p>
                    <p><span>Envío:</span> <span id="cart-shipping-price">$9,000.00</span></p>
                    <h3><span>Total:</span> <span id="cart-total">$9,000.00</span></h3>
                    <button class="checkout-btn" id="checkout-btn">
                        <i class="fas fa-check-circle"></i> Finalizar Pedido
                    </button>
                </div>
            </aside>
        `, `
            .cart-sidebar {
                position: fixed;
                top: 0;
                right: -400px;
                width: 400px;
                height: 100vh;
                background: white;
                box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                z-index: 1001;
                transition: right 0.3s ease;
                display: flex;
                flex-direction: column;
            }

            .cart-sidebar.open {
                right: 0;
            }

            .cart-header {
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .cart-header h2 {
                margin: 0;
                color: #333;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            }

            .cart-items-list {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
            }

            .empty-cart-message {
                text-align: center;
                color: #666;
                padding: 2rem;
            }

            .empty-cart-message i {
                font-size: 3rem;
                margin-bottom: 1rem;
                display: block;
            }

            .cart-summary {
                border-top: 1px solid #eee;
                padding: 1rem;
            }

            .cart-summary p {
                display: flex;
                justify-content: space-between;
                margin: 0.5rem 0;
            }

            .cart-summary h3 {
                display: flex;
                justify-content: space-between;
                margin: 1rem 0;
                font-size: 1.2rem;
            }

            .checkout-btn {
                width: 100%;
                background: #ff6b35;
                color: white;
                border: none;
                padding: 1rem;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: background 0.3s ease;
            }

            .checkout-btn:hover {
                background: #e55a2b;
            }
        `);
    }

    connectedCallback() {
        const closeCartBtn = this.shadowRoot.getElementById('close-cart-btn');
        const checkoutBtn = this.shadowRoot.getElementById('checkout-btn');

        if (closeCartBtn) closeCartBtn.addEventListener('click', () => this.dispatchEvent(new CustomEvent('close-cart')));
        if (checkoutBtn) checkoutBtn.addEventListener('click', () => this.dispatchEvent(new CustomEvent('checkout')));
    }
}

// Componente Footer
class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = createComponentTemplate(`
            <footer class="footer">
                <div class="footer-columns-wrapper">
                    <div class="footer-column">
                        <h4>Categorías</h4>
                        <ul>
                            <li><a href="#products-grid">Hamburguesas Insignia</a></li>
                            <li><a href="#products-grid">Parrilla & Creaciones</a></li>
                            <li><a href="#products-grid">Ensaladas & Fit</a></li>
                            <li><a href="#products-grid">Postres & Bebidas</a></li>
                            <li><a href="#products-grid">Acompañamientos</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h4>Sobre Fast Food Bites</h4>
                        <ul>
                            <li><a href="#about-us">Quiénes Somos</a></li>
                            <li><a href="#">Sostenibilidad</a></li>
                            <li><a href="#">Eventos</a></li>
                            <li><a href="#contact-us">Contáctanos (PQRS)</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h4>Legales</h4>
                        <ul>
                            <li><a href="#">Política de tratamiento de datos</a></li>
                            <li><a href="#">Términos y Condiciones de la página web</a></li>
                            <li><a href="#">Términos y Condiciones de Compañías</a></li>
                            <li><a href="#">Gestión de cookies</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom-bar">
                     <div class="logo-footer">Fast Food <strong>Bites</strong></div>
                    <p>&copy; <span id="current-year">2025</span> Fast Food Bites. Todos los derechos registrados.</p>
                    <p class="tech-info">Desarrollado con HTML, CSS y JavaScript.</p>
                </div>
            </footer>
        `;
    }

    connectedCallback() {
        const currentYear = this.shadowRoot.getElementById('current-year');
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }
}

// Componente User Modal
class UserModalComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = createComponentTemplate(`
            <div class="user-modal" id="user-modal">
                <div class="user-modal-content">
                    <div class="user-modal-header">
                        <h3><i class="fas fa-lock"></i> Acceso de Usuario</h3>
                        <button class="close-btn" id="close-user-modal">×</button>
                    </div>

                    <div class="user-tabs">
                        <button class="tab-button active" data-tab="login">Iniciar Sesión</button>
                        <button class="tab-button" data-tab="register">Registrarme</button>
                    </div>

                    <div class="tab-content" id="login-form-tab">
                        <form id="login-form" class="auth-form">
                            <div class="form-group">
                                <label for="login-email">Correo Electrónico</label>
                                <input type="email" id="login-email" required placeholder="tu.email@ejemplo.com">
                            </div>
                            <div class="form-group">
                                <label for="login-password">Contraseña</label>
                                <input type="password" id="login-password" required placeholder="Ingresa tu contraseña">
                            </div>
                            <button type="submit" class="submit-btn full-width">Acceder</button>
                            <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
                        </form>
                    </div>

                    <div class="tab-content hidden" id="register-form-tab">
                        <form id="register-form" class="auth-form">
                            <div class="form-group">
                                <label for="register-name">Nombre Completo</label>
                                <input type="text" id="register-name" required placeholder="Tu nombre y apellido">
                            </div>
                            <div class="form-group">
                                <label for="register-email">Correo Electrónico</label>
                                <input type="email" id="register-email" required placeholder="tu.email@ejemplo.com">
                            </div>
                            <div class="form-group">
                                <label for="register-password">Contraseña</label>
                                <input type="password" id="register-password" required placeholder="Mínimo 6 caracteres">
                            </div>
                            <button type="submit" class="submit-btn full-width">Crear Cuenta</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        const closeBtn = this.shadowRoot.getElementById('close-user-modal');
        const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');
        const loginForm = this.shadowRoot.getElementById('login-form');
        const registerForm = this.shadowRoot.getElementById('register-form');

        if (closeBtn) closeBtn.addEventListener('click', () => this.dispatchEvent(new CustomEvent('close-user-modal')));

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    switchTab(tab) {
        const loginTab = this.shadowRoot.getElementById('login-form-tab');
        const registerTab = this.shadowRoot.getElementById('register-form-tab');
        const tabButtons = this.shadowRoot.querySelectorAll('.tab-button');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        loginTab.classList.add('hidden');
        registerTab.classList.add('hidden');

        if (tab === 'login') {
            loginTab.classList.remove('hidden');
            this.shadowRoot.querySelector('[data-tab="login"]').classList.add('active');
        } else {
            registerTab.classList.remove('hidden');
            this.shadowRoot.querySelector('[data-tab="register"]').classList.add('active');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const email = this.shadowRoot.getElementById('login-email').value;
        alert(`¡Bienvenido! Has iniciado sesión como: ${email}`);
        this.dispatchEvent(new CustomEvent('close-user-modal'));
        e.target.reset();
    }

    handleRegister(e) {
        e.preventDefault();
        const name = this.shadowRoot.getElementById('register-name').value;
        const email = this.shadowRoot.getElementById('register-email').value;
        alert(`¡Registro Exitoso! Bienvenido/a, ${name}. Por favor, inicia sesión con tu correo: ${email}`);
        this.switchTab('login');
        e.target.reset();
    }

    open() {
        this.shadowRoot.getElementById('user-modal').classList.add('open');
    }

    close() {
        this.shadowRoot.getElementById('user-modal').classList.remove('open');
    }
}

// Componente Suggestion Modal
class SuggestionModalComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = createComponentTemplate(`
            <div class="suggestion-modal" id="suggestion-modal">
                <div class="user-modal-content">
                    <div class="user-modal-header">
                        <h3><i class="fas fa-lightbulb"></i> Envía tu Sugerencia</h3>
                        <button class="close-btn" id="close-suggestion-modal">×</button>
                    </div>

                    <form id="suggestion-form" class="auth-form">
                        <div class="form-group">
                            <label for="suggestion-email">Correo Electrónico</label>
                            <input type="email" id="suggestion-email" required placeholder="tu.email@ejemplo.com">
                        </div>
                        <div class="form-group">
                            <label for="suggestion-subject">Asunto</label>
                            <input type="text" id="suggestion-subject" required placeholder="Ej. Nuevo producto, error en app...">
                        </div>
                        <div class="form-group">
                            <label for="suggestion-message">Mensaje</label>
                            <textarea id="suggestion-message" rows="5" required placeholder="Detalla tu sugerencia aquí..."></textarea>
                        </div>
                        <button type="submit" class="submit-btn full-width">Enviar Sugerencia</button>
                    </form>
                </div>
            </div>
        `, MODAL_SHARED_STYLES);
    }

    connectedCallback() {
        const closeBtn = this.shadowRoot.getElementById('close-suggestion-modal');
        const form = this.shadowRoot.getElementById('suggestion-form');

        if (closeBtn) closeBtn.addEventListener('click', () => this.dispatchEvent(new CustomEvent('close-suggestion-modal')));
        if (form) form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        const email = this.shadowRoot.getElementById('suggestion-email').value;
        const subject = this.shadowRoot.getElementById('suggestion-subject').value;
        const message = this.shadowRoot.getElementById('suggestion-message').value;

        alert(`✅ Sugerencia Recibida!\n\nDe: ${email}\nAsunto: ${subject}\n\nGracias por ayudarnos a mejorar.`);
        this.dispatchEvent(new CustomEvent('close-suggestion-modal'));
        e.target.reset();
    }

    open() {
        this.shadowRoot.getElementById('suggestion-modal').classList.add('open');
    }

    close() {
        this.shadowRoot.getElementById('suggestion-modal').classList.remove('open');
    }
}

// Registrar los componentes
customElements.define('header-component', HeaderComponent);
customElements.define('sidebar-component', SidebarComponent);
customElements.define('footer-component', FooterComponent);
customElements.define('user-modal-component', UserModalComponent);
customElements.define('suggestion-modal-component', SuggestionModalComponent);