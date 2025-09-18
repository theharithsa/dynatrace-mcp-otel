# Dynatrace Email Formatting Guide

This guide provides comprehensive formatting options for email content when using the Dynatrace Email API via the MCP server's `send_email` tool.

## Text Formatting

### Italics

Wrap text in single asterisks to emphasize text:

```
*This text will be italicized*
```

Result: _This text will be italicized_

### Bold

Wrap text in double asterisks for strong emphasis:

```
**This text will be bold**
```

Result: **This text will be bold**

### Strikethrough

Wrap text in double tildes for crossed-out text:

```
~~This text will be crossed out~~
```

Result: ~~This text will be crossed out~~

### Code Formatting

For inline code, wrap text in backticks:

```
`This is inline code`
```

Result: `This is inline code`

For code blocks (multiple lines), use triple backticks:

````
```
This is a code block
Multiple lines supported
```
````

## Document Structure

### Headings

Create headings using the `#` character:

```
# Main Heading (H1)
## Sub Heading (H2)
### Section Heading (H3)
#### Subsection Heading (H4)
```

### Horizontal Line

Add visual separation with three dashes:

```
---
```

Result: A horizontal line separator

### Line Breaks

- Single line break: Press Enter once
- Paragraph break: Press Enter twice

## Lists

### Unordered Lists (Bulleted)

Use asterisks or dashes:

```
* First item
* Second item
* Third item
```

Or:

```
- First item
- Second item
- Third item
```

### Ordered Lists (Numbered)

Use numbers with periods:

```
1. First step
2. Second step
3. Third step
```

## Tables

Create tables with pipes (`|`) and dashes:

```
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |
| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |
```

## Links

Create clickable links using bracket notation:

```
[Link text](https://www.example.com)
[Dynatrace Documentation](https://docs.dynatrace.com)
```

## Email API Integration

### Content Types

The Dynatrace Email API supports two content types:

#### Plain Text (`text/plain`)

```typescript
{
  "contentType": "text/plain",
  "body": "This is plain text content with basic formatting."
}
```

#### HTML (`text/html`)

```typescript
{
  "contentType": "text/html",
  "body": "<h1>HTML Content</h1><p>This supports full HTML formatting.</p>"
}
```

### Email Recipients

#### Required Fields

At least one recipient type must be specified:

```typescript
{
  "toRecipients": ["user1@company.com", "user2@company.com"],
  "ccRecipients": ["manager@company.com"],           // Optional
  "bccRecipients": ["admin@company.com"],            // Optional
  "subject": "Your email subject",
  "body": {
    "contentType": "text/plain",
    "body": "Your formatted email content"
  },
  "notificationSettingsUrl": "https://tenant.dynatrace.com/settings" // Optional
}
```

#### Recipient Limits

- **Maximum recipients**: 100 total across all fields (to, cc, bcc)
- **Minimum recipients**: 1 (in any field)

### Sending JSON Data

When including JSON data in email content, properly format it as a string:

#### For Workflow Results

```
{{ result("previous_action") | to_json }}
```

#### For Complex Data

```typescript
{
  "body": {
    "contentType": "text/plain",
    "body": JSON.stringify(yourDataObject, null, 2)
  }
}
```

## Error Handling

### Common Status Codes

- **202**: Email accepted successfully
- **400**: Bad request (too many recipients, invalid format)
- **401**: Authentication failed
- **403**: Insufficient permissions or non-paying tenant
- **413**: Payload too large (>262KB)
- **429**: Rate limit exceeded
- **500**: Internal server error
- **503**: Service under maintenance

### Best Practices

1. **Validate recipients** before sending
2. **Keep content under 262KB** total size
3. **Use meaningful subjects** for better deliverability
4. **Include notification settings URL** for tenant domain compliance
5. **Handle bounced/complaining destinations** in response

## Advanced Examples

### Alert Notification Email

```typescript
{
  "toRecipients": ["oncall@company.com"],
  "ccRecipients": ["team-lead@company.com"],
  "subject": "🚨 Critical Alert: High CPU Usage Detected",
  "body": {
    "contentType": "text/plain",
    "body": `
# Alert Summary

**Severity**: Critical
**Entity**: web-server-01
**Metric**: CPU Usage
**Current Value**: 95%
**Threshold**: 80%

## Details
- **Time**: ${new Date().toISOString()}
- **Duration**: 15 minutes
- **Impact**: Response time increased by 200%

## Recommended Actions
1. Check system resources
2. Review application logs
3. Consider scaling if needed

---
*This alert was generated automatically by Dynatrace*
    `
  },
  "notificationSettingsUrl": "https://your-tenant.apps.dynatrace.com/platform/settings"
}
```

### HTML Report Email

```typescript
{
  "toRecipients": ["reports@company.com"],
  "subject": "Weekly Performance Report",
  "body": {
    "contentType": "text/html",
    "body": `
<html>
<body>
  <h1>📊 Weekly Performance Report</h1>

  <h2>Summary</h2>
  <table border="1" style="border-collapse: collapse;">
    <tr>
      <th>Metric</th>
      <th>This Week</th>
      <th>Last Week</th>
      <th>Change</th>
    </tr>
    <tr>
      <td>Response Time</td>
      <td>150ms</td>
      <td>180ms</td>
      <td style="color: green;">-16.7%</td>
    </tr>
    <tr>
      <td>Error Rate</td>
      <td>0.2%</td>
      <td>0.5%</td>
      <td style="color: green;">-60%</td>
    </tr>
  </table>

  <h2>Key Improvements</h2>
  <ul>
    <li><strong>Database optimization</strong> reduced query times</li>
    <li><strong>Caching implementation</strong> improved response times</li>
    <li><strong>Error handling</strong> enhanced stability</li>
  </ul>

  <hr>
  <p><em>Generated by Dynatrace MCP Server</em></p>
</body>
</html>
    `
  }
}
```

## Limitations

### HTML Support

- **No HTML support** in plain text mode
- **Full HTML support** when using `text/html` content type
- **Inline CSS recommended** for styling (external stylesheets may not work)

### Character Encoding

- **UTF-8 encoding** required
- **Special characters** supported
- **Emoji support** available

### Security Considerations

- Email content is **not encrypted** in transit beyond standard TLS
- **Sensitive data** should be avoided or properly secured
- **Tenant domain validation** applies to notification URLs

---

_For more information, see the [Dynatrace Email API Documentation](https://docs.dynatrace.com/docs/platform-modules/email)_
