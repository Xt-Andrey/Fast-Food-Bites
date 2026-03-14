/*
 * login.js
 * Lógica de UI y validación para la página de login.
 * Esta página usa un modo "intro -> formulario" donde el formulario
 * solo se revela cuando el usuario pulsa "Iniciar Sesión".
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos principales
    const openLoginBtn = document.getElementById('open-login-btn');
    const loginIntro = document.querySelector('.login-intro');
    const formContainer = document.getElementById('login-form-container');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const formContents = document.querySelectorAll('.form-content');
    const successModal = document.getElementById('success-modal');
    const successBtn = successModal?.querySelector('.success-btn');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    const DEFAULT_SLEEP_MS = 1300;

    // -------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------
    init();

    function init() {
        setupTabNavigation();
        setupPasswordToggles();
        setupFormValidation();
        setupSuccessModal();
        setupOpenLoginButton();

        // Iniciar con el formulario oculto (Vista intro)
        if (formContainer) formContainer.classList.remove('active');
    }

    function setupOpenLoginButton() {
        if (!openLoginBtn) return;

        openLoginBtn.addEventListener('click', () => {
            loginIntro?.classList.add('hidden');
            formContainer?.classList.add('active');

            // Foco inicial en el campo de correo
            document.getElementById('login-email')?.focus();
        });
    }

    // -------------------------------------------------------------
    // Tabs: Login / Registro
    // -------------------------------------------------------------
    function setupTabNavigation() {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                switchTab(target);
            });
        });
    }

    function switchTab(tab = 'login') {
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
        formContents.forEach(content => content.classList.toggle('active', content.id === `${tab}-form`));
    }

    // -------------------------------------------------------------
    // Password visibility toggle
    // -------------------------------------------------------------
    function setupPasswordToggles() {
        const toggleButtons = document.querySelectorAll('.toggle-password');

        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const input = document.getElementById(targetId);
                if (!input) return;

                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';

                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            });
        });
    }

    // -------------------------------------------------------------
    // Validación de formularios
    // -------------------------------------------------------------
    function setupFormValidation() {
        [loginForm, registerForm].forEach(form => {
            if (!form) return;

            const requiredInputs = Array.from(form.querySelectorAll('input[required]'));
            const submitBtn = form.querySelector('.submit-btn');

            requiredInputs.forEach(input => {
                input.addEventListener('input', () => {
                    validateField(input);
                    updateSubmitState(form, submitBtn);
                });

                input.addEventListener('blur', () => validateField(input));
            });

            form.addEventListener('submit', event => {
                event.preventDefault();
                if (!validateForm(form)) return;

                const isLogin = form.id === 'loginForm';
                handleFormSubmit(form, isLogin);
            });

            updateSubmitState(form, submitBtn);
        });
    }

    function validateForm(form) {
        const inputs = Array.from(form.querySelectorAll('input[required]'));
        return inputs.reduce((valid, input) => validateField(input) && valid, true);
    }

    function updateSubmitState(form, submitBtn) {
        if (!submitBtn) return;
        submitBtn.disabled = !validateForm(form);
    }

    function validateField(input) {
        const value = input.value.trim();
        const feedback = input.closest('.input-group')?.querySelector('.input-feedback');
        let isValid = true;
        let message = '';

        if (!value) {
            isValid = false;
            message = 'Este campo es obligatorio';
        }

        if (isValid && input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Ingresa un correo válido';
            }
        }

        if (isValid && input.type === 'password') {
            if (input.id === 'register-password') {
                if (value.length < 8) {
                    isValid = false;
                    message = 'Mínimo 8 caracteres';
                } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(value)) {
                    isValid = false;
                    message = 'Incluye mayúsculas, minúsculas y números';
                }
            }

            if (input.id === 'register-confirm-password') {
                const password = document.getElementById('register-password')?.value || '';
                if (value !== password) {
                    isValid = false;
                    message = 'Las contraseñas no coinciden';
                }
            }
        }

        updateFieldAppearance(input, feedback, isValid, message);
        return isValid;
    }

    function updateFieldAppearance(input, feedback, isValid, message) {
        input.classList.toggle('valid', isValid);
        input.classList.toggle('invalid', !isValid);

        if (!feedback) return;

        feedback.textContent = isValid ? '✓' : message;
        feedback.classList.toggle('success', isValid);
        feedback.classList.toggle('error', !isValid);
    }

    // -------------------------------------------------------------
    // Envío de formularios (simulado)
    // -------------------------------------------------------------
    function handleFormSubmit(form, isLogin) {
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const loader = submitBtn?.querySelector('.btn-loader');

        if (submitBtn) submitBtn.disabled = true;
        if (loader) loader.style.display = 'flex';
        if (btnText) btnText.textContent = isLogin ? 'Iniciando...' : 'Registrando...';

        setTimeout(() => {
            if (submitBtn) submitBtn.disabled = false;
            if (loader) loader.style.display = 'none';
            if (btnText) btnText.textContent = isLogin ? 'Iniciar Sesión' : 'Crear Cuenta';

            const message = isLogin ? '¡Inicio de sesión exitoso!' : '¡Cuenta creada exitosamente!';
            showSuccessModal(message, isLogin);

            if (!isLogin) {
                switchTab('login');
            }

            form.reset();
            form.querySelectorAll('.input-feedback').forEach(el => el.textContent = '');
            form.querySelectorAll('input').forEach(i => i.classList.remove('valid', 'invalid'));

            if (isLogin) {
                // Regresar a la vista de inicio (intro) para simular un cierre de sesión rápido
                formContainer?.classList.remove('active');
                loginIntro?.classList.remove('hidden');
            }
        }, DEFAULT_SLEEP_MS);
    }

    // -------------------------------------------------------------
    // Modal de éxito
    // -------------------------------------------------------------
    function setupSuccessModal() {
        if (!successModal || !successBtn) return;

        successBtn.addEventListener('click', () => {
            successModal.classList.remove('show');
            loginIntro?.classList.remove('hidden');
            formContainer?.classList.remove('active');
        });
    }

    function showSuccessModal(message, isLogin = true) {
        if (!successModal) return;

        const title = successModal.querySelector('h3');
        const text = successModal.querySelector('p');

        if (title) title.textContent = message;
        if (text) text.textContent = isLogin
            ? 'Has iniciado sesión con éxito. ¡Bienvenido!'
            : 'Cuenta creada. Ahora inicia sesión para continuar.';

        successModal.classList.add('show');
    }
});
