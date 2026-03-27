// components/header/header.js
// Lógica específica del encabezado: eventos de botones y contador del carrito

/**
 * Inicializa los event listeners del header una vez que ha sido
 * cargado dinámicamente en el DOM por main.js.
 */
function initHeader() {
    const openSuggestionBtn       = document.getElementById('open-suggestion-btn');
    const openSuggestionBtnMobile = document.getElementById('open-suggestion-btn-mobile');
    const openLoginBtnDesktop     = document.getElementById('open-login-btn-desktop');
    const openLoginBtnMobile      = document.getElementById('open-login-btn-mobile');
    const openCartBtn             = document.getElementById('open-cart-btn');

    // Abrir modal de sugerencias
    if (openSuggestionBtn) {
        openSuggestionBtn.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('app:open-suggestion-modal'));
        });
    }
    if (openSuggestionBtnMobile) {
        openSuggestionBtnMobile.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('app:open-suggestion-modal'));
        });
    }

    // Abrir modal de usuario / login
    if (openLoginBtnDesktop) {
        openLoginBtnDesktop.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('app:open-user-modal'));
        });
    }
    if (openLoginBtnMobile) {
        openLoginBtnMobile.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('app:open-user-modal'));
        });
    }

    // Abrir carrito
    if (openCartBtn) {
        openCartBtn.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('app:open-cart'));
        });
    }
}

/**
 * Actualiza el número visible en el badge del carrito.
 * @param {number} count - Total de ítems en el carrito.
 */
function updateHeaderCartCount(count) {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = count;

        // Pequeña animación de pulso al actualizar
        cartCount.style.animation = 'none';
        requestAnimationFrame(() => {
            cartCount.style.animation = 'pulse 0.4s ease';
        });
    }
}
