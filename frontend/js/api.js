// API Configuration
const BOOK_SERVICE_URL = 'https://book-service-production-c5b7.up.railway.app';
const USER_SERVICE_URL = 'https://user-service-production-02c9.up.railway.app';
const ORDER_SERVICE_URL = 'https://order-service-production-bfde.up.railway.app';

// API Helper Functions
const api = {
    // Books API
    async getAllBooks() {
        const response = await fetch(`${BOOK_SERVICE_URL}/api/books`);
        if (!response.ok) throw new Error('Failed to fetch books');
        return response.json();
    },

    async getBookById(id) {
        const response = await fetch(`${BOOK_SERVICE_URL}/api/books/${id}`);
        if (!response.ok) throw new Error('Book not found');
        return response.json();
    },

    async getBooksByCategory(category) {
        const response = await fetch(`${BOOK_SERVICE_URL}/api/books/category/${category}`);
        if (!response.ok) throw new Error('Failed to fetch books');
        return response.json();
    },

    async searchBooksByTitle(query) {
        const response = await fetch(`${BOOK_SERVICE_URL}/api/books/search/title?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        return response.json();
    },

    // Users API
    async login(email, password) {
        const response = await fetch(`${USER_SERVICE_URL}/api/users/login`, {
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
        const response = await fetch(`${USER_SERVICE_URL}/api/users`, {
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
        const response = await fetch(`${ORDER_SERVICE_URL}/api/orders`, {
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
        const response = await fetch(`${ORDER_SERVICE_URL}/api/orders/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    // Admin: Books
    async createBook(book) {
        const response = await fetch(`${BOOK_SERVICE_URL}/api/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        if (!response.ok) throw new Error('Failed to create book');
        return response.json();
    },

    async updateBook(id, book) {
        const response = await fetch(`${BOOK_SERVICE_URL}/api/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        if (!response.ok) throw new Error('Failed to update book');
        return response.json();
    },

    async deleteBook(id) {
        const response = await fetch(`${BOOK_SERVICE_URL}/api/books/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete book');
    },

    // Admin: Users
    async getAllUsers() {
        const response = await fetch(`${USER_SERVICE_URL}/api/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    async deleteUser(id) {
        const response = await fetch(`${USER_SERVICE_URL}/api/users/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete user');
    },

    // Admin: Orders
    async getAllOrders() {
        const response = await fetch(`${ORDER_SERVICE_URL}/api/orders`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    async updateOrderStatus(id, status) {
        const response = await fetch(`${ORDER_SERVICE_URL}/api/orders/${id}/status?status=${encodeURIComponent(status)}`, {
            method: 'PUT'
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    },

    async deleteOrder(id) {
        const response = await fetch(`${ORDER_SERVICE_URL}/api/orders/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete order');
    }
};

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount * 1000); // Assuming prices are in thousands
}
