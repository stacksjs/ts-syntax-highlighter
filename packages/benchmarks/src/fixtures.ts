export const smallCode = `
const greeting = "Hello, World!";
console.log(greeting);
`

export const mediumCode = `
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
`

export const largeCode = `
import type { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hash: string;
}

interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  onEvict?: (key: string) => void;
}

export class Cache<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 3600000, // 1 hour
      maxSize: options.maxSize || 1000,
      onEvict: options.onEvict || (() => {}),
    };
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.options.maxSize) {
      this.evictOldest();
    }

    const hash = this.generateHash(value);
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      hash,
    });
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.options.onEvict(key);
      return undefined;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.options.onEvict(key);
    }
    return deleted;
  }

  clear(): void {
    const keys = Array.from(this.cache.keys());
    this.cache.clear();
    keys.forEach(key => this.options.onEvict(key));
  }

  size(): number {
    return this.cache.size;
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > this.options.ttl;
  }

  private evictOldest(): void {
    let oldestKey: string | undefined;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private generateHash(value: T): string {
    return createHash('md5')
      .update(JSON.stringify(value))
      .digest('hex');
  }

  async persist(filepath: string): Promise<void> {
    const data = Array.from(this.cache.entries());
    await writeFile(filepath, JSON.stringify(data, null, 2));
  }

  async restore(filepath: string): Promise<void> {
    try {
      const content = await readFile(filepath, 'utf-8');
      const data = JSON.parse(content) as Array<[string, CacheEntry<T>]>;

      this.cache.clear();
      for (const [key, entry] of data) {
        if (!this.isExpired(entry)) {
          this.cache.set(key, entry);
        }
      }
    } catch (error) {
      console.error('Failed to restore cache:', error);
    }
  }

  toJSON(): object {
    return {
      size: this.cache.size,
      options: this.options,
      entries: Array.from(this.cache.entries()),
    };
  }

  static fromJSON<T>(json: any): Cache<T> {
    const cache = new Cache<T>(json.options);
    for (const [key, entry] of json.entries) {
      cache.cache.set(key, entry);
    }
    return cache;
  }
}

export function cacheMiddleware<T>(
  cache: Cache<T>,
  keyGenerator: (req: Request) => string,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator(req);
    const cached = cache.get(key);

    if (cached) {
      res.json(cached);
      return;
    }

    const originalJson = res.json.bind(res);
    res.json = function (data: T) {
      cache.set(key, data);
      return originalJson(data);
    };

    next();
  };
}
`

// Generate a very large code sample (10,000 lines)
export function generateLargeCode(lines = 10000): string {
  const templates = [
    'function process{N}(data) { return data.map(x => x * 2); }',
    'const value{N} = await fetch("/api/endpoint/{N}");',
    'if (condition{N}) { console.log("Condition {N} met"); }',
    'for (let i = 0; i < {N}; i++) { result.push(i); }',
    'const array{N} = [{N}, {N} + 1, {N} + 2];',
  ]

  const result: string[] = []
  for (let i = 0; i < lines; i++) {
    const template = templates[i % templates.length]
    result.push(template.replace(/{N}/g, String(i)))
  }

  return result.join('\n')
}
