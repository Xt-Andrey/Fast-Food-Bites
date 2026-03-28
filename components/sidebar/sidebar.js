// Estado del carrito
var cartItems = [];

/**
 * Inicializa los eventos del carrito.
 */
function initSidebar() {
    var closeSidebarBtn = document.getElementById('closeSidebarBtn');
    var sidebarOverlay  = document.getElementById('sidebarOverlay');
    var clearCartBtn    = document.getElementById('clearCartBtn');
    var orderBtn        = document.getElementById('orderBtn');

    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeCart);
    if (sidebarOverlay)  sidebarOverlay.addEventListener('click', closeCart);

    document.addEventListener('toggleCart', toggleCart);

    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

    if (orderBtn) {
        orderBtn.addEventListener('click', function () {
            showToast('Pedido enviado! En camino en 30 minutos.');
            clearCart();
            closeCart();
        });
    }

    // Filtros del sidebar nav
    var navLinks = document.querySelectorAll('.sidebar-nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
            var filter = link.dataset.filter;
            document.dispatchEvent(new CustomEvent('filterProducts', { detail: { filter: filter } }));
            closeCart();
        });
    });
}

/** Abre o cierra el carrito */
function toggleCart() {
    var sidebar = document.getElementById('cartSidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
}

/** Cierra el carrito */
function closeCart() {
    var sidebar = document.getElementById('cartSidebar');
    var overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

/**
 * Agrega un producto al carrito.
 * @param {Object} product 
 */
function addToCart(product) {
    var existing = cartItems.find(function (item) { return item.id === product.id; });
    if (existing) {
        existing.cantidad++;
    } else {
        cartItems.push(Object.assign({}, product, { cantidad: 1 }));
    }
    renderCart();
    updateCartBadge();
    showToast(product.nombre + ' agregado al carrito.');
}

/** Cambia la cantidad de un item (+1 o -1) */
function changeQty(productId, delta) {
    var item = cartItems.find(function (i) { return i.id === productId; });
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
        cartItems = cartItems.filter(function (i) { return i.id !== productId; });
    }
    renderCart();
    updateCartBadge();
}

/** Vacia el carrito */
function clearCart() {
    cartItems = [];
    renderCart();
    updateCartBadge();
}

/** Renderiza los items del carrito en el DOM */
function renderCart() {
    var cartList    = document.getElementById('cartList');
    var cartEmpty   = document.getElementById('cartEmpty');
    var cartSummary = document.getElementById('cartSummary');

    if (!cartList) return;

    if (cartItems.length === 0) {
        cartList.innerHTML = '';
        if (cartEmpty)   cartEmpty.style.display   = 'flex';
        if (cartSummary) cartSummary.style.display  = 'none';
        return;
    }

    if (cartEmpty)   cartEmpty.style.display   = 'none';
    if (cartSummary) cartSummary.style.display  = 'block';

    cartList.innerHTML = cartItems.map(function (item) {
        return '<li class="cart-item">' +
            '<img src="' + item.imagen + '" alt="' + item.nombre + '" class="cart-item-img">' +
            '<div class="cart-item-info">' +
                '<p class="cart-item-name">' + item.nombre + '</p>' +
                '<p class="cart-item-price">' + formatPrice(item.precio * item.cantidad) + '</p>' +
            '</div>' +
            '<div class="cart-item-controls">' +
                '<button class="qty-btn" onclick="changeQty(' + item.id + ', -1)">&minus;</button>' +
                '<span class="cart-item-qty">' + item.cantidad + '</span>' +
                '<button class="qty-btn" onclick="changeQty(' + item.id + ', +1)">+</button>' +
            '</div>' +
        '</li>';
    }).join('');

    updateCartTotals();
}

/** Calcula y muestra los totales del carrito */
function updateCartTotals() {
    var subtotal = cartItems.reduce(function (sum, item) {
        return sum + (item.precio * item.cantidad);
    }, 0);
    var total = subtotal + 3500;
    var cartSubtotal = document.getElementById('cartSubtotal');
    var cartTotal    = document.getElementById('cartTotal');
    if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);
    if (cartTotal)    cartTotal.textContent    = formatPrice(total);
}

/** Actualiza el badge del carrito en el header */
function updateCartBadge() {
    var badge = document.getElementById('cartBadge');
    if (badge) {
        var totalItems = cartItems.reduce(function (sum, item) {
            return sum + item.cantidad;
        }, 0);
        badge.textContent = totalItems;
    }
}

/** Formatea precio */
function formatPrice(value) {
    return '$' + value.toLocaleString('es-CO');
}

/** Muestra una notificacion */
function showToast(message) {
    var toast = document.getElementById('appToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'appToast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3000);
}
