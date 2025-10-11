/* eslint-disable no-console */

interface ProfileEntry {
  name: string
  duration: number
  memory?: number
  timestamp: number
}

export class Profiler {
  private entries: ProfileEntry[] = []
  private timers: Map<string, number> = new Map()
  private enabled: boolean

  constructor(enabled = false) {
    this.enabled = enabled
  }

  start(name: string): void {
    if (!this.enabled)
      return
    this.timers.set(name, performance.now())
  }

  end(name: string): void {
    if (!this.enabled)
      return

    const startTime = this.timers.get(name)
    if (!startTime)
      return

    const duration = performance.now() - startTime
    this.timers.delete(name)

    this.entries.push({
      name,
      duration,
      timestamp: Date.now(),
    })
  }

  async measure<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
    this.start(name)
    try {
      const result = await fn()
      this.end(name)
      return result
    }
    catch (error) {
      this.end(name)
      throw error
    }
  }

  getEntries(): ProfileEntry[] {
    return [...this.entries]
  }

  getStats() {
    const grouped = new Map<string, number[]>()

    for (const entry of this.entries) {
      const durations = grouped.get(entry.name) || []
      durations.push(entry.duration)
      grouped.set(entry.name, durations)
    }

    const stats: Record<string, {
      count: number
      total: number
      avg: number
      min: number
      max: number
    }> = {}

    for (const [name, durations] of grouped) {
      const total = durations.reduce((sum, d) => sum + d, 0)
      stats[name] = {
        count: durations.length,
        total,
        avg: total / durations.length,
        min: Math.min(...durations),
        max: Math.max(...durations),
      }
    }

    return stats
  }

  clear(): void {
    this.entries = []
    this.timers.clear()
  }

  enable(): void {
    this.enabled = true
  }

  disable(): void {
    this.enabled = false
  }

  report(): void {
    const stats = this.getStats()

    console.log('\n=== Performance Report ===\n')

    for (const [name, data] of Object.entries(stats)) {
      console.log(`${name}:`)
      console.log(`  Count: ${data.count}`)
      console.log(`  Total: ${data.total.toFixed(2)}ms`)
      console.log(`  Avg:   ${data.avg.toFixed(2)}ms`)
      console.log(`  Min:   ${data.min.toFixed(2)}ms`)
      console.log(`  Max:   ${data.max.toFixed(2)}ms`)
      console.log()
    }
  }
}

// Global profiler instance
export const profiler = new Profiler(false)
