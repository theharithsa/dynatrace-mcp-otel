# Dynatrace Observability Workshop Rules# Dynatrace MCP Integration Rules

This directory contains comprehensive workflow rules for AI-assisted Dynatrace analysis through the MCP (Model Context Protocol) integration. The rules enable complete observability analysis across security, compliance, problems, logs, and distributed tracing.This directory contains rule files that guide the AI assistant in analyzing Dynatrace security and compliance data through the MCP (Model Context Protocol) integration.

_Disclaimer: For the best results, we recommend using Claude Sonnet 4 as the base model._## 🚀 Installation Instructions

## 🚀 Quick Start### 1. Install Dynatrace MCP Server

### 1. Install Dynatrace MCP ServerEnsure the Dynatrace MCP server is correctly installed and configured with your Dynatrace environment credentials.

```bash### 2. Copy Integration Rules

npm install -g @dynatrace-oss/dynatrace-mcp-server

# Configure with your Dynatrace environment credentialsPlace all 5 integration rule files in your IDE's AI plugin rules folder:

```

**IDE-Specific Locations:**

### 2. Copy Integration Rules to Your IDE

- **Amazon Q**: `.amazonq/rules/` (project) or `~/.aws/amazonq/rules/` (global)

Copy all 11 rule files to your AI assistant's rules directory:- **Cursor**: `.cursor/rules/` (project) or via Settings → Rules (global)

- **Windsurf**: `.windsurfrules/` (project) or via Customizations → Rules (global)

**IDE-Specific Locations:**- **Cline**: `.clinerules/` (project) or `~/Documents/Cline/Rules/` (global)

- **GitHub Copilot**: `.github/copilot-instructions.md` (project only)

- **Amazon Q**: `.amazonq/rules/` (project) or `~/.aws/amazonq/rules/` (global)

- **Cursor**: `.cursor/rules/` (project) or via Settings → Rules (global)**Required files:**

- **Windsurf**: `.windsurfrules/` (project) or via Customizations → Rules (global)

- **Cline**: `.clinerules/` (project) or `~/Documents/Cline/Rules/` (global)- `DynatraceMcpIntegration.md`

- **GitHub Copilot**: `.github/copilot-instructions.md` (project only)- `DynatraceQueryLanguage.md`

- `DynatraceSecurityCompliance.md`

### 3. Initialize the Agent- `DynatraceSecurityEvents.md`

- `DynatraceSecurityEventsDiagram.md`

In your AI chat:- `DynatraceEmailFormatting.md`

- `slackMessages.md`

```

load dynatrace mcp### 3. Activate the Agent

```

In your AI chat, type:

The Dynatrace observability agent will activate with full analysis capabilities.

```

## 🏗️ Architecture Overviewload dynatrace mcp

```

### 📁 Hierarchical Folder Structure

The Dynatrace agent will initialize and provide analysis capabilities.

````

dynatrace-agent-rules/rules/## File Structure & Interactions

├── DynatraceMcpIntegration.md                    # 🎯 MAIN ORCHESTRATOR

├── README.md                                     # 📖 THIS OVERVIEW DOCUMENT```mermaid

├── workflows/                                    # 🔧 ANALYSIS WORKFLOWSgraph TD

│   ├── DynatraceIncidentResponse.md             # Core incident investigation    A[DynatraceMcpIntegration.md] --> B[DynatraceQueryLanguage.md]

│   ├── DynatraceSecurityCompliance.md           # Security & compliance analysis    A --> C[DynatraceSecurityCompliance.md]

│   ├── DynatraceDevOpsIntegration.md            # CI/CD automation & SRE    A --> D[DynatraceSecurityEvents.md]

│   ├── DynatraceInvestigationChecklist.md       # Investigation procedures    A --> E[DynatraceSecurityEventsDiagram.md]

│   └── dataSourceGuides/                        # 📊 DATA ANALYSIS GUIDES    A --> F[DynatraceEmailFormatting.md]

│       ├── DynatraceDataInvestigation.md        # Multi-source data analysis    A --> G[slackMessages.md]

│       └── DynatraceSpanAnalysis.md             # Transaction tracing & root cause

