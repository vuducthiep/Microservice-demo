# Script deploy cho Windows PowerShell

Write-Host "🚀 BookStore Deployment Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Bạn muốn deploy gì?" -ForegroundColor Yellow
Write-Host "1) Frontend only (Local server)" -ForegroundColor White
Write-Host "2) Backend with Docker Compose" -ForegroundColor White
Write-Host "3) Build all services" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Chọn (1-3)"

switch ($choice) {
    "1" {
        Write-Host "📦 Starting Frontend Server..." -ForegroundColor Green
        Set-Location frontend
        
        if (Test-Path "server.js") {
            Write-Host "🌐 Starting Node.js server..." -ForegroundColor Cyan
            node server.js
        } else {
            Write-Host "❌ server.js not found!" -ForegroundColor Red
            Write-Host "👉 Dùng: python -m http.server 3000" -ForegroundColor Yellow
        }
    }
    
    "2" {
        Write-Host "🐳 Building & Deploying Backend..." -ForegroundColor Green
        
        # Check Docker
        if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
            Write-Host "❌ Docker chưa cài đặt!" -ForegroundColor Red
            Write-Host "👉 Download: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "📦 Building services..." -ForegroundColor Cyan
        .\build-all.ps1
        
        Write-Host "🚀 Starting Docker Compose..." -ForegroundColor Cyan
        docker-compose up -d
        
        Write-Host "✅ Backend deployed!" -ForegroundColor Green
        Write-Host "📊 Eureka: http://localhost:8761" -ForegroundColor White
        Write-Host "🚪 Gateway: http://localhost:8080" -ForegroundColor White
    }
    
    "3" {
        Write-Host "📦 Building all services..." -ForegroundColor Green
        .\build-all.ps1
        Write-Host "✅ Build completed!" -ForegroundColor Green
    }
    
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✨ Done!" -ForegroundColor Cyan
Write-Host "📖 Xem DEPLOYMENT.md để deploy lên production" -ForegroundColor Yellow
