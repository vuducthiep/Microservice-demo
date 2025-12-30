// Home Page JavaScript
let allBooks = [];

// Load featured books on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadFeaturedBooks();
});

// Load featured books
async function loadFeaturedBooks() {
    try {
        const books = await api.getAllBooks();
        allBooks = books;
        displayBooks(books.slice(0, 6)); // Show first 6 books
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('featured-books').innerHTML =
            '<p class="error">Không thể tải sách. Vui lòng kiểm tra kết nối backend.</p>';
    }
}

// Display books in grid
function displayBooks(books) {
    const container = document.getElementById('featured-books');

    if (books.length === 0) {
        container.innerHTML = '<p>Không tìm thấy sách nào.</p>';
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p class="author">Tác giả: ${book.author}</p>
            <span class="category">${book.category}</span>
            <p class="description">${book.description || ''}</p>
            <p class="price">${formatCurrency(book.price)}</p>
            <p class="stock">Còn lại: ${book.stock} cuốn</p>
            <button onclick="addToCart(${book.id})" class="btn btn-primary" 
                ${book.stock === 0 ? 'disabled' : ''}>
                ${book.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </button>
        </div>
    `).join('');
}

// Add to cart
async function addToCart(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (book && book.stock > 0) {
        cart.addItem(book);
    }
}

// Filter by category
function filterByCategory(category) {
    if (category === 'all') {
        window.location.href = 'books.html';
    } else {
        window.location.href = `books.html?category=${category}`;
    }
}
