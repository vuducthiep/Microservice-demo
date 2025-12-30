// Cart Management
const cart = {
    // Get cart from localStorage
    getCart() {
        const cartStr = localStorage.getItem('cart');
        return cartStr ? JSON.parse(cartStr) : [];
    },

    // Save cart to localStorage
    saveCart(cartItems) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        this.updateCartCount();
    },

    // Add item to cart
    addItem(book, quantity = 1) {
        const cartItems = this.getCart();
        const existingItem = cartItems.find(item => item.bookId === book.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({
                bookId: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                quantity: quantity
            });
        }

        this.saveCart(cartItems);
        alert('Đã thêm vào giỏ hàng!');
    },

    // Remove item from cart
    removeItem(bookId) {
        const cartItems = this.getCart().filter(item => item.bookId !== bookId);
        this.saveCart(cartItems);
    },

    // Update item quantity
    updateQuantity(bookId, quantity) {
        const cartItems = this.getCart();
        const item = cartItems.find(item => item.bookId === bookId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart(cartItems);
        }
    },

    // Clear cart
    clearCart() {
        localStorage.removeItem('cart');
        this.updateCartCount();
    },

    // Get cart total
    getTotal() {
        return this.getCart().reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },

    // Update cart count badge
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cart-count');
        const count = this.getCart().reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => el.textContent = count);
    }
};

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();
});
