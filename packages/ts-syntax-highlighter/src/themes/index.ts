import type { Theme } from '../types'
import { githubDark } from './github-dark'
import { githubLight } from './github-light'
import { nord } from './nord'

export const themes: Theme[] = [
  githubDark,
  githubLight,
  nord,
]

export function getTheme(name: string): Theme | undefined {
  const normalized = name.toLowerCase()
  return themes.find((theme) => {
    const themeName = theme.name.toLowerCase()
    const themeNameDashed = themeName.replace(/\s+/g, '-')
    return themeName === normalized || themeNameDashed === normalized
  })
}

export * from './github-dark'
export * from './github-light'
export * from './nord'
