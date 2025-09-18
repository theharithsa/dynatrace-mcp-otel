import {
  getGrailBudgetTracker,
  resetGrailBudgetTracker,
  clearGrailBudgetTracker,
  addBytesScanned,
  getBudgetStatus,
  getBudgetWarning,
  wouldExceedBudget,
  enforceBudgetLimit,
  BudgetState,
  BudgetWarning
} from './grail-budget-tracker';

describe('Grail Budget Tracker', () => {
  const testBudgetGB = 10; // 10 GB for testing
  const testBudgetBytes = 10 * 1000 * 1000 * 1000; // 10 billion bytes

  beforeEach(() => {
    // Clear the global tracker completely before each test
    clearGrailBudgetTracker();
  });

  describe('GrailBudgetTracker class', () => {
    it('should initialize with correct budget limits', () => {
      const tracker = getGrailBudgetTracker(testBudgetGB);
      const state = tracker.getState();

      expect(state.budgetLimitGB).toBe(testBudgetGB);
      expect(state.budgetLimitBytes).toBe(testBudgetBytes);
      expect(state.totalBytesScanned).toBe(0);
      expect(state.isBudgetExceeded).toBe(false);
      expect(state.warningThreshold).toBe(testBudgetBytes * 0.8); // 80% threshold
    });

    it('should track bytes scanned correctly', () => {
      const tracker = getGrailBudgetTracker(testBudgetGB);
      const testBytes = 1000000000; // 1 GB
      
      const warning = tracker.addBytesScanned(testBytes);
      const state = tracker.getState();

      expect(state.totalBytesScanned).toBe(testBytes);
      expect(state.isBudgetExceeded).toBe(false);
      expect(warning).toBeNull(); // Should not warn for 1GB out of 10GB
    });

    it('should warn when approaching budget limit (80%)', () => {
      const tracker = getGrailBudgetTracker(testBudgetGB);
      const warningThresholdBytes = testBudgetBytes * 0.85; // 85% to trigger warning
      
      const warning = tracker.addBytesScanned(warningThresholdBytes);
      
      expect(warning).not.toBeNull();
      expect(warning?.type).toBe('approaching');
      expect(warning?.usagePercentage).toBeCloseTo(85, 1);
      expect(warning?.message).toContain('Approaching Grail Budget Limit');
    });

    it('should warn when budget is exceeded', () => {
      const tracker = getGrailBudgetTracker(testBudgetGB);
      const exceedingBytes = testBudgetBytes * 1.1; // 110% to exceed budget
      
      const warning = tracker.addBytesScanned(exceedingBytes);
      
      expect(warning).not.toBeNull();
      expect(warning?.type).toBe('exceeded');
      expect(warning?.usagePercentage).toBeCloseTo(110, 1);
      expect(warning?.message).toContain('Grail Budget Exceeded');
    });

    it('should check if budget would be exceeded', () => {
      const tracker = getGrailBudgetTracker(testBudgetGB);
      
      // Add some bytes (50% of budget)
      tracker.addBytesScanned(testBudgetBytes * 0.5);
      
      // Check if adding more would exceed
      expect(tracker.wouldExceedBudget(testBudgetBytes * 0.4)).toBe(false); // 90% total
      expect(tracker.wouldExceedBudget(testBudgetBytes * 0.6)).toBe(true);  // 110% total
    });

    it('should reset correctly', () => {
      const tracker = getGrailBudgetTracker(testBudgetGB);
      
      // Add some bytes
      tracker.addBytesScanned(testBudgetBytes * 0.5);
      expect(tracker.getState().totalBytesScanned).toBeGreaterThan(0);
      
      // Reset
      tracker.reset();
      expect(tracker.getState().totalBytesScanned).toBe(0);
      expect(tracker.getState().isBudgetExceeded).toBe(false);
    });
  });

  describe('Global tracker functions', () => {
    it('should return the same tracker instance', () => {
      const tracker1 = getGrailBudgetTracker(testBudgetGB);
      const tracker2 = getGrailBudgetTracker(testBudgetGB);
      
      expect(tracker1).toBe(tracker2);
    });

    it('should add bytes through global function', () => {
      const warning = addBytesScanned(1000000000, testBudgetGB); // 1 GB
      const status = getBudgetStatus(testBudgetGB);
      
      expect(warning).toBeNull();
      expect(status.totalBytesScanned).toBe(1000000000);
    });

    it('should check if would exceed budget through global function', () => {
      // Add 80% of budget
      addBytesScanned(testBudgetBytes * 0.8, testBudgetGB);
      
      // Check if adding more would exceed
      expect(wouldExceedBudget(testBudgetBytes * 0.15, testBudgetGB)).toBe(false); // 95% total
      expect(wouldExceedBudget(testBudgetBytes * 0.25, testBudgetGB)).toBe(true);  // 105% total
    });

    it('should enforce budget limit', () => {
      // Add bytes to exceed budget
      addBytesScanned(testBudgetBytes * 1.1, testBudgetGB);
      
      expect(() => enforceBudgetLimit(testBudgetGB)).toThrow();
      expect(() => enforceBudgetLimit(testBudgetGB)).toThrow(/budget exceeded/i);
    });

    it('should not throw when budget is not exceeded', () => {
      // Add bytes within budget
      addBytesScanned(testBudgetBytes * 0.5, testBudgetGB);
      
      expect(() => enforceBudgetLimit(testBudgetGB)).not.toThrow();
    });

    it('should format budget warning correctly', () => {
      const warning: BudgetWarning = {
        type: 'approaching',
        message: 'Test warning message',
        usagePercentage: 85.5
      };
      
      const formattedWarning = getBudgetWarning(warning);
      expect(formattedWarning).toBe('Test warning message');
      
      const nullWarning = getBudgetWarning(null);
      expect(nullWarning).toBeNull();
    });

    it('should handle multiple budget trackers with different limits', () => {
      // Use different budget limits
      const tracker1 = getGrailBudgetTracker(5);  // 5 GB
      const tracker2 = getGrailBudgetTracker(10); // 10 GB - this should return same instance
      
      // Should return the same instance (global tracker)
      expect(tracker1).toBe(tracker2);
      
      // The budget limit should be from the first initialization (5GB)
      expect(tracker1.getState().budgetLimitGB).toBe(5);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle zero budget gracefully', () => {
      const tracker = getGrailBudgetTracker(0);
      const state = tracker.getState();
      
      expect(state.budgetLimitGB).toBe(0);
      expect(state.budgetLimitBytes).toBe(0);
      
      // Any bytes added should exceed the budget
      const warning = tracker.addBytesScanned(1);
      expect(warning?.type).toBe('exceeded');
    });

    it('should handle negative values gracefully', () => {
      const tracker = getGrailBudgetTracker(testBudgetGB);
      
      // Adding negative bytes shouldn't break anything
      const warning = tracker.addBytesScanned(-1000);
      const state = tracker.getState();
      
      expect(state.totalBytesScanned).toBe(-1000);
      expect(warning).toBeNull(); // Negative usage shouldn't trigger warnings
    });

    it('should handle very large numbers', () => {
      const largeBudget = 1000000; // 1 million GB
      const tracker = getGrailBudgetTracker(largeBudget);
      const largeBytes = 500000 * 1000 * 1000 * 1000; // 500 TB
      
      const warning = tracker.addBytesScanned(largeBytes);
      
      expect(warning).toBeNull(); // Should be within budget
      expect(tracker.getState().totalBytesScanned).toBe(largeBytes);
    });
  });
});