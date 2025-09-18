/**
 * Grail Budget Tracking System
 * 
 * Tracks the bytes scanned by DQL queries to help users monitor their Grail consumption
 * and avoid unexpected costs. Provides warnings when approaching budget limits and
 * enforces budget constraints when exceeded.
 */

export interface BudgetState {
  totalBytesScanned: number;
  budgetLimitBytes: number;
  budgetLimitGB: number;
  isBudgetExceeded: boolean;
  warningThreshold: number; // 80% of budget
}

export interface BudgetWarning {
  type: 'approaching' | 'exceeded';
  message: string;
  usagePercentage: number;
}

class GrailBudgetTracker {
  private totalBytesScanned: number = 0;
  private budgetLimitBytes: number;
  private budgetLimitGB: number;
  private warningThreshold: number;

  constructor(budgetLimitGB: number) {
    this.budgetLimitGB = budgetLimitGB;
    this.budgetLimitBytes = budgetLimitGB * 1000 * 1000 * 1000; // Convert GB to bytes (base 1000)
    this.warningThreshold = this.budgetLimitBytes * 0.8; // 80% threshold
  }

  /**
   * Add bytes scanned to the total and return any warnings
   */
  addBytesScanned(bytes: number): BudgetWarning | null {
    this.totalBytesScanned += bytes;
    
    const usagePercentage = (this.totalBytesScanned / this.budgetLimitBytes) * 100;

    // Check if budget exceeded
    if (this.totalBytesScanned >= this.budgetLimitBytes) {
      return {
        type: 'exceeded',
        message: `🚫 **Grail Budget Exceeded!** (${usagePercentage.toFixed(1)}% of ${this.budgetLimitGB} GB limit used)\n\nYour session has exceeded the Grail query budget limit. No further DQL queries will be executed until you reset the budget using the "reset_grail_budget" tool.\n\nConsider optimizing your queries or increasing the DT_GRAIL_QUERY_BUDGET_GB environment variable.`,
        usagePercentage
      };
    }

    // Check if approaching budget limit
    if (this.totalBytesScanned >= this.warningThreshold) {
      return {
        type: 'approaching',
        message: `⚠️ **Approaching Grail Budget Limit!** (${usagePercentage.toFixed(1)}% of ${this.budgetLimitGB} GB limit used)\n\nYou are approaching your Grail query budget limit. Consider optimizing your queries or resetting the budget if needed.`,
        usagePercentage
      };
    }

    return null;
  }

  /**
   * Check if the budget would be exceeded by adding the given bytes
   */
  wouldExceedBudget(additionalBytes: number): boolean {
    return (this.totalBytesScanned + additionalBytes) >= this.budgetLimitBytes;
  }

  /**
   * Get current budget state
   */
  getState(): BudgetState {
    return {
      totalBytesScanned: this.totalBytesScanned,
      budgetLimitBytes: this.budgetLimitBytes,
      budgetLimitGB: this.budgetLimitGB,
      isBudgetExceeded: this.totalBytesScanned >= this.budgetLimitBytes,
      warningThreshold: this.warningThreshold
    };
  }

  /**
   * Reset the budget tracker
   */
  reset(): void {
    this.totalBytesScanned = 0;
  }

  /**
   * Check if budget is currently exceeded
   */
  isBudgetExceeded(): boolean {
    return this.totalBytesScanned >= this.budgetLimitBytes;
  }
}

// Global tracker instance
let globalTracker: GrailBudgetTracker | null = null;

/**
 * Get or create the global budget tracker
 */
export function getGrailBudgetTracker(budgetLimitGB: number): GrailBudgetTracker {
  if (!globalTracker) {
    globalTracker = new GrailBudgetTracker(budgetLimitGB);
  }
  return globalTracker;
}

/**
 * Reset the global budget tracker
 */
export function resetGrailBudgetTracker(): void {
  if (globalTracker) {
    globalTracker.reset();
  }
}

/**
 * Clear the global budget tracker completely (for testing)
 */
export function clearGrailBudgetTracker(): void {
  globalTracker = null;
}

/**
 * Add bytes scanned to the global tracker
 */
export function addBytesScanned(bytes: number, budgetLimitGB: number): BudgetWarning | null {
  const tracker = getGrailBudgetTracker(budgetLimitGB);
  return tracker.addBytesScanned(bytes);
}

/**
 * Get the current budget status
 */
export function getBudgetStatus(budgetLimitGB: number): BudgetState {
  const tracker = getGrailBudgetTracker(budgetLimitGB);
  return tracker.getState();
}

/**
 * Get a formatted budget warning message
 */
export function getBudgetWarning(warning: BudgetWarning | null): string | null {
  if (!warning) {
    return null;
  }
  return warning.message;
}

/**
 * Check if adding bytes would exceed budget (for pre-query validation)
 */
export function wouldExceedBudget(additionalBytes: number, budgetLimitGB: number): boolean {
  const tracker = getGrailBudgetTracker(budgetLimitGB);
  return tracker.wouldExceedBudget(additionalBytes);
}

/**
 * Enforce budget limit - throws error if budget exceeded
 */
export function enforceBudgetLimit(budgetLimitGB: number): void {
  const tracker = getGrailBudgetTracker(budgetLimitGB);
  if (tracker.isBudgetExceeded()) {
    const state = tracker.getState();
    const usagePercentage = (state.totalBytesScanned / state.budgetLimitBytes) * 100;
    throw new Error(
      `Grail budget exceeded (${usagePercentage.toFixed(1)}% of ${budgetLimitGB} GB limit used). ` +
      `Use the "reset_grail_budget" tool to reset the budget and continue querying.`
    );
  }
}
