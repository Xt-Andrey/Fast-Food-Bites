if (!sessionStorage.getItem('loggedIn')) {
    window.location.href = 'login.html';
}

// Variables globales
var allProducts = [];
var currentFilter = 'todos';

async function loadFragment(id, filePath) {
    try {
        var response = await fetch(filePath);
        if (!response.ok) throw new Error('No se pudo cargar: ' + filePath);
        var html = await response.text();
        document.getElementById(id).innerHTML = html;
    } catch (error) {
        console.error('Error cargando fragmento:', error);
    }
}

/**
 * Carga todos los fragmentos de la aplicacion.
 */
async function loadAllFragments() {
    await Promise.all([
        loadFragment('header-container', 'components/header/header.html'),
        loadFragment('footer-container', 'components/footer/footer.html'),
        loadFragment('sidebar-container', 'components/sidebar/sidebar.html')
    ]);

    initHeader();
    initSidebar();
}

// 2. CARGA DE PRODUCTOS DESDE JSON

async function loadProducts() {
    showLoadingState();
    try {
        var response = await fetch('./data/productos.json');
        if (!response.ok) throw new Error('Error al cargar productos.json');
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error cargando productos:', error);
        document.getElementById('products-container').innerHTML =
            '<p style="color:#dc3545; text-align:center;">Error al cargar los productos.</p>';
    }
}

function showLoadingState() {
    var container = document.getElementById('products-container');
    if (container) {
        container.innerHTML =
            '<div class="loading-spinner" style="grid-column:1/-1;">' +
            '<div class="spinner"></div><p>Cargando menu...</p></div>';
    }
}

// 3. RENDERIZADO CON PLANTILLAS

function renderProducts(products) {
    var container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#777;">No hay productos en esta categoria.</p>';
        return;
    }

    products.forEach(function (product, index) {
        if (index < 3) {
            renderWithTemplate(product, container);
        } else {
            renderWithWebComponent(product, container);
        }
    });
}

function renderWithTemplate(product, container) {
    var template = document.getElementById('product-template');
    if (!template) return;

    var clone = template.content.cloneNode(true);

    clone.querySelector('[data-field="image"]').src = product.imagen;
    clone.querySelector('[data-field="image"]').alt = product.nombre;
    clone.querySelector('[data-field="name"]').textContent = product.nombre;
    clone.querySelector('[data-field="description"]').textContent = product.descripcion;
    clone.querySelector('[data-field="price"]').textContent = formatPrice(product.precio);

    var badge = clone.querySelector('.product-badge');
    if (badge) {
        badge.style.display = product.popular ? 'inline-block' : 'none';
    }

    var addBtn = clone.querySelector('.product-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function () { addToCart(product); });
    }

    container.appendChild(clone);
}

function renderWithWebComponent(product, container) {
    var card = document.createElement('product-card');
    card.setAttribute('product-id', product.id);
    card.setAttribute('name', product.nombre);
    card.setAttribute('price', product.precio);
    card.setAttribute('description', product.descripcion);
    card.setAttribute('image', product.imagen);
    card.setAttribute('popular', product.popular);

    card.addEventListener('addToCart', function (e) {
        addToCart(e.detail);
    });

    container.appendChild(card);
}

// 4. FILTRADO DE PRODUCTOS POR CATEGORIA

function filterProducts(filter) {
    currentFilter = filter;
    var filtered = filter === 'todos'
        ? allProducts
        : allProducts.filter(function (p) { return p.categoria === filter; });
    renderProducts(filtered);
}

function initFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            filterProducts(btn.dataset.filter);
        });
    });

    document.addEventListener('filterProducts', function (e) {
        var filter = e.detail.filter;
        filterProducts(filter);
        filterBtns.forEach(function (b) {
            b.classList.toggle('active', b.dataset.filter === filter);
        });
    });
}

// 5. FORMULARIO DE CONTACTO

function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = document.getElementById('contactName').value.trim();
        var email = document.getElementById('contactEmail').value.trim();
        var subject = document.getElementById('contactSubject').value.trim() || 'Mensaje desde Fast Food Bites';
        var message = document.getElementById('contactMessage').value.trim();

        var body = 'Nombre: ' + name + '\nCorreo: ' + email + '\n\n' + message;
        var mailtoLink = 'mailto:andreygalvis6002@gmail.com'
            + '?subject=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(body);

        window.location.href = mailtoLink;
        showToast('Abriendo cliente de correo...');
        form.reset();
    });
}

// 6. UTILIDADES

function formatPrice(value) {
    return '$' + value.toLocaleString('es-CO');
}

function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
        requestAnimationFrame(function () { toast.classList.add('show'); });
    });

    setTimeout(function () {
        toast.classList.remove('show');
        setTimeout(function () { toast.remove(); }, 400);
    }, 3000);
}

// INICIALIZACION
document.addEventListener('DOMContentLoaded', async function () {
    await loadAllFragments();
    await loadProducts();
    initFilters();
    initContactForm();
});
