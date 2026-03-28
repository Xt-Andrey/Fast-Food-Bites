# 🍔 Fast Food Bites — Aplicación Web Modularizada  
El proyecto consiste en el desarrollo de una aplicación web de comida rápida llamada Fast Food Bites, cuyo objetivo es ofrecer a los usuarios una plataforma intuitiva donde puedan iniciar sesión y acceder a un menú digital. A través de esta aplicación, se busca aplicar conceptos fundamentales del desarrollo web como la estructura con HTML, el diseño con CSS y la lógica con JavaScript, incluyendo validación de formularios y gestión de sesiones. Además, el sistema simula un entorno real de autenticación para mejorar la experiencia del usuario y fortalecer las buenas prácticas de programación.

> Tipo de negocio: **Restaurante de comida rápida**.  
> Colores principales: naranja `#ff6b35`, blanco y negro.

---

## 📂 Estructura del Proyecto

```
Fast-Food-Bites/
├── index.html                   ← Página principal modular
├── login.html                   ← Página de inicio de sesión
├── README.md
│
├── components/                  ← Fragmentos reutilizables (cargados con fetch)
│   ├── header/
│   │   ├── header.html          ← Fragmento HTML del encabezado
│   │   ├── header.css           ← Estilos exclusivos del header
│   │   └── header.js            ← Lógica de botones del navbar
│   ├── footer/
│   │   ├── footer.html          ← Fragmento HTML del pie de página
│   │   └── footer.css           ← Estilos exclusivos del footer
│   └── sidebar/
│       ├── sidebar.html         ← Fragmento HTML del carrito lateral
│       ├── sidebar.css          ← Estilos exclusivos del sidebar
│       └── sidebar.js           ← Lógica de controles del carrito
│
├── assets/
│   ├── css/
│   │   └── style.css         ← Estilos globales compartidos
|   |   └── login.css         ← Estilos exclusivos del login
│   └── js/
│       ├── components.js        ← Web Components con Shadow DOM
│       ├── main.js              ← Orquestador principal (fetch, templates, carrito)
│       └── login.js             ← Lógica de validación del formulario de login
│
└── data/
    └── productos.json           ← Datos externos de productos (cargados con fetch)
```

---

## 📖 Conceptos de Modularización Implementados

### ¿Qué es la Modularización?
La modularización consiste en dividir una aplicación en piezas independientes y reutilizables, donde cada módulo tiene una responsabilidad única. Esto facilita el mantenimiento, la escalabilidad y la colaboración en equipo.

**Ventajas principales:**
- **Mantenibilidad:** Un cambio en el footer se aplica en toda la app.
- **Reutilización:** El mismo componente puede usarse en varias páginas.
- **Colaboración:** Diferentes miembros del equipo pueden trabajar en módulos distintos sin conflictos.
- **Legibilidad:** Código organizado y fácil de entender.

---

### 🧩 Fragmentos (Fragments)
Son porciones de HTML separadas en archivos externos que se cargan dinámicamente con JavaScript usando `fetch()`. En este proyecto, el **header**, el **footer** y el **sidebar** son fragmentos independientes que se inyectan en la página principal al cargar.

**Implementación:**
```javascript
async function loadFragment(selector, filePath) {
    const response = await fetch(filePath);
    const html = await response.text();
    document.getElementById(selector).innerHTML = html;
}

// Se cargan los 3 fragmentos de forma concurrente
await Promise.all([
    loadFragment('header-container', 'components/header/header.html'),
    loadFragment('footer-container', 'components/footer/footer.html'),
    loadFragment('sidebar-container', 'components/sidebar/sidebar.html'),
]);
```

**Beneficio:** Cambiar el footer en un solo archivo actualiza todas las páginas que lo usen.

---

### 🧾 Plantillas (`<template>`)
El elemento HTML `<template>` define estructuras reutilizables que el navegador **no renderiza directamente**. JavaScript las clona con `templateElement.content.cloneNode(true)` y rellena los datos antes de insertarlas en el DOM.

**Uso en este proyecto:** Los primeros 3 productos se generan clonando el `<template id="product-template">` del `index.html`.

