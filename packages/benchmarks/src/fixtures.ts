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

// HTML code samples
export const smallHtml = `
<div class="container">
  <h1>Hello World</h1>
</div>
`

export const mediumHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <nav class="navbar">
      <a href="/" class="logo">My Site</a>
      <ul class="nav-links">
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main class="content">
    <article>
      <h1>Welcome to My Site</h1>
      <p>This is a sample paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      <img src="image.jpg" alt="Sample image" width="600" height="400">
    </article>
  </main>

  <footer>
    <p>&copy; 2024 My Site. All rights reserved.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>
`

// CSS code samples
export const smallCss = `
.container {
  max-width: 1200px;
  margin: 0 auto;
}
`

export const mediumCss = `
/* Reset styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Typography */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

/* Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.site-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Links */
a {
  color: inherit;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

a:hover {
  opacity: 0.8;
}

/* Media queries */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
  }
}
`
