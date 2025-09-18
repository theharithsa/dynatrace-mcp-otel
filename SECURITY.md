# Security Policy

This document outlines security practices, vulnerability reporting, and best practices for the Dynatrace MCP Server.

## 🔐 Security Features in v2.5.0

### Dual Authentication Architecture

- **Token Separation**: Clear separation between OAuth tokens, API tokens, and platform tokens
- **Scope-Based Access**: Granular permissions with minimal required scopes
- **Automatic Routing**: Intelligent routing to appropriate authentication methods
- **Secure Defaults**: No sensitive data exposure in logs or error messages

### Security Enhancements

- **Environment Variable Validation**: Strict validation of all authentication tokens
- **Rate Limiting Awareness**: Respect for Dynatrace API rate limits
- **Error Sanitization**: Sensitive information removed from error responses
- **Audit Logging**: Comprehensive logging for security monitoring

## 🛡️ Security Best Practices

### Authentication Token Management

#### OAuth Client Credentials

```bash
# Secure token format validation
OAUTH_CLIENT_ID="dt0s02.ABC123..."          # ✅ Correct format
OAUTH_CLIENT_SECRET="dt0s02.ABC123.DEF456..."# ✅ Correct format

# Avoid these patterns
OAUTH_CLIENT_ID="plaintext-id"              # ❌ Wrong format
OAUTH_CLIENT_SECRET="simple-secret"         # ❌ Wrong format
```

#### API Token Security

```bash
# Use appropriate token types
DT_API_TOKEN="dt0c01.XYZ789..."            # ✅ API token for entities
DT_PLATFORM_TOKEN="dt0s16.PLATFORM123..."  # ✅ Platform token for info

# Never mix token types
DT_API_TOKEN="dt0s02.CLIENT_ID"            # ❌ Wrong token type
```

### Scope Minimization

Only grant necessary scopes for your use case:

**Minimal Setup (Read-only):**

```
storage:*:read
environment-api:problems:read
environment-api:entities:read
```

**Standard Setup (Most features):**

```
davis-copilot:*:execute
app-engine:*:run
storage:*:read
environment-api:*:read
document:documents:write
```

**Full Access (All features):**

```
davis-copilot:*:execute
app-engine:*:run
storage:*:read
environment-api:*:*
document:*:*
automation:*:*
email:emails:send
```

### Environment Security

#### Production Environments

```json
{
  "env": {
    "OAUTH_CLIENT_ID": "dt0s02.PRODUCTION_ID",
    "OAUTH_CLIENT_SECRET": "dt0s02.PRODUCTION_SECRET",
    "DT_ENVIRONMENT": "https://prod.apps.dynatrace.com",
    "NODE_ENV": "production",
    "DT_MCP_DISABLE_TELEMETRY": "false"
  }
}
```

#### Development Environments

```json
{
  "env": {
    "OAUTH_CLIENT_ID": "dt0s02.DEV_ID",
    "OAUTH_CLIENT_SECRET": "dt0s02.DEV_SECRET",
    "DT_ENVIRONMENT": "https://dev.apps.dynatrace.com",
    "NODE_ENV": "development",
    "DT_MCP_DISABLE_TELEMETRY": "true"
  }
}
```

### Network Security

- **HTTPS Only**: All communications use TLS encryption
- **Certificate Validation**: Strict certificate validation for Dynatrace APIs
- **No Proxy Support**: Direct connections to Dynatrace endpoints only
- **Rate Limit Compliance**: Built-in respect for API rate limits

### Data Privacy

- **No Data Persistence**: MCP server doesn't store or cache sensitive data
- **In-Memory Only**: All operations use in-memory processing
- **Minimal Logging**: Only essential operational data logged
- **Token Masking**: Authentication tokens masked in all log outputs

## 🚨 Security Vulnerabilities

This page borrows parts of its contents from <https://kubernetes.io/security/>

## Report a Vulnerability

We are extremely grateful for security researchers and users that report vulnerabilities to the Dynatrace Open Source Community. All reports are thoroughly investigated by a set of community members.

To make a report, submit your vulnerability to <opensource@dynatrace.com>. This allows triage and handling of the vulnerability within an appropriate timeframe and best effort.
If you would like to use encryption for your message, please first reach out to request a PGP key.

### When Should I Report a Vulnerability?

- You think you discovered a potential security vulnerability in our Open Source projects
- You are unsure how a vulnerability affects our Open Source Projects
- You think you discovered a vulnerability in another project that our Open Source projects depends on. For projects with their own vulnerability reporting and disclosure process, please report it directly there.

### When Should I NOT Report a Vulnerability?

- You need help tuning one of our our Open Source projects for security - please discuss this with the maintainers of said project
- You need help applying security-related updates
- Your issue is not security-related

## Security Vulnerability Response

Each report is acknowledged and analyzed by the security contacts within an appropriate timeframe. This will set off the [Security Release Process](#process).

Any vulnerability information shared with the Dynatrace Open Source Community stays within Dynatrace Open Source Community and will not be disseminated to other projects unless it is necessary to get the issue fixed.

## Public Disclosure Timing

A public disclosure date is negotiated by the Dynatrace Open Source Community and the bug submitter. We prefer to fully disclose the bug as soon as possible once a user mitigation is available. It is reasonable to delay disclosure when the bug or the fix is not yet fully understood, the solution is not well-tested, or for vendor coordination. The timeframe for disclosure is from immediate (especially if it is already publicly known) to a few weeks. For a vulnerability with a straightforward mitigation, we expect report date to disclosure date to be on the order of 7 days. The Dynatrace Open Source Community holds the final say when setting a disclosure date.

## Process

If you find a security-related bug in a Dynatrace Open Source project, we kindly ask you for responsible disclosure and for giving us appropriate time to react, analyze, and develop a fix to mitigate the found security vulnerability. The security contact will investigate the issue within an appropriate timeframe.

The team will react promptly to fix the security issue and its workaround/fix will be published along with a classification of the security issue.
