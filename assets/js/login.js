const VALID_EMAIL = 'usuario@gmail.com';
const VALID_PASSWORD = 'contraseña123';

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const loginError = document.getElementById('loginError');
    const submitBtn = document.getElementById('submitBtn');

    //  Mostrar contraseña
    togglePasswordBtn.addEventListener('click', () => {
        const hidden = passwordInput.type === 'password';
        passwordInput.type = hidden ? 'text' : 'password';
        togglePasswordBtn.textContent = hidden ? '🙈' : '👁️';
    });

    //  Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        submitBtn.textContent = 'Verificando...';
        submitBtn.disabled = true;

        setTimeout(() => {

            if (email === VALID_EMAIL && password === VALID_PASSWORD) {

                sessionStorage.setItem('loggedIn', 'true');
                sessionStorage.setItem('userEmail', email);

                window.location.href = 'index.html';

            } else {

                loginError.style.display = 'block';
                loginError.querySelector('span').textContent = 'Correo o contraseña incorrectos';

                submitBtn.textContent = 'Iniciar sesión';
                submitBtn.disabled = false;

                passwordInput.value = '';
            }

        }, 700);
    });

});

(function () {

    /**
     * Valida el campo de email con una expresión regular.
     * @returns {boolean} true si el email es válido
     */
    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValue = emailInput.value.trim();

        if (emailValue === '') {
            setFieldState(emailInput, 'empty');
            return false;
        }

        if (!emailRegex.test(emailValue)) {
            setFieldState(emailInput, 'error');
            setFieldMessage(emailInput, 'Ingresa un correo electrónico válido');
            return false;
        }

        setFieldState(emailInput, 'success');
        return true;
    }

    /**
     * Valida que la contraseña no esté vacía y tenga mínimo 6 caracteres.
     * @returns {boolean} true si la contraseña es válida
     */
    function validatePassword() {
        const passwordValue = passwordInput.value;

        if (passwordValue === '') {
            setFieldState(passwordInput, 'empty');
            return false;
        }

        if (passwordValue.length < 6) {
            setFieldState(passwordInput, 'error');
            setFieldMessage(passwordInput, 'La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        setFieldState(passwordInput, 'success');
        return true;
    }

    /**
     * Aplica estados visuales al campo.
     * @param {HTMLElement} input
     * @param {string} state 
     */
    function setFieldState(input, state) {
        const wrapper = input.closest('.form-field');
        if (!wrapper) return;
        wrapper.classList.remove('field-error', 'field-success');
        if (state === 'error') wrapper.classList.add('field-error');
        if (state === 'success') wrapper.classList.add('field-success');

        // Ocultar error general cuando el usuario corrige
        if (state !== 'error') {
            hideError();
        }
    }

    /**
     * Muestra un mensaje de error debajo del campo.
     * @param {HTMLElement} input
     * @param {string} message
     */
    function setFieldMessage(input, message) {
        const wrapper = input.closest('.form-field');
        if (!wrapper) return;
        let msg = wrapper.querySelector('.field-msg');
        if (!msg) {
            msg = document.createElement('span');
            msg.className = 'field-msg';
            wrapper.appendChild(msg);
        }
        msg.textContent = message;
    }

    /** Muestra el error general de login */
    function showError(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.style.display = 'flex';
        }
    }

    /** Oculta el error general de login */
    function hideError() {
        if (loginError) {
            loginError.style.display = 'none';
        }
    }
});
