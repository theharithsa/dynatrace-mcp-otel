const fs = require('fs');
const path = require('path');

/**
 * Extract changelog content for a specific version
 * @param {string} version - The version to extract (e.g., "1.0.7")
 * @param {string} changelogPath - Path to the CHANGELOG.md file
 * @returns {string} - The changelog content for that version
 */
function extractChangelogForVersion(version, changelogPath = './CHANGELOG.md') {
  try {
    const changelogContent = fs.readFileSync(changelogPath, 'utf8');
    const lines = changelogContent.split('\n');
    
    // Find the version header
    const versionPattern = new RegExp(`^## \\[${version.replace(/\./g, '\\.')}\\]`);
    let startIndex = -1;
    let endIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (versionPattern.test(lines[i])) {
        startIndex = i;
        break;
      }
    }
    
    if (startIndex === -1) {
      console.log(`Version ${version} not found in changelog`);
      return generateFallbackContent(version);
    }
    
    // Find the next version header or end of file
    for (let i = startIndex + 1; i < lines.length; i++) {
      if (lines[i].startsWith('## [') || lines[i].startsWith('## Unreleased')) {
        endIndex = i;
        break;
      }
    }
    
    if (endIndex === -1) {
      endIndex = lines.length;
    }
    
    // Extract the content between version headers
    const versionContent = lines.slice(startIndex, endIndex);
    
    // Remove the version header line and clean up
    const contentWithoutHeader = versionContent.slice(1)
      .filter(line => !line.startsWith('[') || !line.includes(']: https://'))
      .join('\n')
      .trim();
    
    if (!contentWithoutHeader) {
      return generateFallbackContent(version);
    }
    
    return contentWithoutHeader;
    
  } catch (error) {
    console.error('Error reading changelog:', error);
    return generateFallbackContent(version);
  }
}

/**
 * Generate fallback content if changelog extraction fails
 * @param {string} version - The version being released
 * @returns {string} - Fallback release notes
 */
function generateFallbackContent(version) {
  return `## Release ${version}

This release includes various improvements and bug fixes.

### Installation
\`\`\`bash
npm install dynatrace-mcp-server@${version}
\`\`\`

For development version:
\`\`\`bash
npm install dynatrace-mcp-server-dev@${version}
\`\`\`

See [CHANGELOG.md](CHANGELOG.md) for detailed changes.`;
}

// If called directly from command line
if (require.main === module) {
  const version = process.argv[2];
  const isDev = process.argv[3] === 'true';
  
  if (!version) {
    console.error('Usage: node extract-changelog.js <version> [isDev]');
    process.exit(1);
  }
  
  const changelogContent = extractChangelogForVersion(version);
  
  // Add installation instructions based on build type
  const packageName = isDev ? 'dynatrace-mcp-server-dev' : 'dynatrace-mcp-server';
  const releaseType = isDev ? 'Development Release' : 'Production Release';
  
  const finalContent = `# ${releaseType} ${version}

${changelogContent}

## Installation

\`\`\`bash
npm install ${packageName}@${version}
\`\`\`

## Documentation

- [README.md](README.md) - Complete setup and usage guide
- [CHANGELOG.md](CHANGELOG.md) - Full version history`;

  console.log(finalContent);
}

module.exports = { extractChangelogForVersion, generateFallbackContent };
