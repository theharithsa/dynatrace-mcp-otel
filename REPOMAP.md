# 📁 Repository Structure Guide

This document provides a comprehensive overview of the Dynatrace MCP Server repository structure and explains the purpose of each directory and file.

## 🗂️ Root Directory Structure

```
dynatrace-mcp-otel/
├── 📄 Core Configuration
│   ├── package.json                 # Node.js project configuration and dependencies
│   ├── package-lock.json           # Locked dependency versions for reproducible builds
│   ├── tsconfig.json               # TypeScript compiler configuration
│   ├── jest.config.js              # Jest testing framework configuration
│   ├── makefile                    # Build automation scripts
│   └── .nvmrc                      # Node.js version specification
│
├── 🚀 Development & Build
│   ├── src/                        # Source code directory (TypeScript)
│   ├── dist/                       # Compiled JavaScript output
│   ├── node_modules/               # Node.js dependencies (auto-generated)
│   └── tsconfig.tsbuildinfo        # TypeScript incremental compilation cache
│
├── 📚 Documentation & Website
│   ├── docs/                       # Jekyll documentation content
│   ├── _layouts/                   # Jekyll page templates
│   ├── _includes/                  # Jekyll reusable components
│   ├── _sass/                      # Custom SCSS stylesheets
│   ├── _config.yml                 # Jekyll site configuration
│   ├── Gemfile                     # Ruby dependencies for Jekyll
│   ├── JEKYLL-SETUP.md            # Jekyll deployment guide
│   └── REPOMAP.md                  # This file - repository structure guide
│
├── 🔧 Configuration & Setup
│   ├── .env.template               # Environment variables template
│   ├── .env                        # Local environment configuration (git-ignored)
│   ├── dashboards/                 # Pre-built Dynatrace dashboard templates
│   ├── workflows/                  # Workflow automation templates
│   └── dynatrace-agent-rules/      # Agent configuration and rules
│
├── 🐳 Deployment
│   ├── Dockerfile                  # Container build instructions
│   ├── .dockerignore              # Docker build exclusions
│   └── .github/workflows/         # GitHub Actions CI/CD pipelines
│
├── 📋 Project Management
│   ├── CHANGELOG.md               # Version history and release notes
│   ├── README.md                  # Main project documentation
│   ├── LICENSE                    # MIT license terms
│   ├── CODE_OF_CONDUCT.md         # Community guidelines
│   ├── CONTRIBUTING.md            # Contribution guidelines
│   ├── SECURITY.md                # Security policy and reporting
│   ├── SkillManifest.md           # Copilot skill configuration
│   ├── skillManifest.yaml         # YAML skill configuration
│   └── prompt.md                  # AI prompting guidelines
│
├── 🛠️ Development Tools
│   ├── .vscode/                   # VS Code workspace settings
│   ├── .gitignore                 # Git exclusion patterns
│   ├── .gitattributes            # Git file handling rules
│   ├── .editorconfig             # Code editor configuration
│   ├── .prettierrc               # Code formatting rules
│   ├── .markdownlint.yml         # Markdown linting configuration
│   └── .npmignore                # NPM package exclusions
│
└── 🎨 Assets
    └── assets/                    # Static files (images, diagrams)
```

## 📂 Detailed Directory Explanations

### 🔧 `/src/` - Source Code
**Purpose**: Contains all TypeScript source code for the MCP server

```
src/
├── index.ts                       # Main MCP server entry point
├── logging.ts                     # Centralized logging utilities
├── getDynatraceEnv.ts            # Environment detection logic
├── getDynatraceEnv.test.ts       # Unit tests for environment detection
├── authentication/
│   ├── dynatrace-clients.ts      # OAuth client configuration
│   └── types.ts                  # Authentication type definitions
└── capabilities/
    ├── bulk-delete-documents.ts   # Document management tools
    ├── davis-copilot.ts          # AI assistant integration
    ├── execute-dql.ts            # DQL query execution
    ├── get-problem-details.ts    # Problem analysis tools
    ├── send-slack-message.ts     # Communication integrations
    └── [18 more tool files]      # Individual MCP tool implementations
```

**Key Files**:
- `index.ts`: Registers all MCP tools and handles server initialization
- `capabilities/*.ts`: Each file implements a specific MCP tool with its schema and handler

### 📚 `/docs/` - Documentation Content
**Purpose**: Jekyll-powered documentation website content

```
docs/
├── index.md                      # Documentation homepage
├── getting-started.md            # Quick start guide
├── about.md                      # Project information
├── bulk_delete_dashboards.md     # Tool-specific documentation
├── chat_with_davis_copilot.md    # AI assistant tool docs
├── execute_dql.md               # DQL execution tool docs
├── get_problem_details.md       # Problem analysis docs
└── [19 more tool docs]          # Individual tool documentation
```

**Content Structure**: Each tool documentation includes usage examples, parameters, and prompting best practices.

