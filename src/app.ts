import 'module-alias/register'

import * as p from 'prompt'
import { cwd } from 'process'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const OpenAI = require('openai-api')
import parse from 'node-html-parser'

const openai = new OpenAI(process.env.OPENAI_KEY || '')

void (async () => {
  console.log('Getting the data...')
  const data = JSON.parse(
    readFileSync(resolve(cwd(), 'data', 'pre-texts.json'), 'utf-8')
  )
  const result = [] as { prompt: string; completion: string }[]
  const start = 0
  for (let i = start; i < data.length; i++) {
    const datum = data[i]
    // console.log(`\n${i}. ${datum.completion}`)
    // const gptResponse = await openai.complete({
    //   engine: 'text-davinci-003',
    //   prompt: `${datum.completion.substring(0, 3000)}\nTL;DR in Russian: `,
    //   n: 1,
    //   stream: false,
    //   temperature: 0.6,
    //   max_tokens: 100,
    // })
    // const completion = gptResponse.data.choices[0].text.trim()
    // console.log(`${i}. ${completion}`)
    result.push({
      prompt: `Borodutch opinion #${i}:\n`,
      completion: datum.completion,
    })
  }
  writeFileSync(
    resolve(cwd(), 'data', 'texts.json'),
    JSON.stringify(result, undefined, 2)
  )
  console.log('Done!')
})()
