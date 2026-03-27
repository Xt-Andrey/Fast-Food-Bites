# 🍔 Fast Food Bites — Aplicación Web Modularizada

> Proyecto académico desarrollado para la asignatura de Desarrollo Web.  
> Tipo de negocio: **Restaurante de comida rápida premium**.  
> Colores principales: naranja (#ff6b35), blanco y negro.

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
│   │   └── style.css            ← Estilos globales compartidos
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

### Fragmentos (Fragments)
Son porciones de HTML separadas en archivos externos que se cargan dinámicamente con JavaScript usando `fetch()`. En este proyecto, el **header**, el **footer** y el **sidebar** son fragmentos independientes que se inyectan en la página principal al cargar.

**Beneficio:** Cambiar el footer en un solo archivo actualiza todas las páginas que lo usen.

### Plantillas (`<template>`)
El elemento HTML `<template>` define estructuras reutilizables que el navegador no renderiza directamente. JavaScript las clona con `templateElement.content.cloneNode(true)` y rellena los datos antes de insertarlas en el DOM.

**Uso en este proyecto:** Cada tarjeta de producto se genera clonando el `<template id="product-template">` del `index.html`.

### Web Components
Son elementos HTML personalizados que encapsulan su estructura, estilos y comportamiento usando el estándar de la plataforma web (Custom Elements API + Shadow DOM). No dependen de ningún framework.

**Uso en este proyecto:** `<header-component>`, `<footer-component>`, `<sidebar-component>`, `<user-modal-component>` y `<suggestion-modal-component>` están definidos en `assets/js/components.js` con Shadow DOM activado.

---

## 🔐 Formulario de Inicio de Sesión

El archivo `login.html` + `assets/js/login.js` implementa un sistema de autenticación simulada:

- Validación en tiempo real de campos (email, contraseña, confirmación).
- Indicadores visuales de error/éxito por campo.
- Toggle de visibilidad de contraseña.
- Redirección simulada a `index.html` tras login exitoso.
- Credenciales de prueba: `usuario@test.com` / `Abcd1234`

> ⚠️ **Aviso educativo:** Las credenciales están escritas directamente en el código JavaScript únicamente con fines de aprendizaje. Este enfoque **no es seguro** para aplicaciones en producción. En un entorno real, la autenticación debe realizarse en el servidor con contraseñas cifradas y sesiones seguras.

---

## ✅ Buenas Prácticas Aplicadas

| Práctica | Ejemplo |
|----------|---------|
| **camelCase** en JS | `addToCart`, `renderMenu`, `updateCartTotals` |
| **kebab-case** en CSS | `.product-card`, `.cart-sidebar`, `.hero-particles` |
| **Separación de responsabilidades** | Un archivo por módulo (login.js, main.js, components.js) |
| **Comentarios** | Secciones documentadas con `//` y bloques `/* */` |
| **Indentación consistente** | 4 espacios en todo el proyecto |
| **Delegación de eventos** | Un solo listener en el contenedor padre (no uno por botón) |
| **async/await** | Carga de fragmentos y fetch de JSON asíncronos |

---

## 🚀 Cómo ejecutar el proyecto

```bash
# Opción 1: Live Server (recomendado, necesario para fetch())
# Instalar extensión "Live Server" en VS Code → clic derecho en index.html → Open with Live Server

# Opción 2: http-server global
npm install -g http-server
http-server .
# Luego abrir http://localhost:8080
```

> **Nota:** El proyecto usa `fetch()` para cargar fragmentos y el JSON de productos, por lo que **no funciona abriendo el archivo directamente** (`file://`). Se necesita un servidor local.

---

## 👥 Colaboración en GitHub

El repositorio debe evidenciar trabajo en equipo mediante:
- Commits descriptivos de ambos integrantes.
- Uso de ramas (`feature/login`, `feature/components`, etc.).
- Pull Requests con revisión antes de fusionar a `main`.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** — Estructura semántica, elemento `<template>`, Custom Elements
- **CSS3** — Flexbox, Grid, animaciones, variables CSS, diseño responsivo
- **JavaScript (ES6+)** — Módulos, async/await, fetch API, Shadow DOM, CustomEvents
