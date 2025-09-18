import { describe, it, expect } from '@jest/globals';
import { DqlResponse } from './execute-dql';
import * as budgetTracker from '../utils/grail-budget-tracker';

// Simple unit tests for DQL response structure and budget integration
describe('execute-dql', () => {
  describe('DqlResponse interface', () => {
    it('should have correct structure for response', () => {
      const response: DqlResponse = {
        records: [{ timestamp: '2024-01-01', count: 100 }],
        scannedBytes: 1024,
        scannedRecords: 10,
        sampled: false
      };

      expect(response.records).toBeDefined();
      expect(response.scannedBytes).toBe(1024);
      expect(response.scannedRecords).toBe(10);
      expect(response.sampled).toBe(false);
    });

    it('should support budget warning and state', () => {
      const response: DqlResponse = {
        records: [],
        budgetWarning: 'Approaching limit',
        budgetState: {
          totalBytesScanned: 8000000000,
          budgetLimitBytes: 10000000000,
          budgetLimitGB: 10
        }
      };

      expect(response.budgetWarning).toBe('Approaching limit');
      expect(response.budgetState?.budgetLimitGB).toBe(10);
    });

    it('should support undefined records for empty results', () => {
      const response: DqlResponse = {
        records: undefined,
        scannedBytes: 0
      };

      expect(response.records).toBeUndefined();
      expect(response.scannedBytes).toBe(0);
    });
  });

  describe('budget tracker integration tests', () => {
    it('should use budget tracker functions correctly', () => {
      // Test that we can import and use the budget tracker functions
      const { 
        getGrailBudgetTracker, 
        addBytesScanned, 
        getBudgetWarning,
        clearGrailBudgetTracker
      } = budgetTracker;

      clearGrailBudgetTracker();
      
      // Create a tracker
      const tracker = getGrailBudgetTracker(10);
      expect(tracker.getState().budgetLimitGB).toBe(10);

      // Add some bytes
      const warning = addBytesScanned(1000000, 10);
      expect(warning).toBeNull(); // Within budget

      // Format warning
      const formattedWarning = getBudgetWarning(warning);
      expect(formattedWarning).toBeNull();
    });

    it('should create correct budget warning structure', () => {
      const warning: budgetTracker.BudgetWarning = {
        type: 'approaching',
        message: 'Test message',
        usagePercentage: 85.5
      };

      expect(warning.type).toBe('approaching');
      expect(warning.message).toBe('Test message');
      expect(warning.usagePercentage).toBe(85.5);
    });

    it('should create correct budget state structure', () => {
      const state: budgetTracker.BudgetState = {
        totalBytesScanned: 5000000000,
        budgetLimitBytes: 10000000000,
        budgetLimitGB: 10,
        isBudgetExceeded: false,
        warningThreshold: 8000000000
      };

      expect(state.budgetLimitGB).toBe(10);
      expect(state.isBudgetExceeded).toBe(false);
    });
  });
});