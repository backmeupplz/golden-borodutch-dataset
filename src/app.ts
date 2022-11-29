import 'module-alias/register'
import { readFileSync, writeFileSync } from 'fs'

import * as p from 'prompt'
import { cwd } from 'process'
import { resolve } from 'path'
import parse from 'node-html-parser'

void (async () => {
  console.log('Getting the data...')
  const files = [
    'messages.html',
    'messages2.html',
    'messages3.html',
    'messages4.html',
    'messages5.html',
  ]
  let texts = [] as string[]
  for (const file of files) {
    const root = parse(readFileSync(resolve(cwd(), 'raw', file), 'utf8'), {
      blockTextElements: {
        script: false,
        noscript: false,
        style: false,
        pre: false,
      },
    })
    texts = texts.concat(
      root
        .querySelectorAll('.text')
        .map((node) => node.rawText.trim())
        .filter((v) => !!v)
    )
  }
  const data = texts.map((t) => ({ prompt: '', completion: t }))
  const result = [] as { prompt: string; completion: string }[]
  const start = 19
  for (let i = start; i < data.length; i++) {
    const datum = data[i]
    console.log(`\n${i}. ${datum.completion}`)
    const { prompt } = await p.get({
      properties: {
        prompt: {
          message: 'Prompt for this post',
        },
      },
    })
    if (prompt && typeof prompt === 'string') {
      result.push({ prompt, completion: datum.completion })
      writeFileSync(
        resolve(cwd(), 'data', 'texts.json'),
        JSON.stringify(result, undefined, 2)
      )
    }
  }
  console.log('Done!')
})()
