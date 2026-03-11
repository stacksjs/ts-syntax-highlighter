# Supported Languages

ts-syntax-highlighter provides comprehensive support for 48 languages across web development, systems programming, data formats, and specialized domains.

## Web & Frontend (10 Languages)

### JavaScript / JSX

Full support for modern JavaScript including ES2024+ features:

```javascript
// Modern JavaScript features
const greeting = `Hello, ${name}!`
const sum = numbers?.reduce((a, b) => a + b, 0) ?? 0
const bigNum = 123_456_789n
const privateField = #value

// JSX support
const App = () => (
  <div className="app">
    <Header title="Welcome" />
    {items.map(item => <Item key={item.id} {...item} />)}
  </div>
)
```

**Features**: Template literals, async/await, destructuring, spread operators, optional chaining, nullish coalescing, BigInt, private fields, decorators, JSX expressions

### TypeScript / TSX

Complete TypeScript support with type annotations and generics:

```typescript
// Type annotations and generics
interface User<T extends Record<string, unknown>> {
  id: number
  data: T
  readonly createdAt: Date
}

// Utility types
type PartialUser = Partial<User<{ name: string }>>
type UserKeys = keyof User<unknown>

// TSX with generics
function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>
}
```

**Features**: Type annotations, interfaces, generics, type operators, utility types, enums, decorators, TSX

### HTML

HTML5 with data attributes and event handlers:

```html
<article class="post" data-id="123" aria-label="Blog post">
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p onclick="handleClick(event)">Click me</p>
  </main>
</article>
```

### CSS

Modern CSS including CSS4 features:

```css
/* Modern color functions */
.element {
  color: oklch(70% 0.15 240);
  background: color-mix(in lab, red 50%, blue);
}

/* Container queries */
@container sidebar (width > 300px) {
  .card { flex-direction: row; }
}

/* CSS layers */
@layer base, components, utilities;

/* Custom properties */
:root {
  --spacing-unit: 8px;
  --primary-color: hsl(220 90% 50%);
}
```

**Features**: Custom properties, calc(), color functions (hwb, lab, lch, oklab, oklch), container queries, CSS layers, nesting, trigonometry functions

### SCSS / Sass

Variables, nesting, mixins, and functions:

```scss
$primary-color: #3178c6;

@mixin button-styles($color) {
  background: $color;
  &:hover {
    background: darken($color, 10%);
  }
}

.btn {
  @include button-styles($primary-color);
}
```

### Vue

Single-file components with directives:

```vue
<template>
  <div v-if="show" @click="handleClick">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
const show = ref(true)
const message = computed(() => 'Hello')
</script>
```

## Data & Configuration (8 Languages)

### JSON / JSONC / JSON5

```jsonc
{
  // Comments allowed in JSONC
  "name": "ts-syntax-highlighter",
  "version": "0.2.1",
  "features": ["fast", "typed"]
}
```

```json5
{
  // JSON5 features
  unquotedKey: 'value',
  trailingComma: true,
}
```

### YAML

```yaml
name: CI Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: bun test
```

### TOML

```toml
[package]
name = "my-app"
version = "1.0.0"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
```

### XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration xmlns="http://example.com/config">
  <setting name="debug" value="true" />
</configuration>
```

## System & Compiled Languages (10 Languages)

### Rust

```rust
#[derive(Debug, Clone)]
struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}

async fn fetch_data<'a>(url: &'a str) -> Result<String, Error> {
    let response = reqwest::get(url).await?;
    Ok(response.text().await?)
}
```

**Features**: Ownership, traits, macros, lifetimes, async/await, pattern matching

### Go

```go
package main

import (
    "fmt"
    "sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for job := range jobs {
        results <- job * 2
    }
}
```

**Features**: Goroutines, channels, interfaces, defer, error handling

### C / C++

```cpp
#include <iostream>
#include <vector>
#include <memory>

template<typename T>
class Container {
private:
    std::vector<T> items;
public:
    void add(T item) { items.push_back(std::move(item)); }
    const T& get(size_t index) const { return items[index]; }
};

int main() {
    auto container = std::make_unique<Container<std::string>>();
    container->add("Hello");
    return 0;
}
```

**Features**: Templates, namespaces, RAII, modern C++ (C++11/14/17/20)

### C#

```csharp
using System.Linq;

public record Person(string Name, int Age);

public class DataService
{
    public async Task<IEnumerable<Person>> GetPeopleAsync()
    {
        var people = await _repository.GetAllAsync();
        return people.Where(p => p.Age >= 18)
                     .OrderBy(p => p.Name);
    }
}
```

**Features**: LINQ, async/await, records, pattern matching, attributes

### Java

```java
@Service
public class UserService {
    private final UserRepository repository;

    public Optional<User> findById(Long id) {
        return repository.findById(id)
            .filter(User::isActive)
            .map(this::enrichUser);
    }
}
```

### Swift

```swift
struct User: Codable {
    let name: String
    var email: String?
}