└── reference/                                   # 📚 TECHNICAL DOCUMENTATION    C --> B

    ├── DynatraceQueryLanguage.md                # DQL syntax foundation    C --> D

    ├── DynatraceExplore.md                      # Field discovery patterns    D --> E

    ├── DynatraceSecurityEvents.md               # Security events schema    F --> A

    └── DynatraceProblemsSpec.md                 # Problems schema reference    G --> A

````

    style A fill:#e1f5fe

### Required Rule Files (11 Total) style B fill:#f3e5f5

    style C fill:#e8f5e8

**Main Files:** style D fill:#fff3e0

    style E fill:#fce4ec

- `DynatraceMcpIntegration.md` - **Main orchestration hub** (6 analysis modes) style F fill:#e8f5e8

- `README.md` - **This workflow overview document** style G fill:#e1f5fe

```

**Workflows:**

## Core Files

- `workflows/DynatraceIncidentResponse.md` - **Core incident investigation framework**

- `workflows/DynatraceSecurityCompliance.md` - **Security & compliance workflows**### 🔄 **DynatraceMcpIntegration.md** (Main Entry Point)

- `workflows/DynatraceDevOpsIntegration.md` - **CI/CD automation & SRE workflows**

- `workflows/DynatraceInvestigationChecklist.md` - **Investigation checklist and procedures**- **Purpose**: Generic integration guide and analysis mode selector

- **Key Features**:

**Data Source Guides:**  - 6 analysis modes (vulnerabilities, compliance, problems, entities, logs, custom DQL)

  - Platform-agnostic integration architecture

- `workflows/dataSourceGuides/DynatraceDataInvestigation.md` - **Comprehensive data analysis patterns**  - Post-analysis workflow guidance

- `workflows/dataSourceGuides/DynatraceSpanAnalysis.md` - **Distributed tracing & root cause analysis**  - Generic data sources and capabilities overview

- **Dependencies**: References all other files for specific guidance

**Reference Documentation:**

### 🔍 **DynatraceQueryLanguage.md** (DQL Foundation)

- `reference/DynatraceQueryLanguage.md` - **Core DQL syntax foundation**

- `reference/DynatraceExplore.md` - **Field discovery patterns**- **Purpose**: Core DQL syntax and best practices for general use

- `reference/DynatraceSecurityEvents.md` - **Security events schema reference**- **Key Features**:

- `reference/DynatraceProblemsSpec.md` - **Problems schema reference**  - Pipeline-based query structure

  - Time range control patterns

## 🎯 Analysis Modes & Workflows  - Basic DQL commands and functions

  - General best practices and syntax corrections

### 1. Incident Response & Problem Investigation- **Used By**: All analysis modes requiring DQL syntax knowledge



**Primary Workflow**: DynatraceMcpIntegration.md → workflows/DynatraceIncidentResponse.md → workflows/dataSourceGuides/DynatraceSpanAnalysis.md### 🛡️ **DynatraceSecurityCompliance.md** (Security & Compliance Analysis)



- **4-phase structured investigation** workflow (Detection → Impact → Root Cause → Resolution)- **Purpose**: Complete security and compliance analysis guide

- **Cross-data source correlation** (problems → logs → spans → metrics)- **Key Features**:

- **Kubernetes-aware incident analysis** with namespace and pod context  - Security events architecture overview

- **User impact assessment** with Davis AI integration  - Latest scan analysis patterns

  - Time range requirements by platform

### 2. Security & Vulnerability Analysis  - Team-specific remediation guidance

  - **Threat observability DQL examples**

**Primary Workflow**: DynatraceMcpIntegration.md → workflows/DynatraceSecurityCompliance.md → reference/DynatraceSecurityEvents.md  - **Vulnerability analysis patterns**

  - **Container security analysis**

- **Latest-scan analysis** prevents outdated data aggregation  - **Advanced entity analysis with ownership**

- **Extended timeframes** (24h+) for cloud provider scans- **Dependencies**: Uses DQL patterns and security events structure

- **Real-time vulnerability correlation** with Davis AI assessment

- **Container image security** with component-level analysis## Reference Files



### 3. DevOps & SRE Automation### 📊 **DynatraceSecurityEvents.md** (Data Schema)



**Primary Workflow**: DynatraceMcpIntegration.md → workflows/DynatraceDevOpsIntegration.md → reference/DynatraceQueryLanguage.md- **Purpose**: Complete security events reference

- **Key Features**:

- **Deployment health gates** with automated promotion/rollback  - Event types and attributes

- **SLO/SLI automation** with error budget calculations  - Relationship fields

- **Infrastructure as Code remediation** with auto-generated templates  - Query examples for each event type

- **Alert optimization workflows** with pattern recognition- **Used By**: All security-related analysis modes



### 4. Comprehensive Data Investigation### 📈 **DynatraceSecurityEventsDiagram.md** (Visual Reference)



**Primary Workflow**: workflows/dataSourceGuides/DynatraceDataInvestigation.md → reference/DynatraceQueryLanguage.md- **Purpose**: Visual representation of event relationships

- **Key Features**:

- **Unified log-service-process analysis** in single workflow  - Event flow diagrams

- **Business logic error detection** patterns  - Data architecture visualization

- **Deployment correlation analysis** with ArgoCD/GitOps integration  - Relationship mapping

- **Golden signals monitoring** (Rate, Errors, Duration, Saturation)- **Complements**: DynatraceSecurityEvents.md with visual context



### 5. Distributed Tracing Analysis## Communication Files



**Primary Workflow**: workflows/dataSourceGuides/DynatraceSpanAnalysis.md → reference/DynatraceQueryLanguage.md### 📧 **DynatraceEmailFormatting.md** (Email Formatting Guide)



- **Exception details extraction** with full stack traces- **Purpose**: Comprehensive email formatting and content guidelines

- **Performance impact correlation** across services- **Key Features**:

- **Failure pattern analysis** and error rate calculations  - Markdown formatting syntax for email content

- **Multi-service cascade analysis**  - Email API integration patterns

  - Content type specifications (text/plain, text/html)

### 6. Field Discovery & Exploration  - Recipient management and limitations

  - Error handling and best practices

**Primary Workflow**: reference/DynatraceExplore.md → reference/DynatraceQueryLanguage.md  - Advanced examples for alerts and reports

- **Used By**: Email notification workflows and alert systems

- **Advanced query patterns** with semantic field discovery

- **Entity relationship mapping** across infrastructure### 💬 **slackMessages.md** (Slack Integration Guide)

- **Time-series analysis** and trend identification

- **Cross-platform data correlation**- **Purpose**: Slack message formatting and integration patterns

- **Key Features**:

## Usage Flow  - Slack-specific formatting guidelines

  - Channel management

### Incident Response & Problem Investigation  - Integration workflows

- **Used By**: Slack notification systems and team communications

1. **Start**: User requests analysis → **DynatraceMcpIntegration.md** selects appropriate mode

2. **Investigation Framework**: Use **workflows/DynatraceIncidentResponse.md** for systematic 4-phase approach## Usage Flow

3. **Data Analysis**: Apply **workflows/dataSourceGuides/DynatraceDataInvestigation.md** for multi-source correlation

4. **Transaction Analysis**: Use **workflows/dataSourceGuides/DynatraceSpanAnalysis.md** for precise root cause1. **Start**: User requests analysis → **DynatraceMcpIntegration.md** selects appropriate mode

5. **DQL Foundation**: All analysis modes leverage **reference/DynatraceQueryLanguage.md** syntax2. **Query Building**: Mode uses **DynatraceQueryLanguage.md** for DQL syntax

3. **Security Analysis**: Compliance/vulnerability modes reference **DynatraceSecurityCompliance.md**

### Security & Compliance Analysis4. **Data Understanding**: All modes can reference **DynatraceSecurityEvents.md** for event structure

5. **Visualization**: Complex relationships explained via **DynatraceSecurityEventsDiagram.md**

1. **Start**: User requests analysis → **DynatraceMcpIntegration.md** selects appropriate mode6. **Communication**:

2. **Security Analysis**: Compliance/vulnerability modes reference **workflows/DynatraceSecurityCompliance.md**   - Email notifications use **DynatraceEmailFormatting.md** for content formatting

3. **Data Understanding**: All modes can reference **reference/DynatraceSecurityEvents.md** for event structure   - Slack integration follows **slackMessages.md** guidelines

4. **Field Discovery**: Use **reference/DynatraceExplore.md** for unknown field exploration

5. **Query Building**: Mode uses **reference/DynatraceQueryLanguage.md** for DQL syntax## Key Principles



### DevOps & SRE Workflows- **DQL-First Approach**: Prefer DQL queries over native MCP calls for vulnerability analysis

- **Latest Scan Focus**: Always analyze most recent scan data, never aggregate over time

1. **Automation Start**: **workflows/DynatraceDevOpsIntegration.md** for deployment and SRE workflows- **Extended Timeframes**: Use 24h+ for cloud provider findings, default for Kubernetes

2. **Problem Context**: Reference **reference/DynatraceProblemsSpec.md** for problem schema understanding- **Remediation-Driven**: Always offer follow-up remediation options after analysis

3. **Data Investigation**: Use **workflows/dataSourceGuides/DynatraceDataInvestigation.md** for service analysis

4. **Field Discovery**: Apply **reference/DynatraceExplore.md** for infrastructure mapping## Quick Reference

5. **Query Optimization**: Leverage **reference/DynatraceQueryLanguage.md** for advanced patterns

| Analysis Type       | Primary File                   | Supporting Files                                      |

## Key Principles| ------------------- | ------------------------------ | ----------------------------------------------------- |

| Vulnerabilities     | DynatraceMcpIntegration.md     | DynatraceQueryLanguage.md, DynatraceSecurityEvents.md |

- **DQL-First Approach**: Prefer DQL queries over native MCP calls for vulnerability analysis| Compliance          | DynatraceSecurityCompliance.md | DynatraceQueryLanguage.md, DynatraceSecurityEvents.md |

- **Latest Scan Focus**: Always analyze most recent scan data, never aggregate over time| Custom DQL          | DynatraceQueryLanguage.md      | DynatraceSecurityEvents.md                            |

- **Extended Timeframes**: Use 24h+ for cloud provider findings, default for Kubernetes| Event Understanding | DynatraceSecurityEvents.md     | DynatraceSecurityEventsDiagram.md                     |

- **Remediation-Driven**: Always offer follow-up remediation options after analysis| Email Notifications | DynatraceEmailFormatting.md    | DynatraceMcpIntegration.md                            |

| Slack Integration   | slackMessages.md               | DynatraceMcpIntegration.md                            |

## Quick Reference

| Analysis Type              | Primary File                                                   | Supporting Files                                                               |
| -------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Incident Response**      |                                                                |                                                                                |
| Multi-Phase Investigation  | workflows/DynatraceIncidentResponse.md                        | workflows/dataSourceGuides/DynatraceDataInvestigation.md, DynatraceSpanAnalysis.md |
| Investigation Procedures   | workflows/DynatraceInvestigationChecklist.md                  | reference/DynatraceQueryLanguage.md                                           |
| **Security & Compliance**  |                                                                |                                                                                |
| Security Analysis          | workflows/DynatraceSecurityCompliance.md                      | reference/DynatraceSecurityEvents.md, DynatraceQueryLanguage.md               |
| Vulnerability Assessment   | DynatraceMcpIntegration.md                                     | workflows/DynatraceSecurityCompliance.md, reference/DynatraceSecurityEvents.md     |
| **DevOps & SRE**           |                                                                |                                                                                |
| CI/CD Automation           | workflows/DynatraceDevOpsIntegration.md                       | reference/DynatraceQueryLanguage.md, DynatraceProblemsSpec.md                 |
| Deployment Health Gates    | workflows/DynatraceDevOpsIntegration.md                       | workflows/dataSourceGuides/DynatraceDataInvestigation.md                      |
| **Data Analysis**          |                                                                |                                                                                |
| Multi-Source Investigation | workflows/dataSourceGuides/DynatraceDataInvestigation.md      | reference/DynatraceQueryLanguage.md, DynatraceExplore.md                      |
| Distributed Tracing        | workflows/dataSourceGuides/DynatraceSpanAnalysis.md           | reference/DynatraceQueryLanguage.md, DynatraceProblemsSpec.md                 |
| **Technical Reference**    |                                                                |                                                                                |
| DQL Syntax & Patterns      | reference/DynatraceQueryLanguage.md                           | reference/DynatraceExplore.md                                                 |
| Field Discovery            | reference/DynatraceExplore.md                                 | reference/DynatraceQueryLanguage.md                                           |
| Schema Understanding       | reference/DynatraceSecurityEvents.md, DynatraceProblemsSpec.md | reference/DynatraceQueryLanguage.md                                           |
```
