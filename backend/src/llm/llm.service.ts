import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { LlmCallOptions } from './interfaces';

@Injectable()
export class LlmService {
  private client: Anthropic;
  private defaultModel = 'claude-sonnet-4-6';

  constructor(private config: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async call(options: LlmCallOptions): Promise<string> {
    const response = await this.client.messages.create({
      model: options.model ?? this.defaultModel,
      max_tokens: options.maxTokens ?? 2000,
      temperature: options.temperature ?? 0.7,
      system: options.system,
      messages: [{ role: 'user', content: options.user }],
    });

    const block = response.content[0];
    if (block.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }
    return block.text;
  }

  async callJson<T>(options: LlmCallOptions): Promise<T> {
    const text = await this.call({
      ...options,
      system:
        options.system +
        '\n\nIMPORTANT: Respond with ONLY valid JSON. No prose, no markdown fences, no commentary.',
    });

    const cleaned = text.replace(/```json\n?|```\n?/g, '').trim();

    try {
      return JSON.parse(cleaned) as T;
    } catch (err) {
      throw new Error(
        `Failed to parse LLM JSON response: ${err as Error}.message}\nRaw response: ${text}`,
      );
    }
  }
}
