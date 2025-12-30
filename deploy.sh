#!/bin/bash

# Script deploy nhanh cho các platforms

echo "🚀 BookStore Deployment Helper"
echo "================================"
echo ""

# Hỏi user muốn deploy gì
echo "Bạn muốn deploy gì?"
echo "1) Frontend only (Netlify)"
echo "2) Backend with Docker Compose"
echo "3) Full stack"
echo ""
read -p "Chọn (1-3): " choice

case $choice in
  1)
    echo "📦 Deploying Frontend..."
    cd frontend
    
    # Kiểm tra Netlify CLI
    if ! command -v netlify &> /dev/null; then
        echo "❌ Netlify CLI chưa cài đặt"
        echo "👉 Cài đặt: npm install -g netlify-cli"
        echo "👉 Hoặc deploy bằng drag & drop tại: https://app.netlify.com/drop"
        exit 1
    fi
    
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod
    echo "✅ Frontend deployed!"
    ;;
    
  2)
    echo "🐳 Building & Deploying Backend..."
    
    # Build tất cả services
    echo "📦 Building services..."
    
    cd eureka-server && mvn clean package -DskipTests && cd ..
    cd api-gateway && mvn clean package -DskipTests && cd ..
    cd book-service && mvn clean package -DskipTests && cd ..
    cd order-service && mvn clean package -DskipTests && cd ..
    cd user-service && mvn clean package -DskipTests && cd ..
    
    echo "🚀 Starting Docker Compose..."
    docker-compose up -d
    
    echo "✅ Backend deployed!"
    echo "📊 Eureka: http://localhost:8761"
    echo "🚪 Gateway: http://localhost:8080"
    ;;
    
  3)
    echo "🌐 Full Stack Deployment"
    echo "========================"
    echo ""
    echo "⚠️  Cần thực hiện thủ công:"
    echo ""
    echo "📝 Backend:"
    echo "  1. Deploy backend lên AWS/Railway/Heroku"
    echo "  2. Lấy URL backend (ví dụ: https://api.bookstore.com)"
    echo ""
    echo "📝 Frontend:"
    echo "  1. Cập nhật API_BASE_URL trong frontend/js/api.js"
    echo "  2. Deploy frontend lên Netlify/Vercel"
    echo ""
    echo "📖 Xem chi tiết trong DEPLOYMENT.md"
    ;;
    
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✨ Done!"
