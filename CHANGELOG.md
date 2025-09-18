# Changelog

All notable changes to the Dynatrace MCP Server project will be documented in this file.

## 2.6.0 - 2025-01-08

### Added (2.6.0)

- **📊 Grail Budget Tracking System**: Comprehensive budget monitoring for DQL query costs
  - `get_grail_budget_status`: Real-time budget usage tracking with warnings and limits
  - `reset_grail_budget`: Reset budget tracker for new query sessions  
  - Automatic budget enforcement with 80% warning threshold
  - Session and daily budget limits with clear user messaging
  - Budget integration with all DQL queries for cost visibility
- **🔍 Enhanced DQL Execution**: Significant improvements to query execution capabilities
  - Enhanced metadata extraction supporting multiple field formats (`scannedBytes`, `totalProcessedBytes`)
  - Improved error handling with detailed failure messages and context
  - Budget integration showing cost impact of each query
  - Better support for polling long-running queries with state management
- **📈 HTTP Server Mode**: Run as standalone HTTP server for broader integration
  - Command line option: `--http-port 3000` for server mode
  - RESTful API endpoints: `/health`, `/tools/list`, `/tools/call`
  - Docker-ready architecture for containerized deployments
  - Environment-based configuration for production deployments
- **🔧 Enhanced Logging System**: Comprehensive structured logging throughout the application
  - Configurable log levels: `debug`, `info`, `warn`, `error`
  - Request/response logging for debugging and monitoring
  - Error context preservation for better troubleshooting
  - Performance timing logs for optimization insights
- **🧪 Comprehensive Testing Infrastructure**: Full test coverage for reliability
  - 38 test cases covering all major functionality
  - Budget tracker unit tests with 16 test scenarios
  - DQL execution interface and integration tests
  - Isolated test environments preventing cross-test interference
  - 100% test success rate ensuring production readiness

### Changed (2.6.0)

- **Enhanced DQL Response Structure**: All DQL queries now include budget information
  - Budget status automatically included in `execute_dql` responses
  - Warning messages when approaching or exceeding budget limits
  - Usage statistics showing bytes scanned and query count
- **Improved Error Messages**: More descriptive error handling throughout
  - Budget-related errors include usage context and remediation steps
  - DQL execution errors provide query context and suggestions
  - Authentication errors include specific scope and permission details
- **Better Configuration Management**: Enhanced environment variable handling
  - New `DT_GRAIL_QUERY_BUDGET_GB` for budget limit configuration
  - `LOG_LEVEL` for runtime logging control
  - `HTTP_PORT` for server mode configuration
- **Performance Optimizations**: Reduced overhead and improved response times
  - Streamlined budget tracking calculations  
  - Optimized query metadata extraction
  - More efficient error handling paths

### Documentation (2.6.0)

- **Updated README.md**: Comprehensive documentation updates
  - HTTP server mode setup and configuration examples
  - Grail budget tracking usage and best practices
  - Enhanced environment variables reference
  - Docker deployment examples and configurations
- **Enhanced Examples**: Real-world usage patterns and integration guides
  - Budget monitoring workflows for cost management
  - HTTP server integration patterns for external systems
  - Testing strategies and development setup guides

## 2.5.0 - 2025-09-16

### Added (2.5.0)

- **🤖 Davis CoPilot AI Integration**: Full integration with Dynatrace's AI-powered assistant
  - `generate_dql_from_natural_language`: Convert natural language queries to DQL using Davis CoPilot
  - `explain_dql_in_natural_language`: Get AI-powered explanations of DQL statements
  - `chat_with_davis_copilot`: Interactive AI conversations for Dynatrace troubleshooting and guidance
- **🔐 Dual Authentication Architecture**: Enhanced authentication system supporting multiple token types
  - API tokens (dt0c01.\*) for live.dynatrace.com operations (entities, tags, problems)
  - Platform tokens (dt0s16.\*) for apps.dynatrace.com operations (Davis CoPilot, functions)
  - OAuth client authentication for advanced platform features
- **🏷️ Enhanced Entity Tagging**: Completely rewritten `add_entity_tags` tool
  - Now accepts entity ID directly for maximum reliability
  - Removed complex entity name search logic (use `execute_dql` to find entity IDs)
  - Supports all entity types without hardcoded limitations
  - Clean, experienced programmer approach with proper error handling
- **📊 Environment Information**: New `get_environment_info` tool to retrieve Dynatrace environment details
- **🔧 Development Infrastructure**: Enhanced development and release preparation
  - Pre-commit hooks with linting, testing, and build verification
  - Release preparation scripts for quality assurance
  - Improved npm scripts for development workflow

### Changed (2.5.0)

- **Breaking Change**: `add_entity_tags` now requires entity ID parameter instead of entity name
  - Migration: Use `execute_dql` tool to find entity IDs, then pass to `add_entity_tags`
  - Benefits: More reliable, supports all entity types, cleaner implementation
- **Authentication Routing**: Tools now automatically route to correct authentication method
  - Davis CoPilot tools use OAuth authentication to apps.dynatrace.com
  - Entity operations use API token authentication to live.dynatrace.com
  - Environment info uses platform token authentication
- **Standardized Environment Variables**: All tools use consistent `DT_*` prefix pattern
  - `DT_ENVIRONMENT`: Dynatrace environment URL
  - `DT_API_TOKEN`: API token for entity operations (entities.read, entities.write scopes)
  - `DT_PLATFORM_TOKEN`: Platform token for Davis CoPilot and advanced features
  - Maintained backward compatibility with legacy `DYNATRACE_*` variables

### Fixed (2.5.0)

- **Davis CoPilot Authentication**: Resolved 403 authentication errors with proper OAuth scope configuration
- **Environment API Access**: Fixed HTML response issues with correct platform token usage
- **Entity Selector Syntax**: Implemented Dynatrace API-compliant entity selector patterns
- **Tool Success Rate**: Achieved 26/27 tools working (96% success rate) with comprehensive testing

### Security (2.5.0)

- **Enhanced Token Management**: Clear separation of token types with specific use cases
- **Scope Documentation**: Comprehensive documentation of required OAuth scopes per tool
- **Authentication Best Practices**: Updated security guidelines for dual authentication setup

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
