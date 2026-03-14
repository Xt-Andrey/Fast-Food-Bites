// main.js - Archivo principal de JavaScript para Fast Food Bites con Web Components

// --- DATOS DEL MENÚ ---
const menuItems = [
    { id: 1, name: 'Hamburguesa Clásica Premium', price: 34000.00, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', description: 'Carne Angus, lechuga fresca, tomate orgánico y nuestra salsa secreta.', badge: 'Popular' },
    { id: 2, name: 'Papas Fritas Artesanales', price: 12000.00, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop', description: 'Papas cortadas a mano, fritas en aceite premium con sal marina.' },
    { id: 3, name: 'Doble Queso Deluxe', price: 48000.00, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop', description: 'Doble carne premium, queso madurado, pepinillos y aderezo especial.', badge: 'Nuevo' },
    { id: 4, name: 'Malteada Vainilla Bourbon', price: 18000.00, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop', description: 'Malteada cremosa de vainilla con un toque de sabor a bourbon.' },
    { id: 5, name: 'Nuggets de Pollo Crujientes ', price: 26000.00, image: 'https://assets.unileversolutions.com/recipes-v3/247909-default.jpg?im=AspectCrop=(625,469);Resize=(625,469)', description: 'Pollo de corral, empanizado en panko japonés. Pídelo con tu salsa favorita.' },
    { id: 6, name: 'Ensalada Premium con Pollo', price: 38000.00, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', description: 'Ensalada fresca con pollo a la parrilla, aderezo cítrico y nueces.', badge: 'Fit' }
];

// --- ESTADO GLOBAL ---
let cart = [];

// --- CONSTANTES ---
const productsGrid = document.getElementById('products-grid');
const overlay = document.getElementById('overlay');

// --- LÓGICA DEL CARRUSEL ---
const sliderTrack = document.getElementById('slider-track');
const sliderDots = document.getElementById('slider-dots');
let currentSlide = 0;
const totalSlides = 2;
let slideInterval;

function moveToSlide(index) {
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;

    currentSlide = index;
    const offset = -index * 50;
    if (sliderTrack) {
        sliderTrack.style.transform = `translateX(${offset}%)`;
    }

    if (sliderDots) {
        const dots = sliderDots.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
}

function startSlider() {
    if (sliderTrack) {
        slideInterval = setInterval(() => {
            moveToSlide(currentSlide + 1);
        }, 4000);
    }
}

function handleDotClick(e) {
    if (e.target.classList.contains('dot')) {
        clearInterval(slideInterval);
        const slideIndex = parseInt(e.target.dataset.slide);
        moveToSlide(slideIndex);
        startSlider();
    }
}

// --- UTILIDADES ---
function createParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    for(let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heroParticles.appendChild(particle);
    }
}

const formatPrice = (price) => `$${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// --- LÓGICA DEL MENÚ ---
function renderMenu() {
    productsGrid.innerHTML = '';
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                ${item.badge ? `<div class="product-badge">${item.badge}</div>` : ''}
                <div class="product-glow"></div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${item.name}</h3>
                <p class="product-description">${item.description}</p>
                <div class="product-footer">
                    <div class="product-price">${formatPrice(item.price)}</div>
                    <button class="add-to-cart-btn" data-id="${item.id}">
                        <span>Añadir</span>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// --- LÓGICA DEL CARRITO ---
function renderCart() {
    const sidebar = document.querySelector('sidebar-component');
    if (!sidebar) return;

    const cartItemsList = sidebar.shadowRoot.getElementById('cart-items-list');
    if (!cartItemsList) return;

    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'cart-item';
            listItem.innerHTML = `
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
                </button>
            `;
            cartItemsList.appendChild(listItem);
        });
    }

    updateCartTotals();
}

function addToCart(productId) {
    const product = menuItems.find(item => item.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    updateCartCount();
}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function changeQuantity(productId, type) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    if (type === 'increase') {
        item.quantity++;
    } else if (type === 'decrease') {
        item.quantity--;
        if (item.quantity <= 0) {
            removeItem(productId);
            return;
        }
    }
    renderCart();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 9000.00 : 0.00;
    const total = subtotal + shipping;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const sidebar = document.querySelector('sidebar-component');
    if (sidebar) {
        const cartSubtotal = sidebar.shadowRoot.getElementById('cart-subtotal');
        const cartShipping = sidebar.shadowRoot.getElementById('cart-shipping-price');
        const cartTotal = sidebar.shadowRoot.getElementById('cart-total');

        if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);
        if (cartShipping) cartShipping.textContent = formatPrice(shipping);
        if (cartTotal) cartTotal.textContent = formatPrice(total);
    }

    updateCartCount();
}

function updateCartCount() {
    const header = document.querySelector('header-component');
    if (header) {
        const cartCount = header.shadowRoot.getElementById('cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
}

// --- LÓGICA DE PROMOCIONES ---
function handlePromoClick(e) {
    const btn = e.target.closest('.promo-btn');
    if (!btn) return;

    const promoId = parseInt(btn.dataset.promoId);

    if (btn.textContent.includes('Ver Oferta')) {
        if (promoId === 1) {
            alert('Detalle de la Promoción:\n\n🍔 Doble Martes de Burger\n\n¡Compra una Hamburguesa Clásica Premium, la segunda a mitad de precio! Aplicable a la de menor valor. Exclusivo para pedidos online. ¡Aprovecha la oferta!');
        } else if (promoId === 2) {
            alert('Detalle de la Promoción:\n\n🍟 Combo Familiar Deluxe\n\nIncluye: 4 Hamburguesas Clásicas Premium, 1 Porción de Papas Fritas Artesanales (tamaño familiar) y 2 Malteadas Vainilla Bourbon. Precio total: $145,000. ¡Disfruta en familia!');
        }
    } else if (btn.textContent.includes('Pedir Ahora')) {
        if (promoId === 2) {
            addToCart(1);
            addToCart(1);
            addToCart(1);
            addToCart(1);
            addToCart(2);
            addToCart(4);
            addToCart(4);
            alert('✅ Combo Familiar Deluxe agregado al carrito. ¡A disfrutar!');
            openCart();
        }
    }
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fast Food Bites - Inicializando aplicación...');

    // Inicializar componentes
    createParticles();
    startSlider();
    renderMenu();

    // Event listeners
    setupEventListeners();

    console.log('Aplicación inicializada correctamente.');
});

// --- CONFIGURACIÓN DE EVENT LISTENERS ---
function setupEventListeners() {
    // Dots del slider
    if (sliderDots) {
        sliderDots.addEventListener('click', handleDotClick);
    }

    // Overlay
    if (overlay) {
        overlay.addEventListener('click', closeAllModals);
    }

    // Productos
    if (productsGrid) {
        productsGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart-btn');
            if (!btn) return;

            const productId = parseInt(btn.dataset.id);
            if (Number.isNaN(productId)) return;

            addToCart(productId);
        });
    }

    // Promociones
    const promoButtons = document.querySelectorAll('.promo-btn');
    promoButtons.forEach(btn => {
        btn.addEventListener('click', handlePromoClick);
    });

    // Componentes
    const header = document.querySelector('header-component');
    const sidebar = document.querySelector('sidebar-component');
    const userModal = document.querySelector('user-modal-component');
    const suggestionModal = document.querySelector('suggestion-modal-component');

    if (header) {
        header.addEventListener('open-suggestion-modal', () => openSuggestionModal());
        header.addEventListener('open-user-modal', () => openUserModal());
        header.addEventListener('open-cart', () => openCart());
    }

    if (sidebar) {
        sidebar.addEventListener('close-cart', () => closeCart());
        sidebar.addEventListener('checkout', () => alert('Funcionalidad de checkout en desarrollo'));
    }

    if (userModal) {
        userModal.addEventListener('close-user-modal', () => closeUserModal());
    }

    if (suggestionModal) {
        suggestionModal.addEventListener('close-suggestion-modal', () => closeSuggestionModal());
    }

    // Delegación para carrito
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('decrease-quantity')) {
            const productId = parseInt(e.target.dataset.id);
            changeQuantity(productId, 'decrease');
        } else if (e.target.classList.contains('increase-quantity')) {
            const productId = parseInt(e.target.dataset.id);
            changeQuantity(productId, 'increase');
        } else if (e.target.classList.contains('remove-item-btn')) {
            const productId = parseInt(e.target.dataset.id);
            removeItem(productId);
        }
    });
}

// --- FUNCIONES DE MODALES ---
function openCart() {
    const sidebar = document.querySelector('sidebar-component');
    if (sidebar) {
        sidebar.shadowRoot.getElementById('cart-sidebar').classList.add('open');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const sidebar = document.querySelector('sidebar-component');
    if (sidebar) {
        sidebar.shadowRoot.getElementById('cart-sidebar').classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }
}

function openUserModal() {
    const userModal = document.querySelector('user-modal-component');
    if (userModal) {
        userModal.open();
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
}

function closeUserModal() {
    const userModal = document.querySelector('user-modal-component');
    if (userModal) {
        userModal.close();
        overlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }
}

function openSuggestionModal() {
    const suggestionModal = document.querySelector('suggestion-modal-component');
    if (suggestionModal) {
        suggestionModal.open();
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
}

function closeSuggestionModal() {
    const suggestionModal = document.querySelector('suggestion-modal-component');
    if (suggestionModal) {
        suggestionModal.close();
        overlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    closeCart();
    closeUserModal();
    closeSuggestionModal();
}