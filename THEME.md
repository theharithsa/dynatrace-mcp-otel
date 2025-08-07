# Theme Implementation Guide

This document explains how the Dynatrace MCP Server documentation site is themed using the Minima Jekyll theme with custom Dynatrace branding.

## Theme Structure

The site uses the Minima theme as a base with custom overrides for Dynatrace branding:

### 1. Main Stylesheet (`assets/css/style.scss`)
- Imports Minima's classic skin
- Loads custom variables and styles
- Provides proper front matter for Jekyll processing

### 2. Custom Variables (`_sass/minima/custom-variables.scss`)
- Defines Dynatrace brand colors:
  - `$brand-color: #1496ff` (Dynatrace Blue)
  - `$brand-secondary-color: #6f42c1` (Dynatrace Purple)
  - `$brand-accent-color: #fd7e14` (Dynatrace Orange)
- Sets typography using Inter font
- Configures spacing and layout variables

### 3. Custom Styles (`_sass/minima/custom-styles.scss`)
- Enhanced header with gradient background
- Search functionality styling
- Category and tool card designs
- Footer improvements
- Responsive design
- Dark theme support

### 4. Custom Includes
- `_includes/custom-head.html`: Additional meta tags, fonts, and CSS variables
- `_includes/footer.html`: Enhanced footer with social links and JavaScript
- `_includes/theme-toggle.html`: Theme toggle button

## Configuration

The `_config.yml` file includes proper Minima theme configuration:

```yaml
theme: minima
minima:
  skin: classic
  nav_pages:
    - docs/getting-started.md
    - docs/about.md
  show_excerpts: true
  social_links:
    - title: GitHub Repository
      icon: github
      url: "https://github.com/theharithsa/dynatrace-mcp-otel"
```

## Features

### Search Functionality
- Real-time search with JavaScript
- Styled search results dropdown
- Keyboard navigation support

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt to screen size
- Collapsible navigation on mobile

### Dark Theme Support
- Toggle button for light/dark themes
- CSS variables for easy theme switching
- Persistent theme preference via localStorage

### Enhanced Components
- Gradient headers with Dynatrace colors
- Category cards with hover effects
- Tool documentation cards
- Statistics counters
- Call-to-action buttons

## Local Development

### Using Docker (Recommended)
```bash
docker-compose up
```

### Using Jekyll Directly (requires Ruby)
```bash
bundle install
bundle exec jekyll serve
```

## Deployment

The site is configured for GitHub Pages deployment with GitHub Actions. The workflow:

1. Triggers on pushes to main branch
2. Builds the Jekyll site with proper permissions
3. Deploys to GitHub Pages

## Customization

To customize the theme further:

1. **Colors**: Edit `_sass/minima/custom-variables.scss`
2. **Styles**: Modify `_sass/minima/custom-styles.scss`
3. **Layout**: Create custom layouts in `_layouts/`
4. **Components**: Add includes in `_includes/`

## File Structure

```
├── _config.yml                          # Jekyll configuration
├── _layouts/                           # Custom layouts
├── _includes/                          # Custom includes
├── _sass/
│   └── minima/
│       ├── custom-variables.scss       # Theme variables
│       └── custom-styles.scss          # Custom styles
├── assets/
│   └── css/
│       └── style.scss                  # Main stylesheet
├── docs/                               # Documentation pages
└── Gemfile                            # Ruby dependencies
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

The theme is optimized for performance with:
- CSS custom properties for theming
- Minimal JavaScript
- Optimized fonts and images
- Efficient CSS grid layouts
