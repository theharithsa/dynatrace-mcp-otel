# Changelog

All notable changes to the Dynatrace MCP Server project will be documented in this file.

## 2.1.0 - 2025-01-31

### Added

- **Davis CoPilot AI Integration** - Three powerful new tools for AI-assisted query generation and explanation
- `generate_dql_from_natural_language` - Convert natural language descriptions to DQL queries using Davis CoPilot AI
- `explain_dql_in_natural_language` - Get plain English explanations of complex DQL statements
- `chat_with_davis_copilot` - General-purpose AI assistant for Dynatrace-related questions and troubleshooting
- Enhanced tool descriptions with workflow guidance (generate → verify → execute → iterate)
- Davis CoPilot API integration with comprehensive error handling and metadata support

### Enhanced

- Improved tool discovery with better descriptions emphasizing AI workflow capabilities
- Better error messages and response formatting for Davis CoPilot interactions
- Enhanced observability with trace correlation for AI-assisted operations
- Comprehensive documentation for Davis CoPilot features and limitations

### Technical

- Added TypeScript interfaces for Davis CoPilot API responses based on OpenAPI specifications
- Implemented proper HTTP client handling for Davis CoPilot endpoints
- Added required OAuth scopes for Davis CoPilot functionality
- Enhanced README with Davis CoPilot configuration and usage examples

### Notes

- Davis CoPilot AI is generally available (GA), but the Davis CoPilot APIs are in preview
- DQL generation and explanation capabilities significantly enhance AI assistant workflows
- Natural language to DQL conversion enables non-technical users to query Dynatrace data effectively

## 2.0.1 - 2025-01-31

### Changed

- Switched to OpenTelemetry auto-instrumentation for better performance and maintainability
- Removed manual span creation and tracing code in favor of automatic instrumentation
- Simplified tool execution flow by removing manual `context.with()` and `trace.setSpan()` calls
- Updated OpenTelemetry configuration to use `@theharithsa/opentelemetry-instrumentation-mcp` package

### Improved

- Better tracing performance with automatic instrumentation
- Reduced code complexity in tool execution wrapper
- Enhanced observability with standardized auto-instrumentation

## 1.0.8 - 2025-01-31

### Added

- Enhanced logging with `dt.security_context` and `logType` fields for better correlation
- Added build-logs metadata to all log entries for improved filtering
- Deployed standardized OpenTelemetry using Thoth action

### Changed

- Switched from custom OpenTelemetry implementation to standard Thoth action
- Simplified CI/CD pipeline with standardized observability tooling

### Fixed

- Improved error handling in OpenTelemetry trace sending
- Ensured logs are successfully delivered even when traces fail

### Known Issues

- OpenTelemetry trace ingestion not fully functional, but logging works correctly

## [1.0.7] - 2025-01-31

### Added

- OpenTelemetry tracing for GitHub Actions workflows with full observability
- Dynatrace log ingestion for build logs with trace correlation
- GitHub Actions reusable actions for OTel setup and step wrapping
- Trace ID and span ID correlation between traces and logs
- Branch-based build type detection (dev vs prod) in OTel attributes
- Comprehensive tracing for NPM publish and version validation workflows
- Log capture and ingestion for all CI/CD steps with structured metadata
- Service name configuration as `dynatrace-mcp-server-build`
- Environment variable alignment with .env file standards (`OTEL_EXPORTER_OTLP_ENDPOINT`, `DYNATRACE_API_TOKEN`, `DYNATRACE_LOG_INGEST_URL`)

### Enhanced

- GitHub Actions workflows with distributed tracing capabilities
- CI/CD observability with correlated traces and logs in Dynatrace
- Build process monitoring with step-level visibility
- Error tracking and performance monitoring for automated workflows

### Infrastructure

- `.github/actions/setup-otel/action.yml` - Reusable OTel initialization action
- `.github/actions/otel-step/action.yml` - Step wrapper with tracing and logging
- `.github/actions/send-logs/action.yml` - Dynatrace log ingestion action
- Updated npm-publish workflow with comprehensive observability
- Updated version-validation workflow with tracing support

## [1.0.6] - 2025-01-31

### Added

- Dual-package publishing strategy for dev and production releases
- Dev branch publishes as `dynatrace-mcp-server-dev` on PR events and direct pushes  
- Main branch publishes as `dynatrace-mcp-server` ONLY when PR is merged
- Dynamic package naming based on target branch
- Branch-specific release tagging and GitHub releases
- PR merge detection for production releases
- GitHub environment-based deployment with proper permissions

### Changed

- Enhanced GitHub workflow with strict PR merge requirements for main branch
- Updated workflow to prevent direct push publishing to main branch
- Dev branch allows both PR and push publishing
- Improved debugging output for publish decisions
- Updated README.md with correct package installation instructions
- Fixed NPM authentication using GitHub environments
- Replaced deprecated GitHub release action with modern alternative

### Fixed

- NPM authentication issues in GitHub Actions
- GitHub token permissions for release creation
- Package naming consistency between dev and production builds

## [1.0.5] - 2025-01-30

### Added

- Comprehensive README documentation with MCP-focused approach
- Quick start guide for AI assistant integration
- Complete tool reference with descriptions and use cases
- Environment variable documentation with examples
- OAuth scope requirements and setup instructions
- Advanced usage examples for custom dashboards and TypeScript execution
- Development setup instructions for code customization

### Changed

- Simplified README structure emphasizing MCP client configuration
- Reorganized documentation to prioritize AI agent use cases
- Clarified package variants (production vs development)
- Updated configuration examples for different MCP clients

## [1.0.4] - 2025-01-29

### Added

- `execute_typescript` tool for running custom TypeScript code via Dynatrace Function Executor
- `create_dashboard` tool for bulk dashboard creation from JSON files
- `share_document_env` tool for cross-environment document sharing
- `direct_share_document` tool for sharing documents with specific users
- `bulk_delete_dashboards` tool for efficient dashboard cleanup

### Enhanced

- Document management capabilities with sharing workflows
- Custom code execution support for advanced automation
- Dashboard lifecycle management (create, share, delete)

### Fixed

- Error handling in document operations
- Trace correlation in dashboard creation workflow

## [1.0.3] - 2025-01-28

### Added

- Enhanced OpenTelemetry integration with trace correlation
- Dynatrace log ingestion for better observability
- Improved error handling across all tools

### Changed

- Updated authentication flow for better reliability
- Enhanced tool responses with actionable insights

## [1.0.2] - 2025-01-27

### Added

- Version validation workflow for pull requests
- Automated testing pipeline

### Fixed

- Package.json validation issues
- Build process optimization

## [1.0.1] - 2025-01-26

### Fixed

- Initial deployment configuration
- Environment variable handling

## [1.0.0] - 2025-01-25

### Added

- Initial release of Dynatrace MCP Server
- Core tools for Dynatrace observability data access
- OAuth authentication with Dynatrace platform
- Basic tool set including problems, vulnerabilities, and entity management
- DQL query execution capabilities
- Slack integration for notifications
- Workflow automation tools
- Ownership information retrieval
- Kubernetes events monitoring

### Infrastructure

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
