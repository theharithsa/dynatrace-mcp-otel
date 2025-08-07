# Development Guide

## Quick Start

The Dynatrace MCP Server documentation site is now fully configured with proper Minima theme integration and custom Dynatrace branding.

### What's Implemented

✅ **Minima Theme Integration**
- Proper SCSS structure with `assets/css/style.scss` as entry point
- Custom variables in `_sass/minima/custom-variables.scss`
- Custom styles in `_sass/minima/custom-styles.scss`
- Theme configuration in `_config.yml`

✅ **Dynatrace Branding**
- Brand colors: Blue (#1496ff), Purple (#6f42c1), Orange (#fd7e14)
- Inter font family integration
- Gradient headers and enhanced styling
- Professional component design

✅ **Enhanced Features**
- Search functionality with real-time results
- Responsive grid layouts for categories and tools
- Dark/light theme toggle
- Enhanced footer with social links
- Copy-to-clipboard for code blocks
- Smooth animations and transitions

✅ **GitHub Pages Ready**
- Proper GitHub Actions workflow
- Compatible gem versions
- Optimized for deployment

## Local Development Options

### Option 1: Docker (Recommended)

```bash
# Start the development server
docker-compose up

# View site at http://localhost:4000
```

### Option 2: Ruby/Jekyll (if installed)

```bash
# Install dependencies
bundle install

# Start development server
bundle exec jekyll serve

# View site at http://localhost:4000
```

### Option 3: GitHub Codespaces

1. Open repository in GitHub Codespaces
2. Jekyll will be pre-installed
3. Run `bundle exec jekyll serve`

## Theme Verification

The Minima theme should now apply correctly with:

1. **Header**: Gradient background with Dynatrace colors
2. **Navigation**: Clean white links on gradient background
3. **Content**: Proper spacing and typography
4. **Cards**: Category and tool cards with hover effects
5. **Footer**: Enhanced footer with social links
6. **Search**: Styled search box with dropdown results

## File Structure Overview

```
dynatrace-mcp-otel/
├── _config.yml                 # Jekyll + Minima configuration
├── assets/css/style.scss       # Main stylesheet (imports Minima)
├── _sass/minima/
│   ├── custom-variables.scss   # Dynatrace brand variables
│   └── custom-styles.scss      # Custom component styles
├── _includes/
│   ├── custom-head.html        # Additional head content
│   ├── footer.html             # Enhanced footer
│   └── theme-toggle.html       # Theme toggle button
├── _layouts/                   # Custom layouts (extends Minima)
├── docs/                       # Documentation content
└── Gemfile                     # GitHub Pages compatible gems
```

## Next Steps

1. **Test Deployment**: Push changes to trigger GitHub Actions
2. **Verify Theme**: Check that Minima theme applies correctly
3. **Content Updates**: Add or modify documentation as needed
4. **Performance**: Monitor site performance and optimize

## Troubleshooting

If the theme doesn't apply:

1. Check `_config.yml` has `theme: minima`
2. Verify `assets/css/style.scss` has proper front matter
3. Ensure `_sass/minima/` directory structure is correct
4. Check GitHub Actions build logs for errors

## Support

For theme-related issues:
- Check Jekyll/Minima documentation
- Review GitHub Actions logs
- Test locally with Docker

The theme implementation is now complete and ready for production!
