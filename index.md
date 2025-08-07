---
layout: default
title: Dynatrace MCP Server
description: Bridge the gap between human language and Dynatrace monitoring capabilities
---

# Dynatrace MCP Server

<div class="matrix-rain"></div>

## 🎯 Mission: Decode Your Infrastructure

Welcome to the **Dynatrace Model Context Protocol Server** - where observability meets artificial intelligence in perfect harmony. Built on the cutting-edge MCP standard, this server transforms complex monitoring data into natural language interactions.

<div class="hero-section">
  <h2>🚀 INITIALIZING MCP SERVER...</h2>
  <p>Transform your Dynatrace monitoring experience with natural language AI interactions</p>
  
  <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
    <a href="{{ '/docs/getting-started/' | relative_url }}" class="btn">📚 Initialize Session</a>
    <a href="{{ '/about/' | relative_url }}" class="btn btn-secondary">ℹ️ System Info</a>
  </div>
</div>

## 🛠️ Available Modules

<div class="category-cards">
  <a href="{{ '/docs/mcp-tools#environment-setup' | relative_url }}" class="category-card">
    <div class="category-icon">🔧</div>
    <div>
      <div class="category-title">Environment & Setup</div>
      <div class="category-description">Initialize and configure your Dynatrace connection</div>
    </div>
  </a>

  <a href="{{ '/docs/mcp-tools#problem-incident' | relative_url }}" class="category-card">
    <div class="category-icon">🚨</div>
    <div>
      <div class="category-title">Problems & Incidents</div>
      <div class="category-description">Detect, analyze, and resolve operational issues</div>
    </div>
  </a>

  <a href="{{ '/docs/mcp-tools#security-vulnerability' | relative_url }}" class="category-card">
    <div class="category-icon">🔒</div>
    <div>
      <div class="category-title">Security & Vulnerabilities</div>
      <div class="category-description">Secure your infrastructure against threats</div>
    </div>
  </a>

  <a href="{{ '/docs/mcp-tools#entity-infrastructure' | relative_url }}" class="category-card">
    <div class="category-icon">🏢</div>
    <div>
      <div class="category-title">Entities & Infrastructure</div>
      <div class="category-description">Map and monitor your digital ecosystem</div>
    </div>
  </a>

  <a href="{{ '/docs/mcp-tools#data-analysis' | relative_url }}" class="category-card">
    <div class="category-icon">📊</div>
    <div>
      <div class="category-title">Data Analysis</div>
      <div class="category-description">Query and analyze with DQL intelligence</div>
    </div>
  </a>

  <a href="{{ '/docs/mcp-tools#dashboards-reporting' | relative_url }}" class="category-card">
    <div class="category-icon">📈</div>
    <div>
      <div class="category-title">Dashboards & Reporting</div>
      <div class="category-description">Visualize data with dynamic dashboards</div>
    </div>
  </a>

  <a href="{{ '/docs/mcp-tools#communication' | relative_url }}" class="category-card">
    <div class="category-icon">💬</div>
    <div>
      <div class="category-title">Communication</div>
      <div class="category-description">Notify teams across platforms</div>
    </div>
  </a>

  <a href="{{ '/docs/mcp-tools#advanced-operations' | relative_url }}" class="category-card">
    <div class="category-icon">⚡</div>
    <div>
      <div class="category-title">Advanced Operations</div>
      <div class="category-description">Execute custom logic and AI assistance</div>
    </div>
  </a>
</div>

## 🔍 Search the Matrix

<div class="search-container">
  <input type="text" id="search-input" placeholder="Search tools and documentation..." />
  <div id="search-results"></div>
</div>

## 🎮 Quick Start Sequence

```bash
# 1. Clone the repository
git clone https://github.com/theharithsa/dynatrace-mcp-otel.git

# 2. Navigate to directory
cd dynatrace-mcp-otel

# 3. Install dependencies
npm install

# 4. Configure environment
cp .env.template .env
# Edit .env with your Dynatrace credentials

# 5. Build and start
npm run build
npm start
```

## 🔗 System Architecture

The Dynatrace MCP Server operates as a bridge between:

- **🤖 AI Clients** - Claude, ChatGPT, and other MCP-compatible systems
- **🔌 MCP Protocol** - Standardized communication interface
- **📡 Dynatrace APIs** - Complete observability platform integration

## 📡 Network Protocols

| Protocol | Purpose | Status |
|----------|---------|--------|
| **MCP** | Model Context Protocol | `ONLINE` |
| **OAuth 2.0** | Dynatrace Authentication | `SECURE` |
| **HTTPS** | Encrypted Communication | `ACTIVE` |
| **WebSocket** | Real-time Data Streaming | `CONNECTED` |

---

<div style="text-align: center; margin: 3rem 0; padding: 2rem; background: linear-gradient(135deg, var(--hacker-grey), #21262d); border: 1px solid var(--hacker-green); border-radius: 8px;">
  <h3 style="color: var(--hacker-green); margin-bottom: 1rem;">🚀 Ready to hack the matrix?</h3>
  <p style="color: #8b949e; margin-bottom: 1.5rem;">Join the community of developers using AI-powered observability</p>
  <a href="{{ '/docs/getting-started/' | relative_url }}" class="btn">Access Granted →</a>
</div>

<script>
// Search functionality
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Tool data for search
const tools = [
  { name: 'Get Environment Info', category: 'Environment & Setup', description: 'Retrieve Dynatrace environment information', url: '{{ "/docs/get_environment_info/" | relative_url }}' },
  { name: 'List Problems', category: 'Problems & Incidents', description: 'List all operational problems', url: '{{ "/docs/list_problems/" | relative_url }}' },
  { name: 'Execute DQL', category: 'Data Analysis', description: 'Execute Dynatrace Query Language statements', url: '{{ "/docs/execute_dql/" | relative_url }}' },
  { name: 'Send Slack Message', category: 'Communication', description: 'Send notifications to Slack channels', url: '{{ "/docs/send_slack_message/" | relative_url }}' },
  { name: 'Chat with Davis CoPilot', category: 'Advanced Operations', description: 'AI-powered Dynatrace assistance', url: '{{ "/docs/chat_with_davis_copilot/" | relative_url }}' },
];

searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase();
  
  if (query.length < 2) {
    searchResults.style.display = 'none';
    return;
  }

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(query) ||
    tool.category.toLowerCase().includes(query) ||
    tool.description.toLowerCase().includes(query)
  );

  if (filteredTools.length > 0) {
    searchResults.innerHTML = filteredTools.map(tool => `
      <div class="search-result">
        <a href="${tool.url}">
          <strong>${tool.name}</strong>
          <span class="search-category">${tool.category}</span>
          <p>${tool.description}</p>
        </a>
      </div>
    `).join('');
    searchResults.style.display = 'block';
  } else {
    searchResults.innerHTML = '<div class="search-no-results">No tools found matching your search.</div>';
    searchResults.style.display = 'block';
  }
});

// Hide search results when clicking outside
document.addEventListener('click', function(e) {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.style.display = 'none';
  }
});
</script>
