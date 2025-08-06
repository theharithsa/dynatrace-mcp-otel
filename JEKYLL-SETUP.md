# 🚀 Jekyll Documentation Deployment Guide

This repository includes a complete Jekyll setup for deploying professional documentation as a static website.

## Quick Deployment to GitHub Pages

### 1. Enable GitHub Pages
1. Go to your repository **Settings**
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select **GitHub Actions**
4. The site will build automatically when you push to `main`

### 2. Configure Analytics (Optional)
Edit `_config.yml` and add your tracking IDs:

```yaml
# Google Analytics
google_analytics: G-XXXXXXXXXX

# Microsoft Clarity (optional)
clarity_id: your_clarity_id

# Plausible Analytics (optional)
plausible_domain: yourdomain.com
```

### 3. Customize Branding
Update the brand colors in `_config.yml`:

```yaml
brand_color: "#1496ff"
secondary_color: "#6f42c1"
accent_color: "#fd7e14"
```

### 4. Update Repository Info
In `_config.yml`, update:

```yaml
url: "https://yourusername.github.io"
baseurl: "/your-repo-name"
github_username: yourusername
```

## Features Included

### 🎨 Professional Design
- **Responsive layout** that works on all devices
- **Dynatrace brand colors** and styling
- **Modern UI components** with smooth animations
- **Dark/light theme support** (auto-detecting)

### 🔍 Advanced Search
- **Global search overlay** accessible from header
- **Real-time search** as you type
- **Category filtering** and smart suggestions
- **Keyboard shortcuts** for power users

### 📊 Analytics & Tracking
- **Google Analytics 4** integration with custom events
- **Microsoft Clarity** for user behavior insights
- **Plausible Analytics** privacy-friendly alternative
- **Custom event tracking** for tool usage patterns

### 🧭 Enhanced Navigation
- **Interactive tool categories** with quick navigation
- **Breadcrumb navigation** for easy orientation
- **Related tools** suggestions on each page
- **Back to top** button for long pages

### 📱 Mobile Optimized
- **Responsive design** that works perfectly on mobile
- **Touch-friendly** navigation and interactions
- **Optimized loading** for slower connections
- **Progressive Web App** ready

## File Structure

```
├── _config.yml              # Jekyll configuration
├── _layouts/                 # Custom page layouts
│   ├── home.html            # Homepage with search & categories
│   └── tool.html            # Individual tool documentation
├── _includes/               # Reusable components
│   ├── header.html          # Navigation with global search
│   └── analytics.html       # Tracking scripts
├── _sass/                   # Custom stylesheets
│   └── custom.scss          # Dynatrace brand styling
├── docs/                    # Tool documentation
│   ├── index.md             # Main documentation hub
│   └── *.md                 # Individual tool docs
├── .github/workflows/       # GitHub Actions
│   └── jekyll.yml           # Auto-deployment workflow
├── Gemfile                  # Ruby dependencies
├── getting-started.md       # Quick start guide
└── about.md                 # Project information
```

## Local Development

### Prerequisites
- Ruby 2.7+ (recommended: 3.0+)
- Bundler gem

### Setup

```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve --livereload

# Build for production
bundle exec jekyll build
```

The site will be available at `http://localhost:4000`

## Customization Guide

### Adding New Tools
1. Create a new `.md` file in `/docs/`
2. Use this front matter template:

```yaml
---
layout: tool
title: Your Tool Name
tool_category: Category Name
description: Brief tool description
permalink: /docs/your_tool_name/
related_tools:
  - name: Related Tool
    link: related_tool.html
    description: Why it's related
---
```

### Updating Categories
Edit the category data in `_layouts/home.html` and `_includes/header.html`

### Styling Changes
Modify `_sass/custom.scss` for design updates:
- Colors: Update the brand color variables
- Typography: Modify font families and sizes
- Layout: Adjust spacing and component styling

### Analytics Setup
1. **Google Analytics**: Add your GA4 tracking ID to `_config.yml`
2. **Custom Events**: Modify `_includes/analytics.html` for additional tracking
3. **Privacy**: The setup includes privacy-friendly configurations

## Deployment Options

### GitHub Pages (Recommended)
- ✅ Free hosting
- ✅ Automatic builds via GitHub Actions
- ✅ Custom domain support
- ✅ SSL certificates included

### Netlify
1. Connect your GitHub repository
2. Set build command: `bundle exec jekyll build`
3. Set publish directory: `_site`

### Vercel
1. Import GitHub repository
2. Framework preset: Jekyll
3. Build command: `bundle exec jekyll build`
4. Output directory: `_site`

### Manual Deployment
```bash
# Build the site
bundle exec jekyll build

# Deploy _site/ folder to your web server
rsync -avz _site/ user@yourserver:/path/to/webroot/
```

## Performance Optimization

### Built-in Optimizations
- **Compressed CSS** via Sass configuration
- **Optimized images** with proper sizing
- **Lazy loading** for better initial page loads
- **Minimal JavaScript** for fast interactions

### Additional Optimizations
- **CDN integration** for global content delivery
- **Image compression** for faster loading
- **Caching headers** for repeat visitors
- **Service worker** for offline functionality

## SEO Features

### Included SEO Elements
- **Meta descriptions** for all pages
- **Open Graph tags** for social sharing
- **Structured data** for search engines
- **Sitemap** generation automatically
- **Robot.txt** for search engine guidance

### Customization
Update SEO settings in `_config.yml`:

```yaml
title: Your Site Title
description: Your site description
author:
  name: Your Name
  email: your@email.com
```

## Troubleshooting

### Common Issues

**Build Errors:**
- Check Ruby version compatibility
- Verify all gems are installed: `bundle install`
- Clear cache: `bundle exec jekyll clean`

**Styling Issues:**
- Sass compilation errors in `_sass/custom.scss`
- Check CSS syntax and variable names
- Verify import statements

**Search Not Working:**
- Check JavaScript console for errors
- Verify search data in `_layouts/home.html`
- Test with different browsers

### Getting Help
- **Jekyll Documentation**: [jekyllrb.com](https://jekyllrb.com)
- **GitHub Issues**: Report bugs and feature requests
- **Community**: Jekyll Discord and forums

## Contributing

Help improve the documentation site:

1. **Design improvements**: Better mobile experience, accessibility
2. **New features**: Advanced search, filtering, tagging
3. **Performance**: Faster loading, smaller bundle size
4. **Documentation**: Better setup guides, troubleshooting

---

**Ready to deploy?** Push to your `main` branch and watch the magic happen! 🚀

Your documentation site will be live at: `https://yourusername.github.io/your-repo-name`
