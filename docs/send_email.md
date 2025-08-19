---
layout: tool
title: send_email
description: Send emails via Dynatrace Email API with comprehensive formatting support
category: Communication
---

# send_email

Send emails via Dynatrace Email API with support for multiple recipients, content types, and comprehensive error handling.

## Purpose

The `send_email` tool enables AI assistants to send professional emails directly through Dynatrace's Email API, supporting both plain text and HTML content with advanced recipient management and delivery tracking.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `toRecipients` | array[string] | ✅ | Array of email addresses for primary recipients |
| `ccRecipients` | array[string] | ❌ | Array of email addresses for CC recipients |
| `bccRecipients` | array[string] | ❌ | Array of email addresses for BCC recipients |
| `subject` | string | ✅ | Email subject line |
| `body` | string | ✅ | Email body content |
| `contentType` | enum | ❌ | Content type: `text/plain` (default) or `text/html` |
| `notificationSettingsUrl` | string | ❌ | Optional notification settings URL (must be in tenant domain) |

## Requirements

### OAuth Scopes
- `email:emails:send` - Required for email functionality

### Tenant Requirements
- **License**: PAYING or POC environment required
- **Recipients**: Maximum 100 total across all fields (to, cc, bcc)
- **Payload Size**: Maximum 262KB total size
- **Domain Validation**: Notification URLs must be in tenant domain

## Usage Examples

### Basic Email
```json
{
  "tool": "send_email",
  "arguments": {
    "toRecipients": ["team@company.com"],
    "subject": "System Alert",
    "body": "Critical issue detected in production environment",
    "contentType": "text/plain"
  }
}
```

### HTML Email with Multiple Recipients
```json
{
  "tool": "send_email",
  "arguments": {
    "toRecipients": ["alerts@company.com", "oncall@company.com"],
    "ccRecipients": ["manager@company.com"],
    "bccRecipients": ["audit@company.com"],
    "subject": "🚨 Production Alert - Immediate Action Required",
    "body": "<h1>Critical Alert</h1><p>High CPU usage detected on <strong>web-server-01</strong></p><ul><li>Current: 95%</li><li>Threshold: 80%</li><li>Duration: 15 minutes</li></ul>",
    "contentType": "text/html",
    "notificationSettingsUrl": "https://your-tenant.apps.dynatrace.com/platform/settings"
  }
}
```

### Markdown-Formatted Email
```json
{
  "tool": "send_email",
  "arguments": {
    "toRecipients": ["team@company.com"],
    "subject": "Weekly Performance Report",
    "body": "# Weekly Performance Summary\n\n## Key Metrics\n\n- **Response Time**: 150ms (-16.7%)\n- **Error Rate**: 0.2% (-60%)\n- **Uptime**: 99.9% (+0.1%)\n\n## Actions Taken\n\n1. **Database optimization** reduced query times\n2. **Caching implementation** improved response times\n3. **Error handling** enhanced system stability\n\n---\n\n*Generated automatically by Dynatrace MCP Server*",
    "contentType": "text/plain"
  }
}
```

## Response Format

### Success Response
```json
{
  "requestId": "6f94e216-9f8f-4971-b16d-e7d32c008437",
  "message": "Email request accepted for at least one recipient",
  "rejectedDestinations": {
    "bouncingDestinations": [],
    "complainingDestinations": []
  },
  "invalidDestinations": []
}
```

### Error Responses

#### Too Many Recipients (400)
```
Failed to send email (400): Too many recipients, current number of recipients is 101, maximum allowed is 100
```

#### Insufficient Permissions (403)
```
Failed to send email (403): Tenant abc12345 is not authorized to perform requested operation. Tenant's license is not PAYING or it's not POC environment.
```

#### Rate Limited (429)
```
Failed to send email (429): Too Many Requests - Retry after 39 seconds
```

## Content Formatting

### Plain Text (`text/plain`)
- Supports markdown-style formatting
- Line breaks with `\n`
- Lists with `-` or `*`
- Emphasis with `*italic*` and `**bold**`

### HTML (`text/html`)
- Full HTML support
- Inline CSS recommended
- Tables, lists, and rich formatting
- Embedded images via data URLs

## Best Practices

### Subject Lines
- Keep under 50 characters for mobile readability
- Use emojis sparingly for visual appeal
- Include severity indicators for alerts (🚨, ⚠️, ✅)

### Content Structure
- **Lead with key information** in the first paragraph
- **Use clear headings** to organize content
- **Include actionable items** with specific next steps
- **Add timestamps** for time-sensitive information

### Recipient Management
- **Validate email addresses** before sending
- **Use CC sparingly** - only for stakeholders who need visibility
- **Use BCC for large distribution lists** to protect privacy
- **Consider notification preferences** and time zones

### Error Handling
- **Check response for rejected destinations**
- **Implement retry logic** for rate limiting
- **Log request IDs** for audit trails
- **Handle bounced emails** gracefully

## Integration Patterns

### Alert Notifications
```javascript
// Send critical alert with escalation
{
  "toRecipients": ["oncall@company.com"],
  "ccRecipients": ["team-lead@company.com"],
  "subject": "🚨 Critical: High Memory Usage - Action Required",
  "body": "**Alert**: Memory usage on production server exceeded 90%\n\n**Details**:\n- Server: web-prod-01\n- Current Usage: 94%\n- Threshold: 85%\n- Started: 2 minutes ago\n\n**Next Steps**:\n1. Check application logs\n2. Review memory allocation\n3. Consider scaling if issue persists\n\n**Escalation**: If not resolved in 15 minutes, escalate to on-call engineer.",
  "contentType": "text/plain"
}
```

### Report Distribution
```javascript
// Send weekly performance report
{
  "toRecipients": ["stakeholders@company.com"],
  "ccRecipients": ["engineering@company.com"],
  "subject": "📊 Weekly Performance Report - Week of Aug 19, 2025",
  "body": "<h1>Performance Summary</h1><table><tr><th>Metric</th><th>This Week</th><th>Change</th></tr><tr><td>Response Time</td><td>150ms</td><td style='color:green'>-16.7%</td></tr></table>",
  "contentType": "text/html"
}
```

## Security Considerations

### Data Protection
- **Avoid sensitive data** in email content
- **Use secure communication channels** for confidential information
- **Audit email content** before sending
- **Consider data retention policies**

### Authentication
- **OAuth tokens** are automatically managed
- **Tenant validation** ensures proper authorization
- **Domain validation** for notification URLs
- **Request tracking** via unique request IDs

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 403 Forbidden | Missing `email:emails:send` scope | Add scope to OAuth client |
| 403 Forbidden | Non-paying tenant | Upgrade to PAYING license or use POC |
| 400 Bad Request | Too many recipients | Reduce total recipients to ≤100 |
| 413 Payload Too Large | Email content >262KB | Reduce content size or use links |
| 429 Rate Limited | Too many requests | Implement retry with backoff |

### Debugging Tips
- **Check request ID** in response for tracking
- **Validate email addresses** before sending
- **Test with small recipient lists** first
- **Monitor for bounced destinations** in response

## Related Documentation

- [Dynatrace Email API Documentation](https://docs.dynatrace.com/docs/platform-modules/email)
- [Email Formatting Guide](/dynatrace-agent-rules/rules/DynatraceEmailFormatting.md)
- [OAuth Configuration Guide](/getting-started#authentication)
- [Communication Tools Overview](/tools#communication)
