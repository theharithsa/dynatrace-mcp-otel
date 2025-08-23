# Changelog

All notable changes to the Dynatrace MCP Server project will be documented in this file.

## 2.3.0 - 2025-08-24

### Added (2.3.0)

- **Strato React Documentation App**: Added a dedicated React + Dynatrace Strato design system documentation application under `docs/strato-docs-app` providing interactive tool reference (search, filtering, detailed scopes, prompt examples). This app is not part of the published NPM package and is for developer documentation only.
- **Expanded Tool Documentation**: Added detailed per-tool prompt examples with rationales, enriched best practices, and additional guidance fields in docs app data model.
- **Cost Awareness**: Added cost considerations disclaimer in README about Dynatrace Grail data access with guidance on usage optimization.
- **Usage Monitoring**: Added `dtClientContext` to `execute_dql` tool to enable usage-monitoring and cost attribution for Grail access.

### Changed (2.3.0)

- **Updated Dynatrace SDK versions**: Updated all @dynatrace-sdk packages to latest versions for improved functionality and dtClientContext support:
  - `@dynatrace-sdk/client-automation`: 5.3.0 → 5.13.1
  - `@dynatrace-sdk/client-classic-environment-v2`: 3.6.8 → 4.1.0
  - `@dynatrace-sdk/client-document`: 1.24.4 → 1.24.5
  - `@dynatrace-sdk/client-platform-management-service`: 1.6.3 → 1.7.0
  - `@dynatrace-sdk/client-query`: 1.18.1 → 1.21.1
  - Added `@dynatrace-sdk/http-client`: 1.3.1
- **Code Quality**: Centralized user agent string generation with new `getUserAgent()` utility function
- **Type Safety**: Updated function signatures to use proper `ExecuteRequest` types and modern `HttpClient` imports


## 2.2.0 - 2025-01-31

### Added (2.2.0)

- **Email Integration** - New tool for sending emails via Dynatrace Email API
- `send_email` - Send emails with support for To, CC, BCC recipients, HTML/plain text content, and notification settings
- Complete email API error handling with detailed status messages for bounces, complaints, and invalid destinations
- Support for tenant domain validation and proper OAuth authentication for email services

### Enhanced (2.2.0)

- Added `email:emails:send` scope to required OAuth scopes for email functionality
- Comprehensive error reporting for email delivery failures with retry information
- Enhanced documentation with email tool usage and configuration

### Technical (2.2.0)

- Implemented TypeScript interfaces for Dynatrace Email API request/response structures
- Added proper HTTP status validation (202 Accepted) for email requests
- Enhanced base scopes to include email functionality by default

## 2.1.0 - 2025-01-31

### Added (2.1.0)

- **Davis CoPilot AI Integration** - Three powerful new tools for AI-assisted query generation and explanation
- `generate_dql_from_natural_language` - Convert natural language descriptions to DQL queries using Davis CoPilot AI
- `explain_dql_in_natural_language` - Get plain English explanations of complex DQL statements
- `chat_with_davis_copilot` - General-purpose AI assistant for Dynatrace-related questions and troubleshooting
- Enhanced tool descriptions with workflow guidance (generate → verify → execute → iterate)
- Davis CoPilot API integration with comprehensive error handling and metadata support

### Enhanced (2.1.0)

- Improved tool discovery with better descriptions emphasizing AI workflow capabilities
- Better error messages and response formatting for Davis CoPilot interactions
- Enhanced observability with trace correlation for AI-assisted operations
- Comprehensive documentation for Davis CoPilot features and limitations

### Technical (2.1.0)

- Added TypeScript interfaces for Davis CoPilot API responses based on OpenAPI specifications
- Implemented proper HTTP client handling for Davis CoPilot endpoints
- Added required OAuth scopes for Davis CoPilot functionality
- Enhanced README with Davis CoPilot configuration and usage examples

### Notes (2.1.0)

- Davis CoPilot AI is generally available (GA), but the Davis CoPilot APIs are in preview
- DQL generation and explanation capabilities significantly enhance AI assistant workflows
- Natural language to DQL conversion enables non-technical users to query Dynatrace data effectively

## 2.0.1 - 2025-01-31

### Changed (2.0.1)

- Switched to OpenTelemetry auto-instrumentation for better performance and maintainability
- Removed manual span creation and tracing code in favor of automatic instrumentation
- Simplified tool execution flow by removing manual `context.with()` and `trace.setSpan()` calls
- Updated OpenTelemetry configuration to use `@theharithsa/opentelemetry-instrumentation-mcp` package

### Improved (2.0.1)

- Better tracing performance with automatic instrumentation
- Reduced code complexity in tool execution wrapper
- Enhanced observability with standardized auto-instrumentation

## 1.0.8 - 2025-01-31

### Added (1.0.8)

- Enhanced logging with `dt.security_context` and `logType` fields for better correlation
- Added build-logs metadata to all log entries for improved filtering
- Deployed standardized OpenTelemetry using Thoth action

### Changed (1.0.8)

- Switched from custom OpenTelemetry implementation to standard Thoth action
- Simplified CI/CD pipeline with standardized observability tooling

### Fixed (1.0.8)

- Improved error handling in OpenTelemetry trace sending
- Ensured logs are successfully delivered even when traces fail

### Known Issues (1.0.8)

- OpenTelemetry trace ingestion not fully functional, but logging works correctly

