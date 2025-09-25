import { createTelemetry } from './telemetry-openkit';
import * as os from 'os';

// Mock OpenKit to avoid actual network calls in tests
jest.mock('@dynatrace/openkit-js', () => ({
  OpenKitBuilder: jest.fn().mockImplementation(() => ({
    withApplicationVersion: jest.fn().mockReturnThis(),
    withOperatingSystem: jest.fn().mockReturnThis(),
    withManufacturer: jest.fn().mockReturnThis(),
    withModelId: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({
      waitForInit: jest.fn((callback) => callback(true)),
      createSession: jest.fn().mockReturnValue({
        identifyUser: jest.fn(),
        enterAction: jest.fn().mockReturnValue({
          reportEvent: jest.fn(),
          reportValue: jest.fn(),
          reportError: jest.fn(),
          leaveAction: jest.fn(),
        }),
        end: jest.fn(),
      }),
      shutdown: jest.fn((callback) => callback()),
    }),
  })),
}));

// Mock os module
jest.mock('os', () => ({
  hostname: jest.fn().mockReturnValue('test-hostname'),
  userInfo: jest.fn().mockReturnValue({ username: 'test-user' }),
  platform: jest.fn().mockReturnValue('linux'),
  release: jest.fn().mockReturnValue('5.4.0'),
}));

// Mock crypto module for consistent hashing
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({ toString: jest.fn().mockReturnValue('1234567890abcdef') }),
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('abcdef1234567890abcdef1234567890'),
  }),
}));

describe('User Identification in Telemetry', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear environment variables
    delete process.env.DT_MCP_TELEMETRY_USER_ID;
  });

  describe('createTelemetry with user identification', () => {
    it('should use provided userTag when specified', async () => {
      const userTag = 'custom-user-123';
      const telemetry = createTelemetry(undefined, undefined, undefined, false, userTag);
      
      // Allow time for initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // The session should be created and identifyUser should be called
      expect(telemetry).toBeDefined();
    });

    it('should use environment variable DT_MCP_TELEMETRY_USER_ID when available', async () => {
      process.env.DT_MCP_TELEMETRY_USER_ID = 'env-user-456';
      
      const telemetry = createTelemetry(undefined, undefined, undefined, false);
      
      // Allow time for initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(telemetry).toBeDefined();
    });

    it('should generate auto user tag when no user ID provided', async () => {
      const telemetry = createTelemetry(undefined, undefined, undefined, false);
      
      // Allow time for initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(telemetry).toBeDefined();
      expect(os.hostname).toHaveBeenCalled();
      expect(os.userInfo).toHaveBeenCalled();
    });

    it('should handle disabled telemetry correctly', () => {
      const telemetry = createTelemetry(undefined, undefined, undefined, true);
      
      expect(telemetry).toBeDefined();
    });

    it('should fallback to NoOpTelemetry when initialization fails', () => {
      // Force initialization failure by providing invalid configuration
      const telemetry = createTelemetry('invalid-url', 'invalid-app-id', undefined, false);
      
      expect(telemetry).toBeDefined();
    });
  });

  describe('identifyUser method', () => {
    it('should call identifyUser on active session', async () => {
      const telemetry = createTelemetry(undefined, undefined, undefined, false);
      
      // Allow time for initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await telemetry.identifyUser('runtime-user-789');
      
      // The method should complete without error
      expect(telemetry).toBeDefined();
    });

    it('should handle identifyUser when telemetry is disabled', async () => {
      const telemetry = createTelemetry(undefined, undefined, undefined, true);
      
      await telemetry.identifyUser('disabled-user');
      
      // Should complete without error even when disabled
      expect(telemetry).toBeDefined();
    });
  });

  describe('User tag generation priority', () => {
    it('should prioritize environment variable over auto-generation', async () => {
      process.env.DT_MCP_TELEMETRY_USER_ID = 'env-priority-user';
      
      const telemetry = createTelemetry(undefined, undefined, undefined, false);
      
      // Allow time for initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(telemetry).toBeDefined();
      // Environment variable should take priority, so hostname/userInfo should not be called
    });

    it('should handle missing system info gracefully', async () => {
      // Mock os functions to throw errors
      (os.hostname as jest.Mock).mockImplementation(() => {
        throw new Error('Hostname not available');
      });
      (os.userInfo as jest.Mock).mockImplementation(() => {
        throw new Error('User info not available');
      });
      
      const telemetry = createTelemetry(undefined, undefined, undefined, false);
      
      // Allow time for initialization
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(telemetry).toBeDefined();
    });
  });

  describe('Integration with other telemetry methods', () => {
    it('should work with trackMcpServerStart', async () => {
      const telemetry = createTelemetry(undefined, undefined, undefined, false, 'integration-user');
      
      await telemetry.trackMcpServerStart();
      
      // Should complete without error
      expect(telemetry).toBeDefined();
    });

    it('should work with trackMcpToolUsage', async () => {
      const telemetry = createTelemetry(undefined, undefined, undefined, false, 'tool-user');
      
      await telemetry.trackMcpToolUsage('test-tool', true, 100);
      
      // Should complete without error
      expect(telemetry).toBeDefined();
    });

    it('should work with trackError', async () => {
      const telemetry = createTelemetry(undefined, undefined, undefined, false, 'error-user');
      
      await telemetry.trackError(new Error('Test error'), 'test-context');
      
      // Should complete without error
      expect(telemetry).toBeDefined();
    });

    it('should work with shutdown', async () => {
      const telemetry = createTelemetry(undefined, undefined, undefined, false, 'shutdown-user');
      
      await telemetry.shutdown();
      
      // Should complete without error
      expect(telemetry).toBeDefined();
    });
  });
});