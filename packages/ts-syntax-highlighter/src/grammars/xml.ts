import type { Grammar } from '../types'

export const xmlGrammar: Grammar = {
  name: 'XML',
  scopeName: 'text.xml',
  keywords: {},
  patterns: [{ include: '#comments' }, { include: '#tags' }, { include: '#cdata' }],
  repository: {
    comments: { patterns: [{ name: 'comment.block.xml', begin: '<!--', end: '-->' }] },
    tags: { patterns: [{ name: 'meta.tag.xml', begin: '</?([a-zA-Z_:][a-zA-Z0-9_:.-]*)', beginCaptures: { '1': { name: 'entity.name.tag.xml' } }, end: '/?>', patterns: [{ name: 'entity.other.attribute-name.xml', match: '[a-zA-Z_:][a-zA-Z0-9_:.-]*(?==)' }, { include: '#strings' }] }] },
    strings: { patterns: [{ name: 'string.quoted.double.xml', begin: '"', end: '"' }, { name: 'string.quoted.single.xml', begin: "'", end: "'" }] },
    cdata: { patterns: [{ name: 'string.unquoted.cdata.xml', begin: '<!\\[CDATA\\[', end: '\\]\\]>' }] },
  },
}
