# Send Slack Message Tool

## Overview

Sends messages to Slack channels via Dynatrace's Slack connector integration.

## Parameters

- `channel` (string, optional): The Slack channel name or ID to send the message to
- `message` (string, optional): The message content to send

## Best Practices for Prompts

### ✅ Good Examples

- "Send a message to #alerts channel about the database issue"
- "Notify the dev team in #development that the deployment is complete"
- "Send 'Critical vulnerability detected in production' to #security"
- "Alert #ops channel about the high CPU usage"

### ❌ Avoid These

- Don't forget to specify both channel and message
- Don't use private channel IDs without proper permissions
- Don't send overly long messages (Slack has limits)

## What This Tool Returns

- Confirmation that the message was sent successfully
- JSON response from Slack API with delivery details

## Use Cases

- Incident notifications and alerts
- Status updates to teams
- Automated reporting
- Integration with problem and vulnerability workflows
- Team coordination during outages
- Deployment notifications

## Required Permissions

- `app-settings:objects:read`
- Properly configured Slack connector in Dynatrace

## Prerequisites

- Slack connector must be configured in your Dynatrace environment
- Bot must have permissions to post in the target channel
- Channel names should include the # prefix for public channels

## Example Output

```text
Message sent to Slack channel: {"ok":true,"channel":"C1234567890","ts":"1640995200.003100"}
```

## Follow-up Actions

- Use with `get_problem_details` to send detailed incident reports
- Use with `get_vulnerability_details` to notify about security issues
- Use with `get_ownership` to mention responsible teams
- Combine with `list_problems` or `list_vulnerabilities` for status updates

## Channel Naming

- Public channels: `#general`, `#alerts`, `#development`
- Private channels: Use channel ID (e.g., `C1234567890`)
- Direct messages: Use user ID (e.g., `U1234567890`)

## Message Formatting

Slack supports rich formatting:

- **Bold**: `*bold text*`
- _Italic_: `_italic text_`
- Code: `` `code` ``
- Links: `<https://example.com|Link text>`
