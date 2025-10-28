import type { Grammar } from '../types'

export const dockerfileGrammar: Grammar = {
  name: 'Dockerfile',
  scopeName: 'source.dockerfile',
  keywords: {
    FROM: 'keyword.control.dockerfile',
    RUN: 'keyword.control.dockerfile',
    CMD: 'keyword.control.dockerfile',
    LABEL: 'keyword.control.dockerfile',
    EXPOSE: 'keyword.control.dockerfile',
    ENV: 'keyword.control.dockerfile',
    ADD: 'keyword.control.dockerfile',
    COPY: 'keyword.control.dockerfile',
    ENTRYPOINT: 'keyword.control.dockerfile',
    VOLUME: 'keyword.control.dockerfile',
    USER: 'keyword.control.dockerfile',
    WORKDIR: 'keyword.control.dockerfile',
    ARG: 'keyword.control.dockerfile',
    ONBUILD: 'keyword.control.dockerfile',
    STOPSIGNAL: 'keyword.control.dockerfile',
    HEALTHCHECK: 'keyword.control.dockerfile',
    SHELL: 'keyword.control.dockerfile',
    MAINTAINER: 'keyword.control.dockerfile',
    AS: 'keyword.other.dockerfile',
  },
  patterns: [
    { include: '#comments' },
    { include: '#instructions' },
    { include: '#strings' },
    { include: '#variables' },
  ],
  repository: {
    comments: {
      patterns: [
        {
          name: 'comment.line.number-sign.dockerfile',
          match: '#.*$',
        },
      ],
    },
    instructions: {
      patterns: [
        {
          name: 'keyword.control.dockerfile',
          match: '^\\s*(FROM|RUN|CMD|LABEL|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL|MAINTAINER)\\b',
        },
        {
          name: 'keyword.other.dockerfile',
          match: '\\b(AS)\\b',
        },
      ],
    },
    strings: {
      patterns: [
        {
          name: 'string.quoted.double.dockerfile',
          begin: '"',
          end: '"',
          patterns: [
            {
              name: 'constant.character.escape.dockerfile',
              match: '\\\\.',
            },
          ],
        },
        {
          name: 'string.quoted.single.dockerfile',
          begin: '\'',
          end: '\'',
          patterns: [
            {
              name: 'constant.character.escape.dockerfile',
              match: '\\\\.',
            },
          ],
        },
      ],
    },
    variables: {
      patterns: [
        {
          name: 'variable.other.dockerfile',
          match: '\\$\\{?[a-zA-Z_][a-zA-Z0-9_]*\\}?',
        },
      ],
    },
  },
}
