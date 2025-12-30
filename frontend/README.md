# 🌐 BookStore Frontend

Giao diện web đơn giản cho ứng dụng BookStore Microservices.

## ✨ Tính năng

- 📚 **Trang chủ**: Hero section, sách nổi bật, danh mục
- 🔍 **Danh sách sách**: Xem tất cả sách, tìm kiếm, lọc theo category
- 🔐 **Đăng nhập/Đăng ký**: Authentication với backend
- 🛒 **Giỏ hàng**: Thêm sách, cập nhật số lượng, thanh toán
- 📦 **Đặt hàng**: Tạo order và gửi tới backend

## 🚀 Cách chạy

### **Option 1: Node.js HTTP Server (Khuyến nghị)**

```bash
cd frontend
node server.js
```

Mở trình duyệt: **http://localhost:3000**

### **Option 2: Python HTTP Server**

```bash
cd frontend
python -m http.server 3000
```

Mở trình duyệt: **http://localhost:3000**

### **Option 3: VS Code Live Server Extension**

1. Cài đặt extension "Live Server" trong VS Code
2. Right-click vào `index.html`
3. Chọn "Open with Live Server"

### **Option 4: Mở trực tiếp file**

Double-click vào `index.html` (có thể gặp lỗi CORS khi gọi API)

## ⚙️ Cấu hình

### **API Endpoint**

File: `js/api.js`
```javascript
const API_BASE_URL = 'http://localhost:8080';  // API Gateway
```

Đảm bảo backend đang chạy ở port 8080.

### **CORS Configuration**

Nếu gặp lỗi CORS, thêm vào các service backend:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
```

## 📱 Trang web

- **index.html** - Trang chủ
- **books.html** - Danh sách sách
- **login.html** - Đăng nhập/Đăng ký  
- **cart.html** - Giỏ hàng & checkout

## 🎨 Công nghệ sử dụng

- **HTML5** - Structure
- **CSS3** - Styling (Responsive design)
- **Vanilla JavaScript** - Logic (No frameworks)
- **LocalStorage** - Cart & Auth state
- **Fetch API** - HTTP requests

## 🧪 Test

1. **Chạy backend services** trước:
   - Eureka: http://localhost:8761
   - API Gateway: http://localhost:8080
   - Book/Order/User services

2. **Chạy frontend**: `node server.js`

3. **Test flow**:
   - Xem sách ở trang chủ
   - Đăng nhập: `customer1@example.com` / `pass123`
   - Thêm sách vào giỏ
   - Thanh toán

## 📦 Deploy

### **Deploy với Netlify/Vercel**

1. Push code lên GitHub
2. Connect repository với Netlify/Vercel
3. Cập nhật `API_BASE_URL` trong `js/api.js` với backend URL thật

### **Deploy với Docker**

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

Build & Run:
```bash
docker build -t bookstore-frontend .
docker run -p 80:80 bookstore-frontend
```

## 🛠️ Cải tiến trong tương lai

- [ ] React/Vue.js framework
- [ ] TypeScript
- [ ] State management (Redux/Vuex)
- [ ] Advanced search & filters
- [ ] Order history page
- [ ] Admin dashboard
- [ ] Payment gateway integration
- [ ] Image upload for books

## 📄 License

MIT
