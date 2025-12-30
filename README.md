# 📚 Bookstore Microservices Application

Ứng dụng web bán sách sử dụng kiến trúc Microservices với Spring Boot và Spring Cloud.

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐
│   API Gateway   │ (Port 8080)
│   (Routing)     │
└────────┬────────┘
         │
    ┌────┴────────────────┐
    │  Eureka Server      │ (Port 8761)
    │  (Service Registry) │
    └─────────────────────┘
         │
    ┌────┴────────────────────────────┐
    │                                 │
┌───┴────────┐  ┌──────────────┐  ┌──┴──────────┐
│Book Service│  │Order Service │  │User Service │
│ (Port 8081)│  │ (Port 8082)  │  │ (Port 8083) │
└────────────┘  └──────────────┘  └─────────────┘
```

## 📦 Các Microservices

### 1. **Eureka Server** (Port 8761)
- Service Discovery và Registry
- Quản lý đăng ký và tìm kiếm các services

### 2. **API Gateway** (Port 8080)
- Điểm vào duy nhất cho tất cả requests
- Load balancing và routing
- Routes:
  - `/api/books/**` → Book Service
  - `/api/orders/**` → Order Service
  - `/api/users/**` → User Service

### 3. **Book Service** (Port 8081)
- Quản lý thông tin sách
- CRUD operations cho books
- Quản lý tồn kho
- Tìm kiếm sách theo tên, tác giả, category

### 4. **Order Service** (Port 8082)
- Quản lý đơn hàng
- Tạo và theo dõi orders
- Tích hợp với Book Service qua Feign Client
- Kiểm tra và cập nhật tồn kho

### 5. **User Service** (Port 8083)
- Quản lý người dùng
- Đăng ký, đăng nhập
- Quản lý thông tin khách hàng

## 🚀 Hướng dẫn chạy ứng dụng

### Yêu cầu:
- Java 17+
- Maven 3.6+

### Cách 1: Chạy từng service riêng lẻ

**Bước 1:** Chạy Eureka Server
```bash
cd eureka-server
mvn spring-boot:run
```
Truy cập: http://localhost:8761

**Bước 2:** Chạy API Gateway
```bash
cd api-gateway
mvn spring-boot:run
```

**Bước 3:** Chạy các Business Services (có thể chạy song song)
```bash
# Terminal 1
cd book-service
mvn spring-boot:run

# Terminal 2
cd order-service
mvn spring-boot:run

# Terminal 3
cd user-service
mvn spring-boot:run
```

### Cách 2: Build và chạy với JAR files

Build tất cả services:
```bash
# Eureka Server
cd eureka-server && mvn clean package && cd ..

# API Gateway
cd api-gateway && mvn clean package && cd ..

# Book Service
cd book-service && mvn clean package && cd ..

# Order Service
cd order-service && mvn clean package && cd ..

# User Service
cd user-service && mvn clean package && cd ..
```

Chạy các services:
```bash
# Terminal 1 - Eureka Server
java -jar eureka-server/target/eureka-server-1.0.0.jar

# Terminal 2 - API Gateway
java -jar api-gateway/target/api-gateway-1.0.0.jar

# Terminal 3 - Book Service
java -jar book-service/target/book-service-1.0.0.jar

# Terminal 4 - Order Service
java -jar order-service/target/order-service-1.0.0.jar

# Terminal 5 - User Service
java -jar user-service/target/user-service-1.0.0.jar
```

## 📝 API Endpoints

### Book Service (qua API Gateway)

```bash
# Lấy tất cả sách
GET http://localhost:8080/api/books

# Lấy sách theo ID
GET http://localhost:8080/api/books/{id}

# Tìm sách theo category
GET http://localhost:8080/api/books/category/{category}

# Tìm sách theo tên
GET http://localhost:8080/api/books/search/title?query=Clean

# Tạo sách mới
POST http://localhost:8080/api/books
Content-Type: application/json

{
  "title": "Spring Boot in Action",
  "author": "Craig Walls",
  "isbn": "978-1617292545",
  "price": 45.99,
  "stock": 50,
  "description": "Spring Boot guide",
  "category": "Programming"
}

# Cập nhật sách
PUT http://localhost:8080/api/books/{id}

# Xóa sách
DELETE http://localhost:8080/api/books/{id}
```

### User Service (qua API Gateway)

```bash
# Lấy tất cả users
GET http://localhost:8080/api/users

# Đăng ký user mới
POST http://localhost:8080/api/users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "0901234567",
  "address": "123 Street"
}

# Đăng nhập
POST http://localhost:8080/api/users/login
Content-Type: application/json

{
  "email": "customer1@example.com",
  "password": "pass123"
}

# Lấy user theo email
GET http://localhost:8080/api/users/email/{email}
```

### Order Service (qua API Gateway)

```bash
# Tạo đơn hàng mới
POST http://localhost:8080/api/orders
Content-Type: application/json

{
  "userId": 2,
  "shippingAddress": "123 Delivery Street",
  "items": [
    {
      "bookId": 1,
      "quantity": 2
    },
    {
      "bookId": 2,
      "quantity": 1
    }
  ]
}

# Lấy tất cả orders
GET http://localhost:8080/api/orders

# Lấy orders của user
GET http://localhost:8080/api/orders/user/{userId}

# Cập nhật trạng thái order
PUT http://localhost:8080/api/orders/{id}/status?status=CONFIRMED

# Hủy order
DELETE http://localhost:8080/api/orders/{id}
```

## 🗄️ Database

Tất cả services sử dụng H2 in-memory database với dữ liệu mẫu:

### Book Service
- Console: http://localhost:8081/h2-console
- JDBC URL: `jdbc:h2:mem:bookdb`
- 5 cuốn sách mẫu

### User Service
- Console: http://localhost:8083/h2-console
- JDBC URL: `jdbc:h2:mem:userdb`
- 3 users mẫu (1 admin, 2 customers)

### Order Service
- Console: http://localhost:8082/h2-console
- JDBC URL: `jdbc:h2:mem:orderdb`

## 🧪 Test Flow

1. **Khởi động tất cả services** theo thứ tự: Eureka → Gateway → Business Services

2. **Kiểm tra Eureka Dashboard**: http://localhost:8761
   - Tất cả services phải đăng ký thành công

3. **Test Book Service**:
   ```bash
   curl http://localhost:8080/api/books
   ```

4. **Test User Service** (Login):
   ```bash
   curl -X POST http://localhost:8080/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"customer1@example.com","password":"pass123"}'
   ```

5. **Test Order Service** (Tạo đơn hàng):
   ```bash
   curl -X POST http://localhost:8080/api/orders \
     -H "Content-Type: application/json" \
     -d '{
       "userId": 2,
       "shippingAddress": "123 Test Street",
       "items": [{"bookId": 1, "quantity": 2}]
     }'
   ```

## 🛠️ Công nghệ sử dụng

- **Spring Boot 3.2.0**
- **Spring Cloud 2023.0.0**
- **Spring Cloud Netflix Eureka** - Service Discovery
- **Spring Cloud Gateway** - API Gateway
- **Spring Cloud OpenFeign** - Service-to-Service Communication
- **Spring Data JPA** - Database Access
- **H2 Database** - In-memory Database
- **Lombok** - Reduce boilerplate code
- **Maven** - Build Tool

## 📚 Kiến thức cần có

- Spring Boot & Spring Framework
- Microservices Architecture
- RESTful API Design
- Service Discovery & Registration
- API Gateway Pattern
- Inter-service Communication
- Database Design

## 🌐 Frontend Web Application

Ứng dụng đã có **giao diện web** hoàn chỉnh!

### Cấu trúc Frontend:
```
frontend/
├── index.html          # Trang chủ
├── books.html          # Danh sách sách
├── login.html          # Đăng nhập/Đăng ký
├── cart.html           # Giỏ hàng & Checkout
├── css/
│   └── style.css       # Responsive design
├── js/
│   ├── api.js          # API calls
│   ├── auth.js         # Authentication
│   ├── cart.js         # Shopping cart
│   ├── home.js         # Homepage logic
│   ├── books.js        # Books page
│   ├── login.js        # Login page
│   └── cart-page.js    # Cart page
└── server.js           # Static server
```

### Chạy Frontend:

**Option 1 - Node.js:**
```bash
cd frontend
node server.js
```
Mở: http://localhost:3000

**Option 2 - Python:**
```bash
cd frontend
python -m http.server 3000
```

### Tính năng:
- ✅ Xem danh sách sách & tìm kiếm
- ✅ Đăng nhập/Đăng ký tài khoản
- ✅ Thêm sách vào giỏ hàng
- ✅ Thanh toán & tạo đơn hàng
- ✅ Responsive design (mobile-friendly)
- ✅ LocalStorage cho cart & auth

## 🔄 Các bước tiếp theo để cải thiện

1. **Security**: Thêm Spring Security và JWT Authentication
2. **Config Server**: Centralized configuration management
3. **Circuit Breaker**: Resilience4j cho fault tolerance
4. **Distributed Tracing**: Sleuth + Zipkin
5. **Messaging**: RabbitMQ/Kafka cho async communication
6. **Database**: Chuyển sang PostgreSQL/MySQL
7. **Monitoring**: Prometheus + Grafana
8. **Logging**: ELK Stack
9. **Frontend Framework**: Migrate to React/Vue.js

## 📄 License

MIT License

## 👨‍💻 Tác giả

Bookstore Microservices Demo Project
