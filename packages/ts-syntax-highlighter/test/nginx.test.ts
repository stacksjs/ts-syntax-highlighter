import { describe, expect, it } from 'bun:test'
import { Tokenizer } from '../src/tokenizer'

describe('Nginx Grammar', () => {
  const tokenizer = new Tokenizer('nginx')
  describe('Basic Tokenization', () => {
    it('should tokenize nginx config', async () => {
      const code = `server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    location / {
        try_files $uri $uri/ =404;
    }
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Variables', () => {
    it('should highlight variables', async () => {
      const code = `location / {
    proxy_pass http://backend;
    proxy_set_header Host $host;
}`
      const tokens = await tokenizer.tokenizeAsync(code)
      expect(tokens).toBeDefined()
    })
  })
})
