/**
 * Whether a theme can actually be read, measured rather than asserted.
 *
 * A syntax theme is sixteen colours on a background and every one of them is a
 * chance to be pretty and unreadable. Two things go wrong, and only one of them
 * is visible to the person choosing the colours:
 *
 * **Contrast.** A colour too close to the background disappears, and the way it
 * happens is a comment colour picked to be quiet and taken one step too far.
 * WCAG's 4.5:1 for body text is the bar, because code is set small and read for
 * hours.
 *
 * **Separation.** Two roles the same colour is a theme where a string and a
 * number look identical - a bug the author cannot see, because the author can
 * tell them apart. It is also the bug most themes have for one reader in
 * twelve: red against green is the pair syntax themes spend their two most
 * important colours on, and red-green deficiency is what removes it.
 *
 * So the six accessible themes are held to the second property *under
 * simulation*: the palette goes through the Viénot-Brettel-Mollon transform for
 * the deficiency each is named for, and is measured after. That is the only way
 * to check a claim about what somebody else sees, and it is the difference
 * between a theme built for a deficiency and a theme described as built for one.
 *
 * Distances are ΔE in CIELAB rather than anything in RGB. An earlier version of
 * this file measured Euclidean distance in linear RGB and reported every light
 * theme as broken: dark text on a white page occupies a tiny corner of linear
 * RGB, so the metric said colours a reader separates instantly were three units
 * apart. The failures worth catching are two roles that are the same colour,
 * and a perceptual space is what makes that the same number in both directions.
 */

import type { Theme } from '../src/types'
import { describe, expect, it } from 'bun:test'
import { accessibleThemes, themes } from '../src/themes'

type Deficiency = 'protanopia' | 'deuteranopia' | 'tritanopia'

/**
 * The dichromat projections, in linear RGB.
 *
 * A dichromat is missing one cone type, so three-dimensional colour space
 * collapses onto a plane and two colours differing only along the missing axis
 * land on the same point. These matrices are that projection.
 */
const DEFICIENCIES: Record<Deficiency, number[]> = {
  protanopia: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  deuteranopia: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.011820, 0.042940, 0.968881],
  tritanopia: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.303900],
}

/** Two roles are told apart at this ΔE, or by their font style. */
const SEPARATION = 10

/** The same, once a deficiency has taken part of the palette away. */
const SEPARATION_SIMULATED = 10

/** WCAG AA for body text, which is what code is. */
const CONTRAST = 4.5

/** The same, under simulation, where a projection costs a little of everything. */
const CONTRAST_SIMULATED = 4

/**
 * Nord's comment colour, as published, does not reach 4.5:1.
 *
 * `#616e88` on `#2e3440` is 2.43:1, and `#b48ead` - its numbers, its language
 * constants and its colour literals - misses by a hair at 4.41:1. Both are what
 * Nord is: a reader choosing
 * Nord is choosing the colours Nord published, so this file records the number
 * rather than repainting somebody else's theme and keeping the name. Pinned to
 * the measured value, so the exception covers exactly this and stops covering
 * it the moment either colour moves.
 */
const PUBLISHED_EXCEPTIONS: Array<{ theme: string, color: string, ratio: number }> = [
  { theme: 'Nord', color: '#616e88', ratio: 2.43 },
  { theme: 'Nord', color: '#b48ead', ratio: 4.41 },
]

interface Rgb { r: number, g: number, b: number }

function parse(hex: string): Rgb {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? [...value].map(character => character + character).join('') : value

  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  }
}

