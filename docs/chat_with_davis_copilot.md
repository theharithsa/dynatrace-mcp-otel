# Chat with Davis CoPilot Tool

## Overview

Interactive AI assistant for Dynatrace-related questions, troubleshooting, and guidance using Davis CoPilot. This is your go-to tool when no other specific tool matches your needs.

## Parameters

- `text` (string, required): Your question or request for Davis CoPilot
- `context` (string, optional): Additional context to provide more information
- `instruction` (string, optional): Specific instructions for how to format the response

## Best Practices for Prompts

### ✅ Good Examples

- "How do I troubleshoot high memory usage on my Kubernetes cluster?"
- "What's the best way to set up alerting for database performance issues?"
- "Explain the difference between synthetic and real user monitoring"
- "Help me understand why my service is showing high response times"

### ❌ Avoid These

- Don't ask questions unrelated to Dynatrace or monitoring
- Don't expect specific data queries (use DQL tools for that)
- Don't ask for credentials or sensitive configuration details

## What This Tool Returns

- Detailed AI-powered response to your question
- Status of the conversation
- Message token for tracking
- Source references when available
- Conversation ID for follow-up questions

## Use Cases

- General Dynatrace guidance and best practices
- Troubleshooting monitoring issues
- Learning about Dynatrace features and capabilities
- Getting recommendations for monitoring setup
- Understanding monitoring concepts and methodologies
- Problem diagnosis and resolution guidance

## Required Permissions

- `davis-copilot:conversations:execute`

## Example Output

```text
🤖 Davis CoPilot Response:

**Your Question:** "How do I troubleshoot high memory usage on my Kubernetes cluster?"

**Answer:**
To troubleshoot high memory usage in your Kubernetes cluster, follow these steps:

1. **Identify the Source**: Use the Kubernetes overview in Dynatrace to see which pods or nodes are consuming the most memory.

2. **Analyze Workload Distribution**: Check if memory usage is concentrated on specific nodes or distributed across the cluster.

3. **Review Resource Limits**: Verify that your pods have appropriate memory limits and requests configured.

4. **Monitor Memory Trends**: Look at memory usage patterns over time to identify if this is a gradual increase or sudden spike.

5. **Check for Memory Leaks**: Use Dynatrace's application monitoring to identify potential memory leaks in your applications.

**Status:** SUCCESSFUL
**Message Token:** msg_ghi789

**Sources:**
- Kubernetes monitoring best practices: https://dt-url.net/k8s-monitoring
- Memory troubleshooting guide: https://dt-url.net/memory-troubleshooting

**Conversation ID:** conv_abc123
```

## Context Usage

Provide additional context for more specific answers:

```text
Context: "I have a production e-commerce application with 50 microservices running on AWS EKS"
Question: "How should I set up monitoring for this environment?"
```

This helps Davis CoPilot provide more targeted and relevant advice.

## Instruction Usage

Control response formatting:

```text
Instruction: "Provide a step-by-step checklist with action items"
Question: "How do I optimize my dashboard for executive reporting?"
```

## Question Categories

### Troubleshooting

- Performance issues
- Alert configuration problems
- Data collection issues
- Integration challenges

### Best Practices

- Monitoring strategy
- Dashboard design
- Alert policies
- Maintenance procedures

### Feature Guidance

- How to use specific Dynatrace features
- Configuration recommendations
- Integration setup
- Optimization techniques

### Learning and Concepts

- Understanding monitoring metrics
- Learning Dynatrace terminology
- Monitoring methodology
- Industry best practices

## Advanced Usage

### Follow-up Questions

Use the conversation ID for related follow-up questions to maintain context.

### Specific Scenarios

Provide detailed scenario context for more precise guidance.

### Multi-step Processes

Ask for guidance on complex procedures that involve multiple steps.

## When to Use This Tool

Use `chat_with_davis_copilot` when:

- No specific tool matches your needs
- You need general guidance or advice
- You're troubleshooting complex issues
- You want to learn about Dynatrace concepts
- You need recommendations for your monitoring setup

Use other tools when:

- You need specific data (use DQL tools)
- You want to perform actions (use action tools)
- You have specific entity or problem IDs (use detail tools)

## Tips for Better Responses

- Be specific about your environment and use case
- Include relevant context about your setup
- Mention any constraints or requirements
- Ask follow-up questions for clarification
- Provide feedback on the usefulness of responses

## Example Conversations

### Infrastructure Monitoring

**Question**: "What metrics should I monitor for a Node.js application?"

**Context**: "Production environment with microservices architecture"

**Expected Response**: Guidance on key Node.js metrics, performance indicators, and monitoring best practices.

### Alert Configuration

**Question**: "How do I reduce alert noise while maintaining coverage?"

**Instruction**: "Provide specific configuration steps"

**Expected Response**: Step-by-step guidance for alert optimization and noise reduction strategies.

### Dashboard Design

**Question**: "What makes an effective executive dashboard?"

**Context**: "Need to show business impact of IT issues"

**Expected Response**: Best practices for executive-level monitoring dashboards with business context.

## Integration with Other Tools

### Learning Workflow

1. `chat_with_davis_copilot` - Get conceptual understanding
2. `generate_dql_from_natural_language` - Create specific queries
3. `execute_dql` - Implement monitoring queries
4. `create_dashboard` - Build visualizations

### Troubleshooting Workflow

1. `chat_with_davis_copilot` - Get troubleshooting guidance
2. `list_problems` or `list_vulnerabilities` - Identify issues
3. `get_problem_details` - Analyze specific issues
4. `send_slack_message` - Communicate findings

## Conversation Management

- **Single Questions**: Use for one-off guidance requests
- **Follow-up Questions**: Reference conversation ID for context
- **Complex Topics**: Break into multiple focused questions
- **Documentation**: Save useful responses for future reference

## Best Practices

### Question Formulation

- Be specific about your environment and constraints
- Include relevant technical details
- Specify the type of guidance you need
- Mention your experience level with Dynatrace

### Context Providing

- Describe your infrastructure setup
- Mention specific technologies in use
- Include business requirements or constraints
- Reference any existing monitoring setup

### Response Utilization

- Follow recommended action steps
- Ask clarifying questions if needed
- Integrate advice with other tool capabilities
- Document useful patterns for team knowledge
