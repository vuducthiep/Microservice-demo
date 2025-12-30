// Books Page JavaScript
let allBooks = [];
let currentFilter = 'all';

// Load books on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check for category filter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        currentFilter = category;
        setActiveFilter(category);
    }

    await loadBooks();
});

// Load all books
async function loadBooks() {
    try {
        const books = currentFilter === 'all'
            ? await api.getAllBooks()
            : await api.getBooksByCategory(currentFilter);

        allBooks = books;
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        document.getElementById('books-list').innerHTML =
            '<p class="error">Không thể tải sách. Vui lòng kiểm tra kết nối backend.</p>';
    }
}

// Display books
function displayBooks(books) {
    const container = document.getElementById('books-list');

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
            <p class="stock">ISBN: ${book.isbn}</p>
            <p class="price">${formatCurrency(book.price)}</p>
            <p class="stock">Còn lại: ${book.stock} cuốn</p>
            <button onclick="addToCart(${book.id})" class="btn btn-primary" 
                ${book.stock === 0 ? 'disabled' : ''}>
                ${book.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </button>
        </div>
    `).join('');
}

// Filter books by category
function filterBooks(category) {
    currentFilter = category;
    setActiveFilter(category);
    loadBooks();
}

// Set active filter button
function setActiveFilter(category) {
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        }
    });
}

// Search books
async function searchBooks() {
    const query = document.getElementById('search-input').value.trim();

    if (!query) {
        loadBooks();
        return;
    }

    try {
        const books = await api.searchBooksByTitle(query);
        allBooks = books;
        displayBooks(books);
    } catch (error) {
        console.error('Error searching books:', error);
        document.getElementById('books-list').innerHTML =
            '<p class="error">Không thể tìm kiếm. Vui lòng thử lại.</p>';
    }
}

// Add to cart
function addToCart(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (book && book.stock > 0) {
        cart.addItem(book);
    }
}

// Enter key to search
document.getElementById('search-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBooks();
    }
});
