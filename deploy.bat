@echo off
echo 🚀 AI Event Planner Deployment Script
echo ======================================

:menu
echo.
echo Select deployment option:
echo 1) Local Docker deployment
echo 2) Vercel (Frontend) + Railway (Backend)
echo 3) Build only (no deployment)
echo 4) Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto docker_deploy
if "%choice%"=="2" goto cloud_deploy
if "%choice%"=="3" goto build_only
if "%choice%"=="4" goto exit
echo Invalid option, please try again.
goto menu

:docker_deploy
echo [INFO] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed or not in PATH
    pause
    goto menu
)

echo [INFO] Building frontend...
cd frontend
call npm install
call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed
    pause
    goto menu
)
cd ..

echo [INFO] Setting up backend...
cd backend
call npm install
cd ..

echo [INFO] Starting Docker deployment...
docker-compose up --build -d
if errorlevel 1 (
    echo [ERROR] Docker deployment failed
    pause
    goto menu
)

echo [SUCCESS] Docker deployment completed!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
pause
goto menu

:cloud_deploy
echo [INFO] Building frontend...
cd frontend
call npm install
call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed
    pause
    goto menu
)

echo [INFO] Deploying to Vercel...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing Vercel CLI...
    call npm install -g vercel
)
call vercel --prod
cd ..

echo [INFO] Setting up backend...
cd backend
call npm install

echo [INFO] Deploying to Railway...
railway --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing Railway CLI...
    call npm install -g @railway/cli
)
call railway up
cd ..

echo [SUCCESS] Cloud deployment initiated!
pause
goto menu

:build_only
echo [INFO] Building frontend...
cd frontend
call npm install
call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed
    pause
    goto menu
)
cd ..

echo [INFO] Setting up backend...
cd backend
call npm install
cd ..

echo [SUCCESS] Build completed successfully!
pause
goto menu

:exit
echo [INFO] Exiting...
exit /b 0