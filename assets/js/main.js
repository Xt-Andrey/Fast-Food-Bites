// assets/js/main.js - Orquestador principal de Fast Food Bites

'use strict';

// ── DATOS ESTÁTICOS DEL MENÚ ─────────────────────────────────────────────────
const menuItems = [
    { id: 1, name: 'Hamburguesa Clásica Premium', price: 34000.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', description: 'Carne Angus, lechuga fresca, tomate orgánico y nuestra salsa secreta.', badge: 'Popular' },
    { id: 2, name: 'Papas Fritas Artesanales',    price: 12000.00, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop', description: 'Papas cortadas a mano, fritas en aceite premium con sal marina.' },
    { id: 3, name: 'Doble Queso Deluxe',          price: 48000.00, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop', description: 'Doble carne premium, queso madurado, pepinillos y aderezo especial.', badge: 'Nuevo' },
    { id: 4, name: 'Malteada Vainilla Bourbon',   price: 18000.00, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop', description: 'Malteada cremosa de vainilla con un toque de sabor a bourbon.' },
    { id: 5, name: 'Nuggets de Pollo Crujientes', price: 26000.00, image: 'https://assets.unileversolutions.com/recipes-v3/247909-default.jpg?im=AspectCrop=(625,469);Resize=(625,469)', description: 'Pollo de corral, empanizado en panko japonés. Pídelo con tu salsa favorita.' },
    { id: 6, name: 'Ensalada Premium con Pollo',  price: 38000.00, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', description: 'Ensalada fresca con pollo a la parrilla, aderezo cítrico y nueces.', badge: 'Fit' }
];

// ── ESTADO GLOBAL ─────────────────────────────────────────────────────────────
let cart = [];

// ── UTILIDADES ────────────────────────────────────────────────────────────────
const formatPrice = (price) =>
    `$${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

/**
 * Carga un fragmento HTML externo e inyecta su contenido en el contenedor indicado.
 * @param {string} selector - Selector CSS del contenedor destino.
 * @param {string} url      - Ruta al archivo HTML del fragmento.
 */
async function loadFragment(selector, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error cargando: ${url}`);
        const html = await response.text();
        const container = document.querySelector(selector);
        if (container) container.innerHTML = html;
    } catch (error) {
        console.error('loadFragment error:', error);
    }
}

/**
 * Inyecta una hoja de estilos en el <head> si todavía no existe.
 * @param {string} href - Ruta al archivo CSS.
 */
function loadStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// ── CARGA DE FRAGMENTOS Y CSS DE COMPONENTES ─────────────────────────────────
async function loadAllFragments() {
    // CSS propios de cada componente
    loadStylesheet('components/header/header.css');
    loadStylesheet('components/sidebar/sidebar.css');
    loadStylesheet('components/footer/footer.css');

    // Fragmentos HTML
    await loadFragment('#header-placeholder',  'components/header/header.html');
    await loadFragment('#sidebar-placeholder', 'components/sidebar/sidebar.html');
    await loadFragment('#footer-placeholder',  'components/footer/footer.html');

    // Inicializar módulos JS de cada componente (definidos en sus .js)
    if (typeof initHeader  === 'function') initHeader();
    if (typeof initSidebar === 'function') initSidebar();

    // Año dinámico en el footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ── CARRUSEL ─────────────────────────────────────────────────────────────────
let currentSlide  = 0;
const totalSlides = 2;
let slideInterval;

function moveToSlide(index) {
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    currentSlide = index;
    const sliderTrack = document.getElementById('slider-track');
    if (sliderTrack) sliderTrack.style.transform = `translateX(${-index * 50}%)`;
    document.querySelectorAll('#slider-dots .dot')
        .forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function startSlider() {
    if (document.getElementById('slider-track')) {
        slideInterval = setInterval(() => moveToSlide(currentSlide + 1), 4000);
    }
}

// ── PARTÍCULAS DEL HERO ───────────────────────────────────────────────────────
function createParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
            animation-duration: ${Math.random() * 10 + 10}s;
        `;
        heroParticles.appendChild(p);
    }
}

// ── FETCH + RENDERIZADO DE PRODUCTOS CON <template> ───────────────────────────
async function fetchProducts() {
    try {
        const response = await fetch('data/productos.json');
        if (!response.ok) throw new Error('Error cargando productos.json');
        await response.json(); // datos del JSON disponibles para extender
        return menuItems;      // usamos menuItems que ya tienen imágenes y badges
    } catch (err) {
        console.warn('Usando datos estáticos (fetch falló):', err);
        return menuItems;
    }
}

function renderMenu(products) {
    const productsGrid    = document.getElementById('products-grid');
    const productTemplate = document.getElementById('product-template');
    if (!productsGrid || !productTemplate) return;

    productsGrid.innerHTML = '';

    products.forEach(item => {
        const clone = productTemplate.content.cloneNode(true);

        const img         = clone.querySelector('.product-img');
        const badge       = clone.querySelector('.product-badge');
        const name        = clone.querySelector('.product-name');
        const description = clone.querySelector('.product-description');
        const price       = clone.querySelector('.product-price');
        const addBtn      = clone.querySelector('.add-to-cart-btn');

        if (img)         { img.src = item.image; img.alt = item.name; }
        if (badge)       { badge.textContent = item.badge || ''; badge.style.display = item.badge ? '' : 'none'; }
        if (name)        name.textContent = item.name;
        if (description) description.textContent = item.description;
        if (price)       price.textContent = formatPrice(item.price);
        if (addBtn)      addBtn.dataset.id = item.id;

        productsGrid.appendChild(clone);
    });
}

// ── LÓGICA DEL CARRITO ────────────────────────────────────────────────────────
function addToCart(productId) {
    const product      = menuItems.find(item => item.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (!product) return;
    if (existingItem) existingItem.quantity++;
    else cart.push({ ...product, quantity: 1 });
    renderCart();
}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function changeQuantity(productId, type) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    if (type === 'increase') item.quantity++;
    else if (type === 'decrease') { item.quantity--; if (item.quantity <= 0) { removeItem(productId); return; } }
    renderCart();
}

function renderCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    if (!cartItemsList) return;

    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>`;
    } else {
        cartItemsList.innerHTML = '';
        cart.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <span>${formatPrice(item.price)} × ${item.quantity}</span>
                </div>
                <div class="quantity-controls">
                    <button class="decrease-quantity" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>`;
            cartItemsList.appendChild(div);
        });
    }

    updateCartTotals();
}

function updateCartTotals() {
    const subtotal   = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping   = cart.length > 0 ? 9000 : 0;
    const total      = subtotal + shipping;
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

    if (typeof updateSidebarTotals   === 'function') updateSidebarTotals(subtotal, shipping, total);
    if (typeof updateHeaderCartCount === 'function') updateHeaderCartCount(totalItems);
}

// ── MODALES ───────────────────────────────────────────────────────────────────
function openCart()           { if (typeof openSidebar  === 'function') openSidebar(); }
function closeCart()          { if (typeof closeSidebar === 'function') closeSidebar(); }

function openUserModal() {
    const m = document.querySelector('user-modal-component');
    const o = document.getElementById('overlay');
    if (m) m.open();
    if (o) o.classList.add('visible');
    document.body.style.overflow = 'hidden';
}
function closeUserModal() {
    const m = document.querySelector('user-modal-component');
    const o = document.getElementById('overlay');
    if (m) m.close();
    if (o) o.classList.remove('visible');
    document.body.style.overflow = 'auto';
}
function openSuggestionModal() {
    const m = document.querySelector('suggestion-modal-component');
    const o = document.getElementById('overlay');
    if (m) m.open();
    if (o) o.classList.add('visible');
    document.body.style.overflow = 'hidden';
}
function closeSuggestionModal() {
    const m = document.querySelector('suggestion-modal-component');
    const o = document.getElementById('overlay');
    if (m) m.close();
    if (o) o.classList.remove('visible');
    document.body.style.overflow = 'auto';
}
function closeAllModals() { closeCart(); closeUserModal(); closeSuggestionModal(); }

// ── PROMOCIONES ───────────────────────────────────────────────────────────────
function handlePromoClick(e) {
    const btn = e.target.closest('.promo-btn');
    if (!btn) return;
    const promoId = parseInt(btn.dataset.promoId);
    if (btn.textContent.includes('Ver Oferta')) {
        if (promoId === 1) alert('🍔 Doble Martes de Burger\n\nCompra una Hamburguesa, la segunda a mitad de precio. ¡Exclusivo online!');
        if (promoId === 2) alert('🍟 Combo Familiar Deluxe\n\n4 Hamburguesas + Papas familiares + 2 Malteadas. Precio: $145,000.');
    } else if (btn.textContent.includes('Pedir Ahora') && promoId === 2) {
        [1, 1, 1, 1, 2, 4, 4].forEach(id => addToCart(id));
        alert('✅ Combo Familiar Deluxe agregado al carrito. ¡A disfrutar!');
        openCart();
    }
}

// ── CUSTOM EVENTS (comunicación entre módulos de componentes) ─────────────────
function setupCustomEventListeners() {
    document.addEventListener('app:open-cart',             () => openCart());
    document.addEventListener('app:close-cart',            () => closeCart());
    document.addEventListener('app:open-user-modal',       () => openUserModal());
    document.addEventListener('app:open-suggestion-modal', () => openSuggestionModal());
    document.addEventListener('app:checkout',              () => handleCheckout());
    document.addEventListener('app:remove-cart-item',      (e) => removeItem(e.detail.productId));
    document.addEventListener('app:change-quantity',       (e) => changeQuantity(e.detail.productId, e.detail.type));
}

function handleCheckout() {
    if (cart.length > 0) {
        const total = cart.reduce((s, i) => s + i.price * i.quantity, 0) + 9000;
        alert(`🎉 ¡Pedido confirmado!\n\nTotal: ${formatPrice(total)}\n\n✨ Gracias por elegir Fast Food Bites!`);
        cart = [];
        renderCart();
        closeCart();
    } else {
        alert('Tu carrito está vacío. ¡Explora nuestro menú exclusivo!');
    }
}

// ── INICIALIZACIÓN ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Fast Food Bites — Inicializando...');

    setupCustomEventListeners();
    await loadAllFragments();
    createParticles();
    startSlider();

    const products = await fetchProducts();
    renderMenu(products);
    renderCart();

    // Dots del carrusel
    const sliderDots = document.getElementById('slider-dots');
    if (sliderDots) {
        sliderDots.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                clearInterval(slideInterval);
                moveToSlide(parseInt(e.target.dataset.slide));
                startSlider();
            }
        });
    }

    // Overlay
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeAllModals);

    // Grilla de productos
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (!btn) return;
            const id = parseInt(btn.dataset.id);
            if (!Number.isNaN(id)) addToCart(id);
        });
    }

    // Slider de promociones
    const promotionsSlider = document.querySelector('.promotions-slider');
    if (promotionsSlider) promotionsSlider.addEventListener('click', handlePromoClick);

    console.log('Aplicación lista ✅');
});
