import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { QdrantClient } from '@qdrant/js-client-rest';
import axios from 'axios';

@Injectable()
export class HealthService {
  private anthropic: Anthropic;
  private qdrant: QdrantClient;
  private ollamaUrl: string | undefined;

  constructor(private config: ConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.config.get<string>('ANTHROPIC_API_KEY'),
    });
    this.qdrant = new QdrantClient({
      url: this.config.get<string>('QDRANT_URL'),
    });
    this.ollamaUrl = this.config.get<string>('OLLAMA_URL');
  }

  async checkClaude(): Promise<{
    ok: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 50,
        messages: [
          {
            role: 'user',
            content: 'Say "hello from Claude" and nothing else.',
          },
        ],
      });
      const text =
        response.content[0].type === 'text' ? response.content[0].text : '';
      return { ok: true, message: text };
    } catch (err) {
      return { ok: false, error: (err as Error)?.message };
    }
  }

  async checkOllama(): Promise<{
    ok: boolean;
    dimensions?: number;
    error?: string;
  }> {
    try {
      const response = await axios.post<{ embedding: number[] }>(
        `${this.ollamaUrl}/api/embeddings`,
        {
          model: 'nomic-embed-text',
          prompt: 'hello world',
        },
      );
      return { ok: true, dimensions: response.data.embedding.length };
    } catch (err) {
      return { ok: false, error: (err as Error)?.message };
    }
  }

  async checkQdrant(): Promise<{
    ok: boolean;
    message?: string;
    error?: string;
  }> {
    const collectionName = 'health_check_test';
    try {
      const existing = await this.qdrant.getCollections();
      const exists = existing.collections.some(
        (c) => c.name === collectionName,
      );
      if (exists) {
        await this.qdrant.deleteCollection(collectionName);
      }

      await this.qdrant.createCollection(collectionName, {
        vectors: { size: 4, distance: 'Cosine' },
      });

      await this.qdrant.upsert(collectionName, {
        wait: true,
        points: [
          { id: 1, vector: [0.1, 0.2, 0.3, 0.4], payload: { text: 'test' } },
        ],
      });

      const results = await this.qdrant.search(collectionName, {
        vector: [0.1, 0.2, 0.3, 0.4],
        limit: 1,
      });

      await this.qdrant.deleteCollection(collectionName);

      return {
        ok: true,
        message: `Found ${results.length} result(s), score: ${results[0]?.score.toFixed(3)}`,
      };
    } catch (err) {
      return { ok: false, error: (err as Error)?.message };
    }
  }

  async checkAll() {
    const [claude, ollama, qdrant] = await Promise.all([
      this.checkClaude(),
      this.checkOllama(),
      this.checkQdrant(),
    ]);

    return {
      allOk: claude.ok && ollama.ok && qdrant.ok,
      claude,
      ollama,
      qdrant,
    };
  }
}
