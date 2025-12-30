// Authentication Management
const auth = {
    // Get current user from localStorage
    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Set current user
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    // Clear current user (logout)
    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    // Update auth link in header
    updateAuthLink() {
        const authLink = document.getElementById('auth-link');
        if (!authLink) return;

        const user = this.getCurrentUser();
        if (user) {
            authLink.textContent = `👤 ${user.firstName || user.email}`;
            authLink.href = '#';
            authLink.onclick = (e) => {
                e.preventDefault();
                if (confirm('Bạn muốn đăng xuất?')) {
                    this.logout();
                }
            };
        } else {
            authLink.textContent = 'Đăng nhập';
            authLink.href = 'login.html';
            authLink.onclick = null;
        }
    }
};

// Update auth link on page load
document.addEventListener('DOMContentLoaded', () => {
    auth.updateAuthLink();
});