/** sRGB to linear, the transfer function every colour formula here starts with. */
function linear(channel: number): number {
  const value = channel / 255

  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function encode(value: number): string {
  const clamped = Math.max(0, Math.min(1, value))
  const srgb = clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * clamped ** (1 / 2.4) - 0.055

  return Math.round(srgb * 255).toString(16).padStart(2, '0')
}

function luminance(hex: string): number {
  const { r, g, b } = parse(hex)

  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

function contrast(a: string, b: string): number {
  const first = luminance(a)
  const second = luminance(b)

  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}

function lab(hex: string): [number, number, number] {
  const { r, g, b } = parse(hex)
  const [lr, lg, lb] = [linear(r), linear(g), linear(b)]
  const x = (0.4124 * lr + 0.3576 * lg + 0.1805 * lb) / 0.95047
  const y = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
  const z = (0.0193 * lr + 0.1192 * lg + 0.9505 * lb) / 1.08883
  const f = (value: number): number => value > 0.008856 ? Math.cbrt(value) : 7.787 * value + 16 / 116
  const [fx, fy, fz] = [f(x), f(y), f(z)]

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

function deltaE(a: string, b: string): number {
  const first = lab(a)
  const second = lab(b)

  return Math.sqrt(first.reduce((total, value, index) => total + (value - second[index]!) ** 2, 0))
}

function simulate(hex: string, deficiency: Deficiency): string {
  const { r, g, b } = parse(hex)
  const [lr, lg, lb] = [linear(r), linear(g), linear(b)]
  const m = DEFICIENCIES[deficiency]

  return `#${[
    m[0]! * lr + m[1]! * lg + m[2]! * lb,
    m[3]! * lr + m[4]! * lg + m[5]! * lb,
    m[6]! * lr + m[7]! * lg + m[8]! * lb,
  ].map(encode).join('')}`
}

/**
 * The pairs that matter, which is not every pair.
 *
 * `keyword` and `tag` sharing a colour is a choice several themes here make on
 * purpose, and holding every theme to sixteen distinct hues would be inventing
 * a rule to satisfy a test. These are the ones that sit next to each other on a
 * line of real code, where telling them apart is the whole job.
 */
const PAIRS: Array<[string, string]> = [
  ['String', 'Number'],
  ['String', 'Keyword'],
  ['String', 'Comment'],
  ['Keyword', 'Function'],
  ['Keyword', 'Class'],
  ['Function', 'Variable'],
  ['Comment', 'Variable'],
  ['Number', 'Variable'],
]

function roleOf(theme: Theme, name: string): { color: string, style: string | undefined } {
  const entry = theme.tokenColors.find(color => color.name === name)

  if (!entry?.settings.foreground)
    throw new Error(`${theme.name} has no ${name} colour`)

  return { color: entry.settings.foreground, style: entry.settings.fontStyle }
}

/** Every token colour a theme sets, with the first scope it was set for. */
function tokenColors(theme: Theme): Array<[string, string]> {
  return theme.tokenColors
    .filter(entry => entry.settings.foreground)
    .map(entry => [
      Array.isArray(entry.scope) ? entry.scope[0]! : entry.scope,
      entry.settings.foreground!,
    ] as [string, string])
}

/**
 * Keyed by colour rather than by scope, because that is what the exception is:
 * one hex value the theme's author chose, reaching the page through however
 * many scopes point at it.
 */
function exceptionFor(theme: Theme, color: string): { ratio: number } | undefined {
  return PUBLISHED_EXCEPTIONS.find(entry => entry.theme === theme.name && entry.color === color.toLowerCase())
}

/** An assertion that reports the number it measured, because "a colour failed" is unactionable. */
function atLeast(label: string, measured: number, floor: number): void {
  expect(`${label} ${measured.toFixed(2)}`).toBe(measured >= floor ? `${label} ${measured.toFixed(2)}` : `${label} at least ${floor.toFixed(2)}`)
}

const cases = themes.map(theme => [theme.name, theme] as [string, Theme])

describe('every shipped theme is legible against its own background', () => {
  it.each(cases)('%s', (_name, theme) => {
    const background = theme.colors['editor.background']

    for (const [scope, color] of tokenColors(theme)) {
      const ratio = contrast(color, background)
      const exception = exceptionFor(theme, color)

      if (exception) {
        // Pinned, so the exception covers this colour and no other, and stops
        // applying the moment somebody changes it.
        expect(`${scope} ${ratio.toFixed(2)}`).toBe(`${scope} ${exception.ratio.toFixed(2)}`)
        continue
      }

      atLeast(`${scope}`, ratio, CONTRAST)
    }
  })
})

describe('every shipped theme separates the roles a reader compares', () => {
  it.each(cases)('%s', (_name, theme) => {
    for (const [first, second] of PAIRS) {
      const a = roleOf(theme, first)
      const b = roleOf(theme, second)

      // A different weight or slope separates two roles as surely as a
      // different hue, which is the whole strategy of the monochrome pair.
      if (a.style !== b.style)
        continue

      atLeast(`${first}/${second}`, deltaE(a.color, b.color), SEPARATION)
    }
  })
})

describe('the accessible six survive the deficiency they are named for', () => {
  const named: Array<[string, Theme, Deficiency[]]> = accessibleThemes.map((theme) => {
    const name = theme.name.toLowerCase()

    if (name.startsWith('deuteranopia'))
      return [theme.name, theme, ['protanopia', 'deuteranopia']]

    if (name.startsWith('tritanopia'))
      return [theme.name, theme, ['tritanopia']]

    // The monochrome pair claims all three, which is what having no hue to lose
    // amounts to.
    return [theme.name, theme, ['protanopia', 'deuteranopia', 'tritanopia']]
  })

  it.each(named)('%s keeps its roles apart', (_name, theme, deficiencies) => {
    for (const deficiency of deficiencies) {
      for (const [first, second] of PAIRS) {
        const a = roleOf(theme, first)
        const b = roleOf(theme, second)

        if (a.style !== b.style)
          continue

        atLeast(
          `${deficiency} ${first}/${second}`,
          deltaE(simulate(a.color, deficiency), simulate(b.color, deficiency)),
          SEPARATION_SIMULATED,
        )
      }
    }
  })

  it.each(named)('%s keeps its contrast', (_name, theme, deficiencies) => {
    const background = theme.colors['editor.background']

    for (const deficiency of deficiencies) {
      for (const [scope, color] of tokenColors(theme)) {
        atLeast(
          `${deficiency} ${scope}`,
          contrast(simulate(color, deficiency), simulate(background, deficiency)),
          CONTRAST_SIMULATED,
        )
      }
    }
  })
})

describe('the six answer a real problem rather than a hypothetical one', () => {
  /**
   * The check that keeps the previous three from being a formality.
   *
   * If every theme already passed under simulation there would be nothing for a
   * colour-vision-deficiency theme to fix, and this file would be measuring the
   * bar rather than the themes. So: at least one ordinary theme has a pair that
   * falls below the bar the six are held to, once a deficiency is applied.
   */
  it('finds ordinary themes whose roles collapse under a deficiency', () => {
    const ordinary = themes.filter(theme => !accessibleThemes.includes(theme))
    const collapsed: string[] = []

    for (const theme of ordinary) {
      for (const deficiency of Object.keys(DEFICIENCIES) as Deficiency[]) {
        for (const [first, second] of PAIRS) {
          const a = roleOf(theme, first)
          const b = roleOf(theme, second)

          if (a.style !== b.style)
            continue

          const before = deltaE(a.color, b.color)
          const after = deltaE(simulate(a.color, deficiency), simulate(b.color, deficiency))

          if (before >= SEPARATION && after < SEPARATION_SIMULATED)
            collapsed.push(`${theme.name}: ${first}/${second} ${before.toFixed(1)} to ${after.toFixed(1)} under ${deficiency}`)
        }
      }
    }

    expect(collapsed.length).toBeGreaterThan(0)
  })
})
