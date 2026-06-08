import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class EmbeddingsService {
  private ollamaUrl: string | undefined;
  private model = 'nomic-embed-text';

  constructor(private config: ConfigService) {
    this.ollamaUrl = this.config.get<string>('OLLAMA_URL');
  }

  async embed(text: string): Promise<number[]> {
    const response = await axios.post<{ embedding: number[] }>(
      `${this.ollamaUrl}/api/embeddings`,
      {
        model: this.model,
        prompt: text,
      },
    );

    return response.data.embedding;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    // Ollama doesn't have native batch, so we parallelize
    return Promise.all(texts.map((t) => this.embed(t)));
  }
}
