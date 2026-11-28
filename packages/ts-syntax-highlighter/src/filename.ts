export function basenameForLanguage(filename: string): string {
  return filename.split(/[\\/]/).pop()?.trim().toLowerCase() ?? ''
}

export function isDotenvFilename(name: string): boolean {
  return name === '.env' || name.startsWith('.env.')
}
