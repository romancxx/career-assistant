import { randomUUID } from "crypto";

import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QdrantClient } from "@qdrant/js-client-rest";

import { CollectionName } from "@/qdrant/interfaces";

const VECTOR_SIZE = 768; // nomic-embed-text dimension

@Injectable()
export class QdrantService implements OnModuleInit {
  private readonly logger = new Logger(QdrantService.name);
  private client: QdrantClient;

  constructor(private config: ConfigService) {
    this.client = new QdrantClient({
      url: this.config.get<string>("QDRANT_URL"),
    });
  }

  async onModuleInit() {
    // Auto-create collections on startup if missing
    await this.ensureCollection("pitches");
    await this.ensureCollection("experiences");
    await this.ensureCollection("skills");
    await this.ensureCollection("rules");
  }

  // Drop a collection and recreate it empty. Used by `seed --reset`
  async recreateCollection(name: CollectionName) {
    await this.client.deleteCollection(name);
    await this.ensureCollection(name);
  }

  private async ensureCollection(name: CollectionName) {
    const existing = await this.client.getCollections();
    const exists = existing.collections.some((c) => c.name === name);
    if (!exists) {
      await this.client.createCollection(name, {
        vectors: { size: VECTOR_SIZE, distance: "Cosine" },
      });
      this.logger.log(`Created collection: ${name}`);
    }
  }

  async upsert(
    collection: CollectionName,
    vector: number[],
    payload: Record<string, any>,
    id?: string,
  ): Promise<string> {
    const pointId = id ?? randomUUID();
    await this.client.upsert(collection, {
      wait: true,
      points: [{ id: pointId, vector, payload }],
    });
    return pointId;
  }

  async search(
    collection: CollectionName,
    vector: number[],
    limit: number = 5,
    filter?: Record<string, any>,
  ) {
    return this.client.search(collection, {
      vector,
      limit,
      with_payload: true,
      filter,
    });
  }

  async getAll(collection: CollectionName, filter?: Record<string, any>) {
    const result = await this.client.scroll(collection, {
      limit: 100,
      with_payload: true,
      filter,
    });
    return result.points;
  }

  async delete(collection: CollectionName, id: string) {
    await this.client.delete(collection, {
      wait: true,
      points: [id],
    });
  }
}
