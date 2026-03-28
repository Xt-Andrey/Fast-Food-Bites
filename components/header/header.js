//Logica de botones y eventos del header (encabezado)

function initHeader() {
    // Boton de logout
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('loggedIn');
            window.location.href = 'login.html';
        });
    }

    // Boton del carrito
    var toggleCartBtn = document.getElementById('toggleCartBtn');
    if (toggleCartBtn) {
        toggleCartBtn.addEventListener('click', function () {
            document.dispatchEvent(new CustomEvent('toggleCart'));
        });
    }

    // Navegacion suave entre secciones
    var navLinks = document.querySelectorAll('.nav-link[data-section]');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var sectionId = link.getAttribute('data-section');
            var target = document.getElementById(sectionId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
        });
    });

    // Actualizar enlace activo segun scroll
    window.addEventListener('scroll', function () {
        var sections = ['menu', 'nosotros', 'contacto'];
        var scrollPos = window.scrollY + 100;
        sections.forEach(function (id) {
            var section = document.getElementById(id);
            if (section) {
                if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                    navLinks.forEach(function (l) { l.classList.remove('active'); });
                    var activeLink = document.querySelector('.nav-link[data-section="' + id + '"]');
                    if (activeLink) activeLink.classList.add('active');
                }
            }
        });
    });
}
