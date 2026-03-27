// components/sidebar/sidebar.js
// Lógica específica del panel lateral del carrito de compras

/**
 * Inicializa los event listeners del sidebar una vez que ha sido
 * cargado dinámicamente en el DOM por main.js.
 */
function initSidebar() {
    const closeCartBtn = document.getElementById('close-cart-btn');
    const checkoutBtn  = document.getElementById('checkout-btn');

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('app:close-cart'));
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('app:checkout'));
        });
    }

    // Delegación de eventos para controles de cantidad y eliminación de ítems
    const cartItemsList = document.getElementById('cart-items-list');
    if (cartItemsList) {
        cartItemsList.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const productId = parseInt(button.dataset.id);
            if (Number.isNaN(productId)) return;

            if (button.classList.contains('remove-item-btn')) {
                document.dispatchEvent(new CustomEvent('app:remove-cart-item', { detail: { productId } }));
            } else if (button.classList.contains('increase-quantity')) {
                document.dispatchEvent(new CustomEvent('app:change-quantity', { detail: { productId, type: 'increase' } }));
            } else if (button.classList.contains('decrease-quantity')) {
                document.dispatchEvent(new CustomEvent('app:change-quantity', { detail: { productId, type: 'decrease' } }));
            }
        });
    }
}

/**
 * Abre el panel lateral del carrito.
 */
function openSidebar() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay     = document.getElementById('overlay');
    if (cartSidebar) cartSidebar.classList.add('open');
    if (overlay)     overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el panel lateral del carrito.
 */
function closeSidebar() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay     = document.getElementById('overlay');
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (overlay)     overlay.classList.remove('visible');
    document.body.style.overflow = 'auto';
}

/**
 * Actualiza los totales mostrados en el resumen del carrito.
 * @param {number} subtotal
 * @param {number} shipping
 * @param {number} total
 */
function updateSidebarTotals(subtotal, shipping, total) {
    const formatPrice = (p) => `$${p.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

    const cartSubtotal     = document.getElementById('cart-subtotal');
    const cartShipping     = document.getElementById('cart-shipping-price');
    const cartTotal        = document.getElementById('cart-total');

    if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);
    if (cartShipping) cartShipping.textContent = formatPrice(shipping);
    if (cartTotal)    cartTotal.textContent    = formatPrice(total);
}
