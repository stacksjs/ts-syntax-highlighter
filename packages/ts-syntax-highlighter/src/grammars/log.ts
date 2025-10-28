import type { Grammar } from '../types'

export const logGrammar: Grammar = {
  name: 'Log',
  scopeName: 'text.log',
  keywords: {},
  patterns: [{ include: '#log-levels' }, { include: '#timestamps' }, { include: '#ip-addresses' }],
  repository: {
    'log-levels': { patterns: [{ name: 'markup.error.log', match: '\\b(ERROR|FATAL|CRITICAL)\\b' }, { name: 'markup.warning.log', match: '\\b(WARN|WARNING)\\b' }, { name: 'markup.info.log', match: '\\b(INFO|NOTICE)\\b' }, { name: 'markup.debug.log', match: '\\b(DEBUG|TRACE)\\b' }] },
    'timestamps': { patterns: [{ name: 'constant.numeric.timestamp.log', match: '\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?' }] },
    'ip-addresses': { patterns: [{ name: 'constant.numeric.ip.log', match: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' }] },
  },
}
