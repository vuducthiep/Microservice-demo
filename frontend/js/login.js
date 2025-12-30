// Login Page JavaScript

// Show/hide tabs
function showTab(tabName) {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`${tabName}-form`).classList.add('active');
    event.target.classList.add('active');
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        const user = await api.login(email, password);
        auth.setCurrentUser(user);
        alert('Đăng nhập thành công!');
        window.location.href = 'index.html';
    } catch (error) {
        errorDiv.textContent = 'Email hoặc mật khẩu không đúng!';
        errorDiv.classList.add('show');
    }
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();

    const userData = {
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value,
        firstName: document.getElementById('register-firstname').value,
        lastName: document.getElementById('register-lastname').value,
        phoneNumber: document.getElementById('register-phone').value,
        address: document.getElementById('register-address').value
    };

    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');

    try {
        await api.register(userData);
        successDiv.textContent = 'Đăng ký thành công! Bạn có thể đăng nhập ngay.';
        successDiv.classList.add('show');
        errorDiv.classList.remove('show');

        // Clear form
        event.target.reset();

        // Switch to login tab after 2 seconds
        setTimeout(() => {
            document.querySelector('.tab-btn').click();
        }, 2000);
    } catch (error) {
        errorDiv.textContent = error.message || 'Đăng ký thất bại. Email có thể đã tồn tại.';
        errorDiv.classList.add('show');
        successDiv.classList.remove('show');
    }
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (auth.isLoggedIn()) {
        window.location.href = 'index.html';
    }
});
