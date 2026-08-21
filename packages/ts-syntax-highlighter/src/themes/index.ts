import type { Theme } from '../types'
import { daylight } from './daylight'
import { deuteranopiaDark } from './deuteranopia-dark'
import { deuteranopiaLight } from './deuteranopia-light'
import { dusk } from './dusk'
import { ember } from './ember'
import { githubDark } from './github-dark'
import { githubLight } from './github-light'
import { midnight } from './midnight'
import { monochromeDark } from './monochrome-dark'
import { monochromeLight } from './monochrome-light'
import { moss } from './moss'
import { nord } from './nord'
import { paper } from './paper'
import { sea } from './sea'
import { tritanopiaDark } from './tritanopia-dark'
import { tritanopiaLight } from './tritanopia-light'

/**
 * The first-party themes.
 *
 * Ten ordinary ones and six built for colour-vision deficiency, and the split
 * is the point of the list rather than a footnote on it. Roughly one man in
 * twelve cannot reliably separate red from green, which is the axis nearly
 * every syntax theme ever published spends its two most important colours on -
 * so a reader with a deficiency does not get a slightly worse version of a
 * theme, they get one where two roles are the same colour.
 *
 * The six are not simulations of what those readers see. They are palettes
 * chosen to stay separated *for* them: blue against amber survives red-green
 * deficiency, teal against magenta survives blue-yellow, and the monochrome
 * pair spends no hue at all and separates by lightness, weight and slope.
 * `test/themes.test.ts` checks that claim by simulating each deficiency and
 * measuring what is left, rather than by asserting the colours were chosen
 * carefully.
 *
 * Anything published elsewhere is one `importTheme` away, which is the other
 * half of the answer and the reason this list does not need to be a hundred.
 */
export const themes: Theme[] = [
  githubDark,
  githubLight,
  nord,
  midnight,
  daylight,
  ember,
  moss,
  paper,
  dusk,
  sea,
  deuteranopiaDark,
  deuteranopiaLight,
  tritanopiaDark,
  tritanopiaLight,
  monochromeDark,
  monochromeLight,
]

/** The six built for colour-vision deficiency, so a picker can group them. */
export const accessibleThemes: Theme[] = [
  deuteranopiaDark,
  deuteranopiaLight,
  tritanopiaDark,
  tritanopiaLight,
  monochromeDark,
  monochromeLight,
]

export function getTheme(name: string): Theme | undefined {
  const normalized = name.toLowerCase()
  return themes.find((theme) => {
    const themeName = theme.name.toLowerCase()
    const themeNameDashed = themeName.replace(/\s+/g, '-')
    return themeName === normalized || themeNameDashed === normalized
  })
}

export * from './daylight'
export * from './deuteranopia-dark'
export * from './deuteranopia-light'
export * from './dusk'
export * from './ember'
export * from './github-dark'
export * from './github-light'
export * from './midnight'
export * from './monochrome-dark'
export * from './monochrome-light'
export * from './moss'
export * from './nord'
export * from './palette'
export * from './paper'
export * from './sea'
export * from './tritanopia-dark'
export * from './tritanopia-light'
