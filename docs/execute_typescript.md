# Execute TypeScript Tool

## Overview

Executes TypeScript code using Dynatrace's Function Executor API, allowing custom logic and data processing within the Dynatrace environment.

## Parameters

- `sourceCode` (string, required): TypeScript code in `export default async function ({...})` format
- `payload` (object, required): Input data object passed to the function

## Best Practices for Prompts

### ✅ Good Examples

- "Execute TypeScript code to process the metrics data"
- "Run custom analysis function on the problem data"
- "Execute data transformation logic with payload {input: 'test'}"
- "Process the vulnerability data using custom TypeScript function"

### ❌ Avoid These

- Don't submit code without proper function export format
- Don't include sensitive credentials in source code
- Don't expect synchronous execution of long-running operations
- Don't use this for simple data queries (use DQL instead)

## What This Tool Returns

- Function execution results as JSON
- Processed data from the TypeScript function
- Error messages if execution fails

## Use Cases

- Custom data processing and transformation
- Complex business logic execution
- Integration with external APIs
- Advanced analytics and calculations
- Custom alert processing
- Data enrichment and formatting

## Required Function Format

```typescript
export default async function ({ payload, context }) {
    // Your custom logic here
    return {
        result: "processed data",
        status: "success"
    };
}
```

## Example Usage

### Basic Data Processing

```typescript
// Source code parameter:
export default async function ({ payload }) {
    const { metrics, threshold } = payload;
    const filtered = metrics.filter(m => m.value > threshold);
    return {
        filteredMetrics: filtered,
        count: filtered.length,
        averageValue: filtered.reduce((a, b) => a + b.value, 0) / filtered.length
    };
}

// Payload parameter:
{
    "metrics": [
        {"name": "cpu", "value": 75},
        {"name": "memory", "value": 90}
    ],
    "threshold": 80
}
```

### Data Transformation

```typescript
export default async function ({ payload }) {
    const { rawData, format } = payload;
    
    if (format === "csv") {
        const csvRows = rawData.map(row => 
            Object.values(row).join(",")
        );
        return {
            format: "csv",
            data: csvRows.join("\n"),
            rowCount: rawData.length
        };
    }
    
    return { error: "Unsupported format" };
}
```

## Use Cases in Detail

### Data Processing

- Transform API responses
- Aggregate metrics and logs
- Format data for external systems
- Clean and normalize datasets

### Business Logic

- Apply custom business rules
- Calculate KPIs and SLAs
- Process workflow decisions
- Implement custom alerting logic

### Integration

- Call external APIs
- Transform data formats
- Enrich monitoring data
- Connect with third-party services

## Error Handling

Common issues and solutions:

- **Syntax errors**: Check TypeScript syntax and format
- **Runtime errors**: Handle exceptions in your code
- **Timeout errors**: Optimize code for performance
- **Memory limits**: Process data in chunks

## Best Practices

### Code Structure

- Keep functions focused and lightweight
- Handle errors gracefully with try-catch
- Return structured data objects
- Use TypeScript type annotations

### Performance

- Avoid long-running synchronous operations
- Process large datasets in batches
- Use efficient algorithms and data structures
- Monitor execution time and memory usage

### Security

- Don't include credentials in source code
- Validate input data thoroughly
- Be cautious with external API calls
- Consider data privacy implications

### Testing

- Test functions with sample data first
- Include logging for debugging
- Validate input parameters
- Handle edge cases properly

## Advanced Examples

### External API Integration

```typescript
export default async function ({ payload }) {
    const { apiUrl, data } = payload;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        return {
            success: true,
            data: result,
            statusCode: response.status
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
```

### Complex Data Analysis

```typescript
export default async function ({ payload }) {
    const { timeSeriesData, analysisType } = payload;
    
    switch (analysisType) {
        case 'trend':
            return calculateTrend(timeSeriesData);
        case 'anomaly':
            return detectAnomalies(timeSeriesData);
        case 'forecast':
            return generateForecast(timeSeriesData);
        default:
            return { error: 'Unknown analysis type' };
    }
}

function calculateTrend(data) {
    // Linear regression implementation
    const n = data.length;
    const sumX = data.reduce((a, b, i) => a + i, 0);
    const sumY = data.reduce((a, b) => a + b.value, 0);
    const sumXY = data.reduce((a, b, i) => a + i * b.value, 0);
    const sumX2 = data.reduce((a, b, i) => a + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return {
        trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable',
        slope,
        intercept
    };
}
```

## Limitations

- Execution time limits apply
- Memory constraints exist
- Network access may be restricted
- Some Node.js modules may not be available

## Integration with Other Tools

- Use with `execute_dql` to process query results
- Combine with `get_entity_details` for entity-specific processing
- Use results with `send_slack_message` for notifications
- Chain with other tools for complex workflows
