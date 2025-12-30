# 🚀 HƯỚNG DẪN DEPLOY BACKEND LÊN RAILWAY

## ✨ Railway là gì?
- Platform deploy miễn phí ($5 credit/tháng)
- Tự động build Java apps
- Dễ dùng, không cần Docker
- Có database miễn phí

---

## 📋 BƯỚC 1: Chuẩn bị

### 1.1 Push code lên GitHub (nếu chưa có)

```bash
cd d:\Documents\GitHub\Microservice-demo

git init
git add .
git commit -m "Ready to deploy"

# Tạo repo mới trên GitHub, sau đó:
git remote add origin https://github.com/YOUR_USERNAME/Microservice-demo.git
git push -u origin main
```

### 1.2 Tạo tài khoản Railway

1. Vào: https://railway.app
2. Đăng nhập bằng GitHub
3. Authorize Railway

---

## 🎯 BƯỚC 2: Deploy từng Service

Railway yêu cầu deploy từng service riêng. Làm theo thứ tự:

### 2.1 Deploy EUREKA SERVER (Quan trọng nhất!)

1. **New Project** → **Deploy from GitHub repo**
2. Chọn repository `Microservice-demo`
3. **Add a service** → **Deploy from repo**
4. Root directory: `eureka-server`
5. **Deploy**

**Settings:**
- Name: `bookstore-eureka`
- Domains → Generate Domain (ví dụ: `bookstore-eureka.up.railway.app`)
- Copy URL này! Cần dùng cho các services khác

**Environment Variables:** (không cần)

---

### 2.2 Deploy API GATEWAY

1. Trong cùng Project, **New** → **Deploy from GitHub**
2. Chọn repo `Microservice-demo`
3. Root directory: `api-gateway`
4. **Deploy**

**Settings:**
- Name: `bookstore-gateway`
- Domains → Generate Domain (ví dụ: `bookstore-gateway.up.railway.app`)
- ⭐ **Copy URL này! Dùng cho frontend**

**Environment Variables:**
```
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=https://bookstore-eureka.up.railway.app/eureka/
```
(Thay URL Eureka thật của bạn)

---

### 2.3 Deploy BOOK SERVICE

1. **New** → **Deploy from GitHub**
2. Root directory: `book-service`
3. **Deploy**

**Environment Variables:**
```
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=https://bookstore-eureka.up.railway.app/eureka/
```

---

### 2.4 Deploy ORDER SERVICE

1. **New** → **Deploy from GitHub**
2. Root directory: `order-service`
3. **Deploy**

**Environment Variables:**
```
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=https://bookstore-eureka.up.railway.app/eureka/
```

---

### 2.5 Deploy USER SERVICE

1. **New** → **Deploy from GitHub**
2. Root directory: `user-service`
3. **Deploy**

**Environment Variables:**
```
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=https://bookstore-eureka.up.railway.app/eureka/
```

---

## ✅ BƯỚC 3: Kiểm tra

### 3.1 Check Eureka Dashboard

Mở: `https://bookstore-eureka.up.railway.app`

Phải thấy 4 services đã đăng ký:
- ✅ API-GATEWAY
- ✅ BOOK-SERVICE
- ✅ ORDER-SERVICE
- ✅ USER-SERVICE

Nếu chưa đầy đủ, đợi 1-2 phút cho services khởi động.

### 3.2 Test API Gateway

```bash
curl https://bookstore-gateway.up.railway.app/api/books
```

Phải trả về JSON với danh sách 5 cuốn sách.

---

## 🌐 BƯỚC 4: Update Frontend

### 4.1 Cập nhật API URL

Mở file: `frontend/js/api.js`

```javascript
// Thay đổi dòng này:
const API_BASE_URL = 'http://localhost:8080';

// Thành:
const API_BASE_URL = 'https://bookstore-gateway.up.railway.app';
// ☝️ Thay bằng URL Gateway thật của bạn
```

### 4.2 Deploy lại Frontend

Nếu dùng **Netlify:**
1. Commit & push code mới
2. Netlify tự động deploy lại

Hoặc drag & drop lại folder `frontend/`

---

## 🎉 BƯỚC 5: Test Hoàn chỉnh

1. Mở website frontend của bạn (ví dụ: `https://bookstore.netlify.app`)
2. Xem danh sách sách → ✅ Phải load được
3. Đăng nhập: `customer1@example.com` / `pass123` → ✅
4. Thêm sách vào giỏ → ✅
5. Thanh toán → ✅

**🎊 Chúc mừng! Ứng dụng đã online!**

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Railway Free Tier:
- $5 credit/tháng (đủ dùng cho demo)
- Services sẽ sleep sau 30 phút không dùng
- Lần đầu truy cập sẽ chậm (15-30s wake up)

### Nếu hết credit:
- Upgrade Railway ($5/month)
- Hoặc deploy 1 service quan trọng: API Gateway + Merge services

---

## 🐛 TROUBLESHOOTING

### "Application failed to respond"
→ Đợi 1-2 phút, services đang khởi động

### Services không đăng ký với Eureka
→ Check Environment Variable `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`

### Frontend không gọi được Backend
→ Check CORS đã thêm vào API Gateway chưa
→ Verify `API_BASE_URL` đúng URL

### Build failed
→ Check logs trong Railway dashboard
→ Đảm bảo `pom.xml` đúng

---

## 📊 MONITORING

Railway Dashboard cho bạn:
- **Deployments**: Lịch sử deploy
- **Metrics**: CPU, Memory usage
- **Logs**: Real-time logs
- **Settings**: Env vars, domains

---

## 💰 CHI PHÍ

**Free Tier:**
- $5 credit/tháng
- Đủ cho 5 services nhỏ
- ≈ 500 hours/month

**Pro:**
- $20/month
- Unlimited projects
- Priority support

---

## 🔗 URLS CỦA BẠN

Sau khi deploy, bạn sẽ có:

```
Eureka:  https://bookstore-eureka.up.railway.app
Gateway: https://bookstore-gateway.up.railway.app
Frontend: https://bookstore.netlify.app (hoặc domain của bạn)
```

Chia sẻ URL frontend cho mọi người! 🚀

---

## ✨ THAM KHẢO

- [Railway Docs](https://docs.railway.app/)
- [Java Buildpack](https://nixpacks.com/docs/providers/java)
- [Railway Templates](https://railway.app/templates)