## [1.0.7] - 2025-01-31

### Added (1.0.7)

- OpenTelemetry tracing for GitHub Actions workflows with full observability
- Dynatrace log ingestion for build logs with trace correlation
- GitHub Actions reusable actions for OTel setup and step wrapping
- Trace ID and span ID correlation between traces and logs
- Branch-based build type detection (dev vs prod) in OTel attributes
- Comprehensive tracing for NPM publish and version validation workflows
- Log capture and ingestion for all CI/CD steps with structured metadata
- Service name configuration as `dynatrace-mcp-server-build`
- Environment variable alignment with .env file standards (`OTEL_EXPORTER_OTLP_ENDPOINT`, `DYNATRACE_API_TOKEN`, `DYNATRACE_LOG_INGEST_URL`)

### Enhanced (1.0.7)

- GitHub Actions workflows with distributed tracing capabilities
- CI/CD observability with correlated traces and logs in Dynatrace
- Build process monitoring with step-level visibility
- Error tracking and performance monitoring for automated workflows

### Infrastructure (1.0.7)

- `.github/actions/setup-otel/action.yml` - Reusable OTel initialization action
- `.github/actions/otel-step/action.yml` - Step wrapper with tracing and logging
- `.github/actions/send-logs/action.yml` - Dynatrace log ingestion action
- Updated npm-publish workflow with comprehensive observability
- Updated version-validation workflow with tracing support

## [1.0.6] - 2025-01-31

### Added (1.0.6)

- Dual-package publishing strategy for dev and production releases
- Dev branch publishes as `dynatrace-mcp-server-dev` on PR events and direct pushes  
- Main branch publishes as `dynatrace-mcp-server` ONLY when PR is merged
- Dynamic package naming based on target branch
- Branch-specific release tagging and GitHub releases
- PR merge detection for production releases
- GitHub environment-based deployment with proper permissions

### Changed (1.0.6)

- Enhanced GitHub workflow with strict PR merge requirements for main branch
- Updated workflow to prevent direct push publishing to main branch
- Dev branch allows both PR and push publishing
- Improved debugging output for publish decisions
- Updated README.md with correct package installation instructions
- Fixed NPM authentication using GitHub environments
- Replaced deprecated GitHub release action with modern alternative

### Fixed (1.0.6)

- NPM authentication issues in GitHub Actions
- GitHub token permissions for release creation
- Package naming consistency between dev and production builds

## [1.0.5] - 2025-01-30

### Added (1.0.5)

- Comprehensive README documentation with MCP-focused approach
- Quick start guide for AI assistant integration
- Complete tool reference with descriptions and use cases
- Environment variable documentation with examples
- OAuth scope requirements and setup instructions
- Advanced usage examples for custom dashboards and TypeScript execution
- Development setup instructions for code customization

### Changed (1.0.5)

- Simplified README structure emphasizing MCP client configuration
- Reorganized documentation to prioritize AI agent use cases
- Clarified package variants (production vs development)
- Updated configuration examples for different MCP clients

## [1.0.4] - 2025-01-29

### Added (1.0.4)

- `execute_typescript` tool for running custom TypeScript code via Dynatrace Function Executor
- `create_dashboard` tool for bulk dashboard creation from JSON files
- `share_document_env` tool for cross-environment document sharing
- `direct_share_document` tool for sharing documents with specific users
- `bulk_delete_dashboards` tool for efficient dashboard cleanup

### Enhanced (1.0.4)

- Document management capabilities with sharing workflows
- Custom code execution support for advanced automation
- Dashboard lifecycle management (create, share, delete)

### Fixed (1.0.4)

- Error handling in document operations
- Trace correlation in dashboard creation workflow

## [1.0.3] - 2025-01-28

### Added (1.0.3)

- Enhanced OpenTelemetry integration with trace correlation
- Dynatrace log ingestion for better observability
- Improved error handling across all tools

### Changed (1.0.3)

- Updated authentication flow for better reliability
- Enhanced tool responses with actionable insights

## [1.0.2] - 2025-01-27

### Added (1.0.2)

- Version validation workflow for pull requests
- Automated testing pipeline

### Fixed (1.0.2)

- Package.json validation issues
- Build process optimization

## [1.0.1] - 2025-01-26

### Fixed (1.0.1)

- Initial deployment configuration
- Environment variable handling

## [1.0.0] - 2025-01-25

### Added (1.0.0)

- Initial release of Dynatrace MCP Server
- Core tools for Dynatrace observability data access
- OAuth authentication with Dynatrace platform
- Basic tool set including problems, vulnerabilities, and entity management
- DQL query execution capabilities
- Slack integration for notifications
- Workflow automation tools
- Ownership information retrieval
- Kubernetes events monitoring

### Infrastructure (1.0.0)

- TypeScript-based MCP server implementation
- Automated NPM publishing pipeline
- GitHub Actions workflows for CI/CD
- Comprehensive documentation and setup guides

[1.0.7]: https://github.com/your-username/dynatrace-mcp-otel/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/your-username/dynatrace-mcp-otel/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/your-username/dynatrace-mcp-otel/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/your-username/dynatrace-mcp-otel/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/your-username/dynatrace-mcp-otel/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/your-username/dynatrace-mcp-otel/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/your-username/dynatrace-mcp-otel/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/your-username/dynatrace-mcp-otel/releases/tag/v1.0.0
