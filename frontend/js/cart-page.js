// Cart Page JavaScript

// Load cart on page load
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
});

// Display cart items
function displayCart() {
    const cartItems = cart.getCart();
    const cartContent = document.getElementById('cart-content');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');

    if (cartItems.length === 0) {
        cartContent.innerHTML = '';
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }

    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';

    cartContent.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p class="author">${item.author}</p>
                <p class="price">${formatCurrency(item.price)}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button onclick="updateQuantity(${item.bookId}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.bookId}, ${item.quantity + 1})">+</button>
                </div>
                <p class="price">${formatCurrency(item.price * item.quantity)}</p>
                <button onclick="removeFromCart(${item.bookId})" class="btn btn-danger">Xóa</button>
            </div>
        </div>
    `).join('');

    // Update total
    document.getElementById('cart-total').textContent = formatCurrency(cart.getTotal());
}

// Update quantity
function updateQuantity(bookId, newQuantity) {
    if (newQuantity < 1) return;
    cart.updateQuantity(bookId, newQuantity);
    displayCart();
}

// Remove from cart
function removeFromCart(bookId) {
    if (confirm('Bạn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        cart.removeItem(bookId);
        displayCart();
    }
}

// Clear cart
function clearCart() {
    if (confirm('Bạn muốn xóa toàn bộ giỏ hàng?')) {
        cart.clearCart();
        displayCart();
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (!auth.isLoggedIn()) {
        alert('Vui lòng đăng nhập để đặt hàng!');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('checkout-modal').classList.add('show');
}

// Close checkout modal
function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('show');
}

// Handle checkout
async function handleCheckout(event) {
    event.preventDefault();

    const user = auth.getCurrentUser();
    const cartItems = cart.getCart();
    const shippingAddress = document.getElementById('shipping-address').value;
    const errorDiv = document.getElementById('checkout-error');

    if (!user) {
        alert('Vui lòng đăng nhập!');
        window.location.href = 'login.html';
        return;
    }

    const orderData = {
        userId: user.id,
        shippingAddress: shippingAddress,
        items: cartItems.map(item => ({
            bookId: item.bookId,
            quantity: item.quantity
        }))
    };

    try {
        await api.createOrder(orderData);
        cart.clearCart();
        closeCheckoutModal();
        showSuccessModal();
    } catch (error) {
        console.error('Order error:', error);
        errorDiv.textContent = 'Đặt hàng thất bại. Vui lòng kiểm tra tồn kho và thử lại.';
        errorDiv.classList.add('show');
    }
}

// Show success modal
function showSuccessModal() {
    document.getElementById('success-modal').classList.add('show');
}

// Close success modal
function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('show');
    window.location.href = 'index.html';
}

// Close modals when clicking outside
window.onclick = function (event) {
    const checkoutModal = document.getElementById('checkout-modal');
    const successModal = document.getElementById('success-modal');

    if (event.target === checkoutModal) {
        closeCheckoutModal();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
}
