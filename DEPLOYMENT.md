# 🚀 HƯỚNG DẪN DEPLOY ỨNG DỤNG BOOKSTORE

Hướng dẫn deploy ứng dụng BookStore Microservices lên các nền tảng phổ biến.

---

## 📋 Mục lục

1. [Deploy Frontend](#deploy-frontend)
   - Netlify
   - Vercel
   - GitHub Pages
2. [Deploy Backend](#deploy-backend)
   - Docker + Docker Compose
   - Railway
   - Heroku
   - AWS EC2
3. [Deploy Full Stack](#deploy-full-stack)

---

## 🌐 PHẦN 1: DEPLOY FRONTEND

Frontend là static files (HTML/CSS/JS), rất dễ deploy!

### **Option 1: Netlify (Khuyến nghị - MIỄN PHÍ)**

#### Bước 1: Chuẩn bị

Tạo file `netlify.toml` trong folder `frontend/`:
```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Bước 2: Deploy

**Cách A - Drag & Drop:**
1. Vào https://netlify.com
2. Đăng ký/Đăng nhập
3. Kéo thả folder `frontend/` vào Netlify
4. ✅ Xong! Website sẽ có URL: `https://your-site.netlify.app`

**Cách B - Git (Tự động deploy):**
1. Push code lên GitHub
2. Vào Netlify → "Add new site" → "Import from Git"
3. Chọn repository
4. Build settings:
   - Base directory: `frontend`
   - Build command: (để trống)
   - Publish directory: `.`
5. Deploy!

#### Bước 3: Cập nhật API URL

Sau khi deploy backend, cập nhật trong `frontend/js/api.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.com'; // Thay URL backend thật
```

---

### **Option 2: Vercel (Tương tự Netlify)**

1. Vào https://vercel.com
2. Import project từ GitHub
3. Framework: **Other**
4. Root Directory: `frontend`
5. Deploy!

File `vercel.json` (tùy chọn):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

### **Option 3: GitHub Pages (MIỄN PHÍ)**

#### Bước 1: Chuẩn bị
```bash
cd frontend
# Copy tất cả files vào branch gh-pages
git checkout -b gh-pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

#### Bước 2: Bật GitHub Pages
1. Vào repository → Settings → Pages
2. Source: `gh-pages` branch
3. Folder: `/` (root)
4. Save

URL: `https://your-username.github.io/Microservice-demo/`

---

## 🐳 PHẦN 2: DEPLOY BACKEND

### **Option 1: Docker Compose (Local/VPS)**

#### Bước 1: Build tất cả services

```bash
cd D:\Documents\GitHub\Microservice-demo

# Build từng service
cd eureka-server && mvn clean package -DskipTests && cd ..
cd api-gateway && mvn clean package -DskipTests && cd ..
cd book-service && mvn clean package -DskipTests && cd ..
cd order-service && mvn clean package -DskipTests && cd ..
cd user-service && mvn clean package -DskipTests && cd ..

# Hoặc dùng script
.\build-all.ps1
```

#### Bước 2: Chạy với Docker Compose

```bash
# Build images
docker-compose build

# Start tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop
docker-compose down
```

Services sẽ chạy:
- Eureka: http://localhost:8761
- API Gateway: http://localhost:8080
- Book Service: http://localhost:8081
- Order Service: http://localhost:8082
- User Service: http://localhost:8083

---

### **Option 2: Railway (MIỄN PHÍ $5/tháng)**

Railway hỗ trợ deploy Java apps dễ dàng!

#### Cách deploy:

**1. Tạo tài khoản:** https://railway.app

**2. Deploy từng service:**

Mỗi microservice cần deploy riêng:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy Eureka Server
cd eureka-server
railway init
railway up

# Deploy API Gateway (tương tự)
cd ../api-gateway
railway init
railway up

# Lặp lại cho các services còn lại
```

**3. Cấu hình Environment Variables:**

Trong Railway dashboard, set:
```
SPRING_PROFILES_ACTIVE=prod
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=https://eureka-url/eureka/
```

---

### **Option 3: Heroku**

#### Bước 1: Chuẩn bị

Tạo `Procfile` trong mỗi service folder:
```
web: java -jar target/*.jar
```

Tạo `system.properties`:
```
java.runtime.version=17
```

#### Bước 2: Deploy

```bash
# Install Heroku CLI
# Download: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Deploy Eureka Server
cd eureka-server
heroku create bookstore-eureka
git init
git add .
git commit -m "Deploy"
git push heroku master

# Lặp lại cho các services khác
cd ../api-gateway
heroku create bookstore-gateway
# ...
```

---

### **Option 4: AWS EC2 (Production-ready)**

#### Bước 1: Tạo EC2 Instance

1. Vào AWS Console → EC2
2. Launch Instance:
   - AMI: Ubuntu 22.04 LTS
   - Instance type: t2.medium (hoặc lớn hơn)
   - Security Group: Mở ports 8080, 8761, 8081-8083
3. Create & Download key pair (.pem)

#### Bước 2: Kết nối & Cài đặt

```bash
# SSH vào server
ssh -i your-key.pem ubuntu@your-ec2-ip

# Cài Java 17
sudo apt update
sudo apt install openjdk-17-jdk -y

# Cài Docker
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu

# Clone project
git clone https://github.com/your-repo/Microservice-demo.git
cd Microservice-demo
```

#### Bước 3: Deploy

```bash
# Build & Run với Docker Compose
./build-all.ps1  # hoặc build từng service
docker-compose up -d

# Hoặc chạy JAR trực tiếp
nohup java -jar eureka-server/target/eureka-server-1.0.0.jar &
nohup java -jar api-gateway/target/api-gateway-1.0.0.jar &
# ...
```

#### Bước 4: Setup Domain & SSL

```bash
# Cài Nginx
sudo apt install nginx -y

# Cấu hình reverse proxy
sudo nano /etc/nginx/sites-available/bookstore

# Paste:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/bookstore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL với Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## 🔄 PHẦN 3: DEPLOY FULL STACK

### **Kiến trúc đề xuất:**

```
┌─────────────────────────────────────┐
│     Frontend (Netlify/Vercel)       │
│     https://bookstore-app.com       │
└──────────────┬──────────────────────┘
               │ API Calls
               ↓
┌──────────────────────────────────────┐
│   API Gateway (Railway/Heroku/AWS)   │
│   https://api.bookstore-app.com      │
└──────────────┬───────────────────────┘
               │
       ┌───────┴───────┐
       ↓               ↓
┌─────────────┐  ┌─────────────┐
│   Services  │  │   Eureka    │
│  (Docker)   │  │  (Docker)   │
└─────────────┘  └─────────────┘
```

### **Bước deploy:**

1. **Deploy Backend (AWS EC2 với Docker)**
   ```bash
   # Trên EC2
   docker-compose up -d
   # URL: http://your-ec2-ip:8080
   ```

2. **Cấu hình Domain cho Backend**
   - Point domain API: `api.bookstore-app.com` → EC2 IP
   - Setup Nginx reverse proxy
   - SSL với Certbot

3. **Deploy Frontend (Netlify)**
   - Update `API_BASE_URL` = `https://api.bookstore-app.com`
   - Deploy lên Netlify
   - Custom domain: `bookstore-app.com`

---

## 📦 FILES CẦN THIẾT ĐÃ TẠO

Tôi đã tạo sẵn:

✅ `docker-compose.yml` - Orchestrate tất cả services
✅ `Dockerfile` cho mỗi service
✅ `frontend/server.js` - Static server
✅ `frontend/netlify.toml` - Netlify config
✅ `.dockerignore` - Ignore files khi build Docker
✅ `.gitignore` - Git ignore

---

## 🔧 PRODUCTION CHECKLIST

### Backend:
- [ ] Build tất cả services (`mvn clean package`)
- [ ] Test local với Docker Compose
- [ ] Setup database production (PostgreSQL/MySQL thay vì H2)
- [ ] Configure environment variables
- [ ] Setup monitoring (logs, metrics)
- [ ] Configure CORS cho frontend domain
- [ ] Setup SSL certificates
- [ ] Configure firewall/security groups

### Frontend:
- [ ] Update `API_BASE_URL` với backend URL thật
- [ ] Test tất cả chức năng
- [ ] Optimize images & assets
- [ ] Setup CDN (optional)
- [ ] Configure custom domain
- [ ] Setup SSL (automatic với Netlify/Vercel)

---

## 🐛 TROUBLESHOOTING

### Frontend không gọi được Backend:

1. **Lỗi CORS:**
   - Thêm CORS config trong API Gateway và services
   - Allow origin từ frontend domain

2. **API URL sai:**
   - Kiểm tra `API_BASE_URL` trong `js/api.js`
   - Đảm bảo backend đang chạy

3. **Network timeout:**
   - Kiểm tra firewall/security groups
   - Đảm bảo ports đã mở

### Backend không khởi động:

1. **Services không đăng ký với Eureka:**
   - Kiểm tra `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`
   - Đảm bảo Eureka đã chạy trước

2. **Database connection error:**
   - Check database credentials
   - H2 chỉ dùng cho dev, production cần real DB

3. **Port already in use:**
   - Kill process: `netstat -ano | findstr :8080`
   - Hoặc đổi port trong `application.yml`

---

## 💰 CHI PHÍ DỰ KIẾN

### MIỄN PHÍ (Hobby):
- **Frontend:** Netlify/Vercel free tier
- **Backend:** Railway free $5/month credit
- **Total:** $0/tháng (với credits)

### BÁN CHUYÊN (Small Business):
- **Frontend:** Netlify Pro $19/month
- **Backend:** Railway Pro $20/month
- **Database:** Railway PostgreSQL included
- **Total:** ~$40/month

### CHUYÊN NGHIỆP (Production):
- **Frontend:** Vercel Pro + CDN $20/month
- **Backend:** AWS EC2 t3.medium $30/month
- **Database:** AWS RDS PostgreSQL $50/month
- **Load Balancer:** $20/month
- **Total:** ~$120/month

---

## 🎯 KHUYẾN NGHỊ

**Cho học tập/demo:**
→ Frontend: Netlify (free)
→ Backend: Docker Compose local hoặc Railway (free tier)

**Cho production nhỏ:**
→ Frontend: Netlify/Vercel
→ Backend: Railway hoặc Digital Ocean Droplet
→ Database: Managed PostgreSQL

**Cho production lớn:**
→ Frontend: Vercel + CDN
→ Backend: AWS/Azure Kubernetes
→ Database: AWS RDS Multi-AZ
→ Monitoring: DataDog/New Relic

---

## 📚 TÀI LIỆU THAM KHẢO

- [Docker Documentation](https://docs.docker.com/)
- [Netlify Docs](https://docs.netlify.com/)
- [Railway Docs](https://docs.railway.app/)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)
- [Spring Boot Deployment](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html)

---

Bạn muốn deploy lên platform nào? Tôi sẽ hướng dẫn chi tiết! 🚀
