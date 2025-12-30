// API Configuration
const API_BASE_URL = 'https://api-gateway-production-637d.up.railway.app';

// API Helper Functions
const api = {
    // Books API
    async getAllBooks() {
        const response = await fetch(`${API_BASE_URL}/api/books`);
        if (!response.ok) throw new Error('Failed to fetch books');
        return response.json();
    },

    async getBookById(id) {
        const response = await fetch(`${API_BASE_URL}/api/books/${id}`);
        if (!response.ok) throw new Error('Book not found');
        return response.json();
    },

    async getBooksByCategory(category) {
        const response = await fetch(`${API_BASE_URL}/api/books/category/${category}`);
        if (!response.ok) throw new Error('Failed to fetch books');
        return response.json();
    },

    async searchBooksByTitle(query) {
        const response = await fetch(`${API_BASE_URL}/api/books/search/title?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        return response.json();
    },

    // Users API
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Registration failed');
        }
        return response.json();
    },

    // Orders API
    async createOrder(orderData) {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    },

    async getOrdersByUserId(userId) {
        const response = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    }
};

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount * 1000); // Assuming prices are in thousands
}