func fetchUsers() async throws -> [User] {
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode([User].self, from: data)
}
```

### Kotlin

```kotlin
data class User(val name: String, val age: Int)

suspend fun getUsers(): List<User> = coroutineScope {
    val users = async { fetchFromApi() }
    users.await().filter { it.age >= 18 }
}
```

### Dart

```dart
class Counter with ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}
```

## Shell & DevOps (7 Languages)

### Bash / Shell

```bash
#!/bin/bash

# Variables and functions
export PATH="$HOME/.local/bin:$PATH"

deploy() {
    local env="${1:-production}"
    echo "Deploying to $env..."

    if [[ -f "config.$env.json" ]]; then
        npm run build -- --env "$env"
        rsync -avz ./dist/ "server:/var/www/$env/"
    fi
}

# Pipes and control flow
find . -name "*.log" | while read -r file; do
    gzip "$file" && rm "$file"
done
```

**Features**: Variables, pipes, functions, control flow, arrays, heredocs

### PowerShell

```powershell
$Users = Get-ADUser -Filter {Enabled -eq $true} |
    Select-Object Name, Email |
    Where-Object { $_.Email -like "*@company.com" }

ForEach-Object -InputObject $Users {
    Send-MailMessage -To $_.Email -Subject "Notice"
}
```

### Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Makefile

```makefile
.PHONY: build test clean

BUILD_DIR := ./dist
SRC_FILES := $(wildcard src/*.ts)

build: $(SRC_FILES)
	@echo "Building..."
	bun build ./src/index.ts --outdir $(BUILD_DIR)

test:
	bun test
```

### Terraform / HCL

```hcl
resource "aws_instance" "web" {
  ami           = var.ami_id
  instance_type = "t3.micro"

  tags = {
    Name = "${var.project}-web"
    Environment = var.environment
  }
}
```

### Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    location /api {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
    }
}
```

## Scripting Languages (5 Languages)

### Python

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    name: str
    email: Optional[str] = None

async def fetch_users() -> list[User]:
    async with aiohttp.ClientSession() as session:
        async with session.get(API_URL) as response:
            data = await response.json()
            return [User(**item) for item in data]
```

### Ruby

```ruby
class User < ApplicationRecord
  has_many :posts, dependent: :destroy

  scope :active, -> { where(active: true) }

  def full_name
    "#{first_name} #{last_name}".strip
  end
end
```

### PHP

```php
<?php

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->where('active', true)
            ->paginate($request->input('per_page', 15));

        return response()->json($users);
    }
}
```

### Lua

```lua
local function createCounter()
    local count = 0
    return {
        increment = function() count = count + 1 end,
        get = function() return count end
    }
end

local counter = createCounter()
counter.increment()
print(counter.get())
```

### R

```r
library(tidyverse)

data %>%
  filter(!is.na(value)) %>%
  group_by(category) %>%
  summarise(
    mean = mean(value),
    sd = sd(value)
  ) %>%
  arrange(desc(mean))
```

## Specialized Languages

### SQL

```sql
SELECT
    u.name,
    COUNT(o.id) AS order_count,
    SUM(o.total) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id
HAVING total_spent > 1000
ORDER BY total_spent DESC
LIMIT 10;
```

### GraphQL

```graphql
query GetUsers($filter: UserFilter!) {
  users(filter: $filter) {
    id
    name
    posts(first: 5) {
      edges {
        node {
          title
        }
      }
    }
  }
}
```

### Markdown

```markdown
# Heading

**Bold** and *italic* text.

- List item 1
- List item 2

[Link](https://example.com)
```

### Diff

```diff
--- a/file.txt
+++ b/file.txt
@@ -1,3 +1,4 @@
 unchanged line
-removed line
+added line
+another new line
```

### Solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    mapping(address => uint256) public balances;

    event Transfer(address indexed from, address indexed to, uint256 value);

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }
}
```

### STX (Blade-like Templates)

```stx
@extends('layouts.app')

@section('content')
  @if(user.isAuthenticated)
    <h1>Welcome, {{ user.name }}</h1>
    @foreach(posts as post)
      <article>
        <h2>{{ post.title }}</h2>
        {{{ post.content }}}
      </article>
    @endforeach
  @else
    @include('partials.login-form')
  @endif
@endsection
```

**Features**: 50+ directives, components, layouts, includes, control flow, authentication, authorization

## Language Aliases

Common aliases are supported for convenience:

| Language | Aliases |
|----------|---------|
| JavaScript | `js`, `javascript` |
| TypeScript | `ts`, `typescript`, `tsx` |
| Python | `py`, `python` |
| Ruby | `rb`, `ruby` |
| Rust | `rs`, `rust` |
| Bash | `sh`, `bash`, `shell` |
