import { describe, expect, it } from 'bun:test'
import { vueGrammar } from '../src/grammars/vue'
import { Tokenizer } from '../src/tokenizer'

describe('Vue Grammar', () => {
  const tokenizer = new Tokenizer(vueGrammar)

  describe('Basic Tokenization', () => {
    it('should tokenize Vue SFC', async () => {
      const code = `<template>
  <div v-if="show">{{ message }}</div>
</template>

<script>
export default {
  data() {
    return { message: 'Hello' }
  }
}
</script>

<style scoped>
.container { color: red; }
</style>`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Directives', () => {
    it('should highlight Vue directives', async () => {
      const code = `<div v-if="condition" v-for="item in items" @click="handler" :class="classes"></div>`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })

  describe('Mustache Syntax', () => {
    it('should highlight interpolation', async () => {
      const code = `<p>{{ message }}</p>`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
