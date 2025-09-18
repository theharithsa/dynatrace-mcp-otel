// Build validation helper
// This file helps identify compilation issues

// Check if all required tools are properly imported and exported
import { addEntityTags } from './capabilities/add-entity-tags.js';

// Validate the tool structure
console.log('Handler function:', typeof addEntityTags);

export { addEntityTags };
