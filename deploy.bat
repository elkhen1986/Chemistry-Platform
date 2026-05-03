@echo off
cd /d "%~dp0"
echo انت دلوقتي في: %cd%
echo.
git status
echo.
pause
git add .
git commit -m "update"
git push
echo.
echo خلصنا - دوس أي زرار عشان تقفل
pause