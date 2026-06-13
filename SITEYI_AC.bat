@echo off
setlocal
title MAVIMARIS Site
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js bulunamadi.
  echo Once https://nodejs.org adresinden Node.js yukleyin.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Gerekli paketler yukleniyor...
  call npm install
  if errorlevel 1 (
    echo Paketler yuklenemedi.
    pause
    exit /b 1
  )
)

if not exist ".next" (
  echo Site hazirlaniyor...
  call npm run build
  if errorlevel 1 (
    echo Site hazirlanamadi.
    pause
    exit /b 1
  )
)

powershell -NoProfile -Command "exit -not (Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet)" >nul 2>&1
if errorlevel 1 (
  echo MAVIMARIS baslatiliyor...
  start "MAVIMARIS Server" /min cmd /c "cd /d ""%~dp0"" && npm run start -- -p 3000"
  timeout /t 3 /nobreak >nul
)

start "" "http://localhost:3000"
echo Site tarayicida acildi.
timeout /t 2 /nobreak >nul
