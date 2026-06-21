@echo off
echo ===================================================
echo  Git Add, Commit, and Push Script
echo ===================================================
echo.

:: Stage all changed files (ignores .env and node_modules automatically)
echo Staging changes...
git add .

:: Prompt the user for a commit message
set /p commit_msg="Enter your commit message (or press Enter for 'Update project'): "
if "%commit_msg%"=="" set commit_msg=Update project

:: Commit changes
echo.
echo Committing changes...
git commit -m "%commit_msg%"

:: Push changes to GitHub main branch
echo.
echo Pushing to GitHub main branch...
git push origin main

echo.
echo ===================================================
echo  Done!
echo ===================================================
pause