```javascript
const template = document.getElementById('product-template');
const clone = template.content.cloneNode(true);

// Rellenar datos
clone.querySelector('[data-field="name"]').textContent = product.nombre;
clone.querySelector('[data-field="price"]').textContent = formatPrice(product.precio);

container.appendChild(clone);
```

---

### 🌐 Web Components
Son elementos HTML personalizados que encapsulan su estructura, estilos y comportamiento usando el estándar de la plataforma web (**Custom Elements API + Shadow DOM**). No dependen de ningún framework.

**Uso en este proyecto:** El componente `<product-card>` está definido en `assets/js/components.js` con Shadow DOM activado. Los productos del índice 3 en adelante se renderizan con este componente.

```javascript
class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Shadow DOM activado
    }
    
    connectedCallback() {
        this.render(); // Se ejecuta al insertar en el DOM
    }
}

// Registro del elemento personalizado
customElements.define('product-card', ProductCard);
```

**Uso en el HTML:**
```html
<product-card
    name="Classic Burger"
    price="18900"
    description="Carne angus 200g..."
    image="imagen.jpg"
    popular="true">
</product-card>
```

**El Shadow DOM** encapsula los estilos del componente, evitando que afecten o sean afectados por el resto del documento.

---

## 🔐 Formulario de Inicio de Sesión

El archivo `login.html` + `assets/js/login.js` implementa un sistema de autenticación simulada:

- Validación en tiempo real de campos (email, contraseña).
- Indicadores visuales de error/éxito por campo (clases CSS dinámicas).
- Toggle de visibilidad de contraseña.
- Redirección a `index.html` tras login exitoso con `sessionStorage`.
- Credenciales de prueba: `usuario@test.com` / `Abcd1234`

```javascript
if (emailValue === VALID_EMAIL && passwordValue === VALID_PASSWORD) {
    sessionStorage.setItem('loggedIn', 'true');
    window.location.href = 'index.html';
} else {
    showError('Correo o contraseña incorrectos. Intenta de nuevo.');
}
```

---

## ✅ Buenas Prácticas Aplicadas

| Práctica | Ejemplo |
|----------|---------|
| **camelCase** en JS | `addToCart`, `renderProducts`, `updateCartTotals` |
| **kebab-case** en CSS | `.product-card-wrapper`, `.cart-sidebar`, `.hero-banner` |
| **Separación de responsabilidades** | Un archivo por módulo: `login.js`, `main.js`, `components.js` |
| **Comentarios** | Secciones documentadas con `//` y bloques `/* */` |
| **Indentación consistente** | 4 espacios en todo el proyecto |
| **Delegación de eventos** | Evento `addToCart` personalizado desde el Web Component |
| **async/await** | Carga de fragmentos y fetch de JSON asíncronos con manejo de errores |
| **CustomEvents** | Comunicación entre módulos sin acoplamiento directo |

---

## 🚀 Cómo ejecutar el proyecto

```bash
# Opción 1: Live Server (recomendado)
# Instalar extensión "Live Server" en VS Code → clic derecho en index.html → Open with Live Server

# Opción 2: http-server global
npm install -g http-server
http-server .
# Luego abrir http://localhost:8080
```

> **Nota:** El proyecto usa `fetch()` para cargar fragmentos y el JSON de productos, por lo que **no funciona abriendo el archivo directamente** (`file://`). Se necesita un servidor local.

---

## 👥 Colaboración en GitHub

El repositorio evidencia trabajo en equipo mediante:
- Commits descriptivos de ambos integrantes.
- Uso de ramas (`feature/login`, `feature/components`, `feature/web-components`).
- Pull Requests con revisión antes de fusionar a `main`.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** — Estructura semántica, elemento `<template>`, Custom Elements
- **CSS3** — Flexbox, Grid, animaciones, variables CSS, diseño responsivo
- **JavaScript (ES6+)** — Módulos, async/await, fetch API, Shadow DOM, CustomEvents

---

## 👨‍💻 Integrantes del Grupo

| Nombre | codigo |
|--------|-----|
| RUBIEL ANDREY GALVIS GALVIS | 192483 |
| ARNOLD CLARO | 192 |
