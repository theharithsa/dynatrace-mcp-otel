@echo off
echo Starting Jekyll development server...
echo This will make your site available at http://localhost:4000
echo.

REM Check if Docker is available
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker not found. Please install Docker to run Jekyll locally.
    echo Alternatively, install Ruby and Jekyll:
    echo 1. Download Ruby from https://rubyinstaller.org/downloads/
    echo 2. Run: gem install jekyll bundler
    echo 3. Run: bundle install
    echo 4. Run: bundle exec jekyll serve
    pause
    exit /b 1
)

echo Running Jekyll in Docker container...
docker run --rm --volume="%CD%:/srv/jekyll" --publish 4000:4000 jekyll/jekyll:4 jekyll serve --host 0.0.0.0 --livereload
