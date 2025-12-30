# Build script cho Windows
# Chạy script này để build tất cả services

Write-Host "Building Eureka Server..." -ForegroundColor Green
Set-Location eureka-server
mvn clean package -DskipTests
Set-Location ..

Write-Host "Building API Gateway..." -ForegroundColor Green
Set-Location api-gateway
mvn clean package -DskipTests
Set-Location ..

Write-Host "Building Book Service..." -ForegroundColor Green
Set-Location book-service
mvn clean package -DskipTests
Set-Location ..

Write-Host "Building Order Service..." -ForegroundColor Green
Set-Location order-service
mvn clean package -DskipTests
Set-Location ..

Write-Host "Building User Service..." -ForegroundColor Green
Set-Location user-service
mvn clean package -DskipTests
Set-Location ..

Write-Host "Build completed!" -ForegroundColor Cyan
Write-Host "To run with Docker: docker-compose up --build" -ForegroundColor Yellow
