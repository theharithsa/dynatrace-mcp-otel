# Migration Guide: v2.3.0 → v2.5.0

This guide helps you migrate from Dynatrace MCP Server v2.3.0 to v2.5.0, which introduces significant improvements including Davis CoPilot AI integration and enhanced authentication.

## 🚀 What's New in v2.5.0

### Major Features

- **🤖 Davis CoPilot AI Integration**: Natural language to DQL conversion, AI explanations, and intelligent conversations
- **🔐 Dual Authentication Architecture**: Support for OAuth, API tokens, and platform tokens with automatic routing
- **🏷️ Enhanced Entity Tagging**: Streamlined entity tagging using entity IDs for maximum reliability
- **📊 Environment Management**: New tools for environment information and platform operations
- **⚡ 96% Tool Success Rate**: 26/27 tools fully functional with comprehensive testing

## 🔧 Breaking Changes

### 1. Entity Tagging Tool Changes

**Old Usage (v2.3.0):**

```typescript
// Used entity name with complex search logic
add_entity_tags({
  entityName: 'my-application-name',
  tags: [{ key: 'environment', value: 'production' }],
});
```

**New Usage (v2.5.0):**

```typescript
// Step 1: Find entity ID using DQL
execute_dql({
  dqlStatement: "fetch dt.entity.application | filter contains(entity.name, 'my-application-name') | limit 1",
});
// Returns: {"entity.name": "my-application-name", "id": "APPLICATION-ABC123"}

// Step 2: Use entity ID directly (more reliable)
add_entity_tags({
  entityId: 'APPLICATION-ABC123',
  tags: [{ key: 'environment', value: 'production' }],
});
```

**Migration Benefits:**

- ✅ Works with ALL entity types (not just predefined ones)
- ✅ More reliable and faster execution
- ✅ No complex entity name matching logic
- ✅ Cleaner, professional implementation

## 🔄 Migration Steps

### Step 1: Update Package Version

```bash
# If using npx (recommended)
# No action needed - npx always uses latest version

# If installed globally, update
npm install -g @theharithsa/dynatrace-mcp-server@2.5.0

# If installed locally, update package.json
npm install @theharithsa/dynatrace-mcp-server@2.5.0
```

### Step 2: Update MCP Configuration

**Minimal Configuration (Works with existing setup):**

```json
{
  "mcpServers": {
    "dynatrace": {
      "command": "npx",
      "args": ["@theharithsa/dynatrace-mcp-server"],
      "env": {
        "OAUTH_CLIENT_ID": "dt0s02.your-client-id",
        "OAUTH_CLIENT_SECRET": "dt0s02.your-client-secret",
        "DT_ENVIRONMENT": "https://your-tenant.apps.dynatrace.com"
      }
    }
  }
}
```

**Enhanced Configuration (All features):**

```json
{
  "mcpServers": {
    "dynatrace": {
      "command": "npx",
      "args": ["@theharithsa/dynatrace-mcp-server"],
      "env": {
        "OAUTH_CLIENT_ID": "dt0s02.your-client-id",
        "OAUTH_CLIENT_SECRET": "dt0s02.your-client-secret",
        "DT_ENVIRONMENT": "https://your-tenant.apps.dynatrace.com",
        "DT_API_TOKEN": "dt0c01.your-api-token",
        "DT_PLATFORM_TOKEN": "dt0s16.your-platform-token"
      }
    }
  }
}
```

### Step 3: Update OAuth Scopes

Add these new scopes to your OAuth client for Davis CoPilot features:

```
davis-copilot:nl2dql:execute
davis-copilot:dql2nl:execute
davis-copilot:conversations:execute
```

**How to update:**

1. Go to **Settings** → **Platform Management** → **OAuth clients**
2. Edit your existing client
3. Add the new Davis CoPilot scopes
4. Save changes

### Step 4: Update Entity Tagging Usage

**Find and Replace Pattern:**

```typescript
// OLD: Search by name (remove this pattern)
add_entity_tags({
  entityName: "entity-name",
  tags: [...]
})

// NEW: Use entity ID (replace with this pattern)
// 1. First, find entity ID
execute_dql({
  dqlStatement: "fetch dt.entity.application | filter contains(entity.name, 'entity-name') | limit 1"
})

// 2. Then, use entity ID for tagging
add_entity_tags({
  entityId: "ENTITY-ID-FROM-STEP-1",
  tags: [...]
})
```

## 🆕 New Features Usage

### Davis CoPilot AI Integration

```typescript
// Generate DQL from natural language
generate_dql_from_natural_language({
  text: 'Show me all Java applications with high CPU usage in the last hour',
});

// Get AI explanations of complex DQL
explain_dql_in_natural_language({
  dql: "fetch dt.entity.service | filter service.technology == 'JAVA' | expand problems",
});

// Chat with Davis CoPilot for troubleshooting
chat_with_davis_copilot({
  text: 'How do I optimize database performance in my application?',
  context: "We're seeing high response times during peak hours",
});
```

### Environment Information

```typescript
// Get detailed environment information
get_environment_info();
// Returns environment ID, state, URLs, and configuration details
```

## 🔍 Verification Steps

### 1. Test Basic Functionality

```typescript
// Verify authentication works
get_environment_info();

// Test DQL execution
execute_dql({
  dqlStatement: 'fetch dt.entity.application | limit 1',
});
```

### 2. Test Davis CoPilot Features

```typescript
// Test natural language conversion
generate_dql_from_natural_language({
  text: 'Show me all hosts',
});

// Test AI conversations
chat_with_davis_copilot({
  text: 'What is Dynatrace?',
});
```

### 3. Test Entity Tagging

```typescript
// Find an entity
execute_dql({
  dqlStatement: 'fetch dt.entity.application | limit 1',
});

// Tag the entity using its ID
add_entity_tags({
  entityId: 'APPLICATION-XXXXXX', // Use actual ID from previous step
  tags: [{ key: 'migration-test', value: 'v2.5.0' }],
});
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Authentication Errors

```
Error: 403 Forbidden
```

**Solution:** Update OAuth client with new Davis CoPilot scopes

#### 2. Entity Tagging Errors

```
Error: entityName parameter required
```

**Solution:** Update to use `entityId` parameter instead of `entityName`

#### 3. Environment Variable Issues

```
Error: Missing DT_ENVIRONMENT
```

**Solution:** Ensure environment URL points to `apps.dynatrace.com`

### Getting Help

If you encounter issues during migration:

1. **Check the logs**: Look for specific error messages
2. **Verify scopes**: Ensure OAuth client has all required permissions
3. **Test incrementally**: Test each feature individually
4. **Review examples**: Check the updated documentation for correct usage patterns

## 📈 Performance Improvements

v2.5.0 delivers significant performance improvements:

- **26/27 tools working** (96% success rate)
- **Faster entity operations** with direct entity ID usage
- **Reduced API calls** through intelligent authentication routing
- **Better error handling** with clearer error messages
- **Enhanced reliability** through comprehensive testing

## 🎯 Next Steps

After migration:

1. **Explore Davis CoPilot**: Try natural language queries and AI conversations
2. **Update workflows**: Replace entity name searches with entity ID usage
3. **Enhance monitoring**: Use new environment information tools
4. **Optimize authentication**: Configure appropriate token types for your use case

Welcome to Dynatrace MCP Server v2.5.0! 🚀
