document.addEventListener('DOMContentLoaded', async () => {
    const user = auth.getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
        alert('Trang này chỉ dành cho Admin. Vui lòng đăng nhập với tài khoản Admin.');
        window.location.href = 'login.html';
        return;
    }

    const bookForm = document.getElementById('book-form');
    const bookIdInput = document.getElementById('book-id');
    const bookSaveBtn = document.getElementById('book-save-btn');
    const bookResetBtn = document.getElementById('book-reset-btn');
    const booksTableBody = document.querySelector('#books-table tbody');
    const ordersTableBody = document.querySelector('#orders-table tbody');
    const usersTableBody = document.querySelector('#users-table tbody');

    const statusOptions = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    async function loadAll() {
        try {
            const [books, orders, users] = await Promise.all([
                api.getAllBooks(),
                api.getAllOrders(),
                api.getAllUsers()
            ]);
            renderBooks(books);
            renderOrders(orders);
            renderUsers(users);
        } catch (err) {
            console.error(err);
            alert('Tải dữ liệu thất bại: ' + err.message);
        }
    }

    function renderBooks(books) {
        booksTableBody.innerHTML = '';
        books.forEach(book => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${formatCurrency(Number(book.price || 0))}</td>
                <td>${book.stock}</td>
                <td>${book.category || ''}</td>
                <td class="table-actions">
                    <button class="btn" data-action="edit" data-id="${book.id}">Sửa</button>
                    <button class="btn btn-danger" data-action="delete" data-id="${book.id}">Xóa</button>
                </td>
            `;
            booksTableBody.appendChild(tr);
        });
    }

    function renderOrders(orders) {
        ordersTableBody.innerHTML = '';
        orders.forEach(order => {
            const tr = document.createElement('tr');
            const options = statusOptions.map(s => `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s}</option>`).join('');
            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${order.userId}</td>
                <td>${formatCurrency(Number(order.totalAmount || 0))}</td>
                <td><span class="badge-status status-${order.status}">${order.status}</span></td>
                <td>
                    <select data-action="status" data-id="${order.id}">${options}</select>
                    <button class="btn" data-action="update-status" data-id="${order.id}">Cập nhật</button>
                    <button class="btn btn-danger" data-action="delete-order" data-id="${order.id}">Hủy</button>
                </td>
            `;
            ordersTableBody.appendChild(tr);
        });
    }

    function renderUsers(users) {
        usersTableBody.innerHTML = '';
        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>${u.active ? '✔' : '✖'}</td>
                <td>
                    <button class="btn btn-danger" data-action="delete-user" data-id="${u.id}" ${u.role === 'ADMIN' ? 'disabled' : ''}>Xóa</button>
                </td>
            `;
            usersTableBody.appendChild(tr);
        });
    }

    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = bookIdInput.value;
        const payload = {
            title: document.getElementById('book-title').value,
            author: document.getElementById('book-author').value,
            isbn: document.getElementById('book-isbn').value,
            category: document.getElementById('book-category').value,
            price: parseFloat(document.getElementById('book-price').value),
            stock: parseInt(document.getElementById('book-stock').value, 10),
            description: document.getElementById('book-description').value
        };
        try {
            if (id) {
                await api.updateBook(id, payload);
                alert('Cập nhật sách thành công');
            } else {
                await api.createBook(payload);
                alert('Thêm sách thành công');
            }
            resetForm();
            await loadAll();
        } catch (err) {
            console.error(err);
            alert('Lưu sách thất bại: ' + err.message);
        }
    });

    bookResetBtn.addEventListener('click', resetForm);

    function resetForm() {
        bookForm.reset();
        bookIdInput.value = '';
        bookSaveBtn.textContent = 'Thêm mới';
    }

    booksTableBody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if (action === 'edit') {
            try {
                const book = await api.getBookById(id);
                bookIdInput.value = book.id;
                document.getElementById('book-title').value = book.title || '';
                document.getElementById('book-author').value = book.author || '';
                document.getElementById('book-isbn').value = book.isbn || '';
                document.getElementById('book-category').value = book.category || '';
                document.getElementById('book-price').value = book.price || '';
                document.getElementById('book-stock').value = book.stock || 0;
                document.getElementById('book-description').value = book.description || '';
                bookSaveBtn.textContent = 'Cập nhật';
            } catch (err) {
                alert('Không tải được sách: ' + err.message);
            }
        } else if (action === 'delete') {
            if (confirm('Xóa sách này?')) {
                try {
                    await api.deleteBook(id);
                    await loadAll();
                } catch (err) {
                    alert('Xóa thất bại: ' + err.message);
                }
            }
        }
    });

    ordersTableBody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if (action === 'update-status') {
            const select = ordersTableBody.querySelector(`select[data-id="${id}"]`);
            const status = select.value;
            try {
                await api.updateOrderStatus(id, status);
                await loadAll();
            } catch (err) {
                alert('Cập nhật trạng thái thất bại: ' + err.message);
            }
        } else if (action === 'delete-order') {
            if (confirm('Hủy đơn hàng này?')) {
                try {
                    await api.deleteOrder(id);
                    await loadAll();
                } catch (err) {
                    alert('Hủy đơn thất bại: ' + err.message);
                }
            }
        }
    });

    usersTableBody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if (action === 'delete-user') {
            if (confirm('Xóa người dùng này?')) {
                try {
                    await api.deleteUser(id);
                    await loadAll();
                } catch (err) {
                    alert('Xóa người dùng thất bại: ' + err.message);
                }
            }
        }
    });

    await loadAll();
});