### 🎨 Jekyll Website Infrastructure

#### `/_layouts/` - Page Templates
```
_layouts/
├── home.html                     # Homepage template with search & categories
└── tool.html                    # Individual tool documentation template
```

#### `/_includes/` - Reusable Components  
```
_includes/
├── header.html                   # Navigation with global search
└── analytics.html               # Multi-platform tracking scripts
```

#### `/_sass/` - Custom Styling
```
_sass/
└── custom.scss                  # Dynatrace-branded responsive design
```

### 🗃️ `/dashboards/` - Dashboard Templates
**Purpose**: Pre-built Dynatrace dashboard configurations

```
dashboards/
├── [CARBON] Breakdown per Namespace.json
├── Databases.json
├── DBOM.json
├── Security findings.json
└── [4 more dashboard files]     # Ready-to-import dashboard templates
```

**Usage**: Import these JSON files directly into Dynatrace for instant monitoring dashboards.

### ⚡ `/workflows/` - Automation Templates
**Purpose**: Workflow automation configurations

```
workflows/
└── DQL_High_Alert_Usage.json    # High alert usage monitoring workflow
```

### 🤖 `/dynatrace-agent-rules/` - Agent Configuration
**Purpose**: Dynatrace agent rules and integration guidelines

```
dynatrace-agent-rules/
└── rules/
    ├── DynatraceMcpIntegration.md
    ├── DynatraceQueryLanguage.md
    ├── DynatraceSecurityCompliance.md
    └── [4 more rule files]      # Agent configuration guidelines
```

### 🚀 `/.github/workflows/` - CI/CD Automation
**Purpose**: GitHub Actions for automated deployment and testing

```
.github/workflows/
└── jekyll.yml                   # Automated Jekyll site deployment
```

**Features**: Automatic documentation site building and GitHub Pages deployment on every push.

### 🐳 Container & Deployment Files

- **`Dockerfile`**: Multi-stage container build with Node.js runtime
- **`.dockerignore`**: Excludes development files from container builds  
- **`makefile`**: Build automation commands (`make build`, `make test`, `make deploy`)

### 🔐 Configuration Files

- **`.env.template`**: Template for required environment variables (OAuth tokens, Dynatrace URLs)
- **`tsconfig.json`**: TypeScript compilation settings with strict type checking
- **`jest.config.js`**: Unit testing configuration with coverage reporting
- **`_config.yml`**: Jekyll site configuration with SEO, analytics, and branding

### 📋 Project Documentation

- **`README.md`**: Main project overview, installation, and usage instructions
- **`CHANGELOG.md`**: Version history with semantic versioning
- **`CONTRIBUTING.md`**: Developer contribution guidelines and code standards
- **`LICENSE`**: MIT license for open-source usage
- **`SECURITY.md`**: Security vulnerability reporting procedures

## 🔄 Build Process Flow

1. **Development**: Code in `/src/` using TypeScript
2. **Compilation**: `npm run build` compiles to `/dist/`
3. **Testing**: `npm test` runs Jest test suites  
4. **Documentation**: Jekyll builds from `/docs/` to website
5. **Deployment**: GitHub Actions deploys both server and docs

## 🎯 Key Integration Points

### MCP Server ↔ Dynatrace
- **Authentication**: OAuth 2.0 via `/src/authentication/`
- **API Calls**: Dynatrace SDK clients in each capability
- **Tools**: 23 specialized MCP tools in `/src/capabilities/`

### Documentation ↔ Jekyll
- **Content**: Markdown files in `/docs/`
- **Styling**: Custom SCSS with Dynatrace branding
- **Search**: Client-side JavaScript for real-time search
- **Analytics**: Multi-platform tracking integration

### CI/CD ↔ GitHub Actions
- **Triggers**: Push to main branch
- **Build**: Both TypeScript compilation and Jekyll site
- **Deploy**: Automated GitHub Pages deployment
- **Testing**: Automated unit test execution

## 📊 File Count Summary

| Directory | File Count | Purpose |
|-----------|------------|---------|
| `/src/` | 26 files | TypeScript source code |
| `/docs/` | 25 files | Documentation content |
| `/dashboards/` | 8 files | Dashboard templates |
| Root config | 15+ files | Project configuration |
| **Total** | **70+ files** | Complete MCP server solution |

---

**💡 Quick Navigation Tips**:
- **New to the project?** Start with `README.md` and `docs/getting-started.md`
- **Adding a tool?** Create files in `/src/capabilities/` and `/docs/`  
- **Updating docs?** Edit files in `/docs/` - Jekyll auto-builds
- **Need dashboards?** Import JSON files from `/dashboards/`
- **Deployment issues?** Check `.github/workflows/jekyll.yml`

This structure supports both the technical MCP server implementation and comprehensive user documentation, making it easy for developers and users to navigate and contribute to the project.
