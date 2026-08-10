import { readFile } from 'node:fs/promises'
import { copyConfig } from '../src/i18n.js'

const files = ['src/App.jsx', 'src/content.js']
const cjk = /[\u3400-\u9fff]/
const configured = new Set(Object.keys(copyConfig))
const discovered = new Set()

for (const file of files) {
  const source = await readFile(new URL(`../${file}`, import.meta.url), 'utf8')

  // JavaScript string literals used for props, data and rendered copy.
  for (const match of source.matchAll(/(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g)) {
    const value = match[2].replace(/\\(["'`])/g, '$1').trim()
    if (cjk.test(value)) discovered.add(value)
  }

  // Plain JSX text nodes. Whitespace introduced by formatting is normalized.
  for (const match of source.matchAll(/>([^<>{}]+)</g)) {
    const value = match[1].replace(/\s+/g, ' ').trim()
    if (cjk.test(value)) discovered.add(value)
  }
}

const missing = [...discovered].filter((source) => {
  const entry = copyConfig[source]
  return !configured.has(source) || !entry?.zh || !entry?.en || !entry?.ar
})

if (missing.length) {
  console.error('三语配置不完整。请在翻译配置中补齐以下内容：')
  for (const source of missing) console.error(`- ${source}`)
  process.exit(1)
}

const incomplete = Object.entries(copyConfig).filter(([, entry]) => !entry.zh || !entry.en || !entry.ar)
if (incomplete.length) {
  console.error('翻译配置中存在空值：')
  for (const [source] of incomplete) console.error(`- ${source}`)
  process.exit(1)
}

console.log(`三语配置检查通过：${discovered.size} 条在用内容，${configured.size} 条完整翻译。`)
