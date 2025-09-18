import { HttpClient } from '@dynatrace-sdk/http-client';
import { 
  PublicClient,
  Nl2DqlResponse,
  Dql2NlResponse,
  ConversationResponse,
  ConversationContext
} from '@dynatrace-sdk/client-davis-copilot';

/**
 * Davis CoPilot API Integration (Updated to use official SDK)
 *
 * This module provides access to Davis CoPilot AI capabilities including:
 * - Natural Language to DQL conversion
 * - DQL explanation in plain English
 * - AI-powered conversation assistance
 * - Feedback submission for continuous improvement
 *
 * Note: While Davis CoPilot AI is generally available (GA),
 * the Davis CoPilot APIs are currently in preview.
 * For more information: https://dt-url.net/copilot-community
 *
 * DQL (Dynatrace Query Language) is the most powerful way to query any data
 * in Dynatrace, including problem events, security issues, logs, metrics, and spans.
 */

// Using types from @dynatrace-sdk/client-davis-copilot

export interface State {
  version?: string;
  conversationId?: string;
  skillName?: string;
  history?: Array<{
    role: string;
    text: string;
    supplementary?: string | null;
  }>;
}

export interface Metadata {
  notifications?: Notification[];
}

export interface MetadataWithSource extends Metadata {
  sources?: SourceDocument[];
}

export interface Notification {
  severity?: string;
  notificationType?: string;
  message?: string;
}

export interface SourceDocument {
  title?: string;
  url?: string;
  type?: string;
}

export interface Nl2DqlFeedbackRequest {
  messageToken: string;
  origin: string;
  feedback: Nl2DqlFeedback;
  userQuery: string;
  queryExplanation?: string;
  generatedDql?: string;
}

export interface Nl2DqlFeedback {
  type: 'positive' | 'negative';
  text?: string;
  category?: string;
  improvement?: Nl2DqlImprovedSummary;
}

export interface Nl2DqlImprovedSummary {
  text: string;
  confirmation: boolean;
}

export interface Dql2NlFeedbackRequest {
  messageToken: string;
  origin: string;
  feedback: Dql2NlFeedback;
  userQuery: string;
  queryExplanation?: string;
  generatedDql?: string;
}

export interface Dql2NlFeedback {
  type: 'positive' | 'negative';
  text?: string;
  category?: string;
  improvement?: Dql2NlImprovedSummary;
}

export interface Dql2NlImprovedSummary {
  text: string;
  confirmation: boolean;
}

export interface ConversationFeedbackRequest {
  messageToken: string;
  origin: string;
  feedback: ConversationFeedback;
  userPrompt?: string;
  copilotResponse?: string;
  sources?: string[];
}

export interface ConversationFeedback {
  type: 'positive' | 'negative';
  text?: string;
  category?: string;
  improvement?: ConversationImprovedSummary;
}

export interface ConversationImprovedSummary {
  text: string;
  confirmation: boolean;
}

// API Functions

/**
 * Generate DQL from natural language
 * Converts plain English descriptions into powerful Dynatrace Query Language (DQL) statements.
 * DQL is the most powerful way to query any data in Dynatrace, including problem events,
 * security issues, logs, metrics, spans, and custom data.
 */
export const generateDqlFromNaturalLanguage = async (dtClient: HttpClient, text: string): Promise<Nl2DqlResponse> => {
  const publicClient = new PublicClient(dtClient);
  
  const response = await publicClient.nl2dql({
    body: { text }
  });

  return response;
};

/**
 * Explain DQL in natural language
 * Provides plain English explanations of complex DQL queries.
 * Helps users understand what powerful DQL statements do, including
 * queries for problem events, security issues, and performance metrics.
 */
export const explainDqlInNaturalLanguage = async (dtClient: HttpClient, dql: string): Promise<Dql2NlResponse> => {
  const publicClient = new PublicClient(dtClient);
  
  const response = await publicClient.dql2nl({
    body: { dql }
  });

  return response;
};

export const chatWithDavisCopilot = async (
  dtClient: HttpClient,
  text: string,
  context?: ConversationContext[],
): Promise<ConversationResponse> => {
  // For now, continue using the manual HTTP approach since SDK integration is complex
  const response = await dtClient.send({
    method: 'POST',
    url: '/platform/davis/copilot/v0.2/skills/conversations:message',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      text,
      context
    }),
  });

  return await response.body('json');
};
