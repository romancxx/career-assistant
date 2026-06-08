export interface LlmCallOptions {
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}
