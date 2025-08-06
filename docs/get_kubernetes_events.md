# Get Kubernetes Events Tool

## Overview

Retrieves all Kubernetes events from a specific Kubernetes cluster monitored by Dynatrace.

## Parameters

- `clusterId` (string, optional): The Kubernetes cluster UID (k8s.cluster.uid) - NOT the Dynatrace environment ID

## Best Practices for Prompts

### ✅ Good Examples

- "Get Kubernetes events for cluster k8s-cluster-uuid-12345"
- "Show me K8s events from the production cluster"
- "What events happened in my Kubernetes cluster?"
- "Retrieve cluster events for troubleshooting the pod failures"

### ❌ Avoid These

- Don't confuse cluster IDs with Dynatrace environment IDs
- Don't use cluster names instead of cluster UIDs
- Don't ask for events from multiple clusters at once

## What This Tool Returns

- Complete list of Kubernetes events from the specified cluster
- Event details including timestamps, reasons, and messages
- Pod, deployment, and service-related events
- System and application events

## Use Cases

- Kubernetes troubleshooting and debugging
- Understanding pod scheduling issues
- Investigating deployment failures
- Monitoring cluster health and stability
- Root cause analysis for K8s-related problems
- Compliance and audit trails

## Required Permissions

- `storage:events:read`

## Example Output

```text
Kubernetes Events:
[{"timestamp":"2024-01-15T10:30:00Z","reason":"FailedScheduling","message":"0/3 nodes are available: insufficient cpu","object":"Pod/payment-service-abc123"},{"timestamp":"2024-01-15T10:31:00Z","reason":"Scheduled","message":"Successfully assigned payment-service-abc123 to worker-node-2","object":"Pod/payment-service-abc123"}]
```

## Follow-up Actions

- Use `execute_dql` for more specific Kubernetes queries
- Use `get_entity_details` to understand related K8s entities
- Use `send_slack_message` to notify teams about critical events
- Use with `get_problem_details` to correlate events with operational issues

## Finding Cluster IDs

To find your cluster UID:

1. Navigate to Infrastructure > Kubernetes in Dynatrace UI
2. Select your cluster
3. Look for `k8s.cluster.uid` in the cluster properties
4. Or use DQL: `fetch dt.entity.kubernetes_cluster | fields entity.name, k8s.cluster.uid`

## Common Kubernetes Event Types

- **FailedScheduling**: Pods can't be scheduled to nodes
- **ImagePullBackOff**: Container images can't be pulled
- **CrashLoopBackOff**: Containers keep crashing
- **OutOfMemory**: Containers exceed memory limits
- **NetworkNotReady**: Network issues in the cluster
- **NodeNotReady**: Node availability problems

## Integration with DQL

For more advanced Kubernetes analysis, use `execute_dql`:

```dql
fetch events
| filter k8s.cluster.name == "production-cluster"
| filter event.kind == "Warning"
| summarize count(), by:{event.reason}
```
