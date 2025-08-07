#!/bin/bash
echo "Starting Jekyll development server..."
echo "This will make your site available at http://localhost:4000"
echo ""

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Please install Docker to run Jekyll locally."
    echo "Alternatively, install Ruby and Jekyll:"
    echo "1. Download Ruby from https://rubyinstaller.org/downloads/"
    echo "2. Run: gem install jekyll bundler"
    echo "3. Run: bundle install"
    echo "4. Run: bundle exec jekyll serve"
    exit 1
fi

# Run Jekyll using Docker
echo "Running Jekyll in Docker container..."
docker run --rm \
  --volume="$PWD:/srv/jekyll" \
  --publish 4000:4000 \
  jekyll/jekyll:4 \
  jekyll serve --host 0.0.0.0 --livereload
