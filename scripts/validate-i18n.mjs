import { readFile } from 'node:fs/promises'
import { copyConfig } from '../src/i18n.js'
import { brandProfile } from '../src/content.js'
import { seoLandingContent, seoLandingUi } from '../src/seo-content.js'

const files = ['src/App.jsx', 'src/content.js']
const cjk = /[\u3400-\u9fff]/
const configured = new Set(Object.keys(copyConfig))
const structuredValues = new Set(Object.values(brandProfile).flatMap((entry) => Object.values(entry)))
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
  if (structuredValues.has(source)) return false
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

const requiredLanguages = ['zh', 'en', 'ar']
const landingErrors = []
for (const language of requiredLanguages) {
  const value = brandProfile[language]
  if (!value?.heading || !value?.body || !value?.detail) landingErrors.push(`brandProfile.${language}`)
}
for (const language of requiredLanguages) {
  const ui = seoLandingUi[language]
  if (!ui || Object.values(ui).some((value) => !value)) landingErrors.push(`seoLandingUi.${language}`)
}
for (const [pageKey, localized] of Object.entries(seoLandingContent)) {
  for (const language of requiredLanguages) {
    const value = localized[language]
    if (!value) landingErrors.push(`${pageKey}.${language}`)
    else if (!value.title || !value.intro || !value.problems?.length || !value.process?.length || !value.value?.length || !value.fit?.length || !value.faqs?.length) landingErrors.push(`${pageKey}.${language} 内容不完整`)
  }
}
if (landingErrors.length) {
  console.error('SEO 落地页三语配置不完整：')
  for (const error of landingErrors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`三语配置检查通过：${discovered.size} 条在用内容，${configured.size} 条完整翻译，${Object.keys(seoLandingContent).length} 个 SEO 落地页。`)
