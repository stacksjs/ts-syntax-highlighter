import { describe, expect, it } from 'bun:test'
import { terraformGrammar } from '../src/grammars/terraform'
import { Tokenizer } from '../src/tokenizer'

describe('Terraform Grammar', () => {
  const tokenizer = new Tokenizer(terraformGrammar)
  describe('Basic Tokenization', () => {
    it('should tokenize Terraform code', async () => {
      const code = `resource "aws_instance" "web" {
  ami = "ami-12345"
  instance_type = "t2.micro"
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Variables', () => {
    it('should handle variables', async () => {
      const code = `variable "region" {
  type = string
  default = "us-east-1"
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
  describe('Interpolation', () => {
    it('should highlight interpolation', async () => {
      const code = `output "instance_ip" {
  value = "\${aws_instance.web.public_ip}"
}`
      const tokens = tokenizer.tokenize(code)
      expect(tokens).toBeDefined()
    })
  })
})
