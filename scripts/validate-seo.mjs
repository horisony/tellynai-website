import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SEO_LANGUAGES, SEO_PAGES, SITE_ORIGIN, seoForRoute, seoPath } from '../src/seo.js'

const distDir = new URL('../dist/', import.meta.url)
const failures = []
const seenTitles = new Map()
const seenDescriptions = new Map()
const expect = (condition, message) => {
  if (!condition) failures.push(message)
}

for (const page of SEO_PAGES) {
  for (const language of SEO_LANGUAGES) {
    const seo = seoForRoute(language, page.key)
    const html = await readFile(join(distDir.pathname, seo.pathname, 'index.html'), 'utf8')
    const label = seo.pathname
    const expectedDefault = page.key === 'home' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${seoPath('zh', page)}`
    const htmlLanguage = language === 'zh' ? 'zh-CN' : language
    const direction = language === 'ar' ? 'rtl' : 'ltr'

    expect(html.includes(`<html lang="${htmlLanguage}" dir="${direction}">`), `${label}: incorrect html language or direction`)
    expect(html.includes(`<title>${seo.localizedTitle}</title>`), `${label}: missing localized title`)
    expect(html.includes(`<meta name="description" content="${seo.localizedDescription}" />`), `${label}: missing localized description`)
    expect(html.includes(`<link rel="canonical" href="${seo.canonical}" />`), `${label}: incorrect canonical`)
    expect(html.includes(`<link rel="alternate" hreflang="x-default" href="${expectedDefault}" />`), `${label}: incorrect x-default URL`)
    expect(html.includes('<script type="application/ld+json">'), `${label}: missing JSON-LD`)

    for (const alternate of SEO_LANGUAGES) {
      const hreflang = alternate === 'zh' ? 'zh-Hans' : alternate
      const href = `${SITE_ORIGIN}${seoPath(alternate, page)}`
      expect(html.includes(`<link rel="alternate" hreflang="${hreflang}" href="${href}" />`), `${label}: missing ${hreflang} alternate`)
    }

    const previousTitle = seenTitles.get(seo.localizedTitle)
    expect(!previousTitle, `${label}: title duplicates ${previousTitle}`)
    seenTitles.set(seo.localizedTitle, label)

    const previousDescription = seenDescriptions.get(seo.localizedDescription)
    expect(!previousDescription, `${label}: description duplicates ${previousDescription}`)
    seenDescriptions.set(seo.localizedDescription, label)
  }
}

const sitemap = await readFile(new URL('sitemap.xml', distDir), 'utf8')
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
const expectedLocations = SEO_PAGES.flatMap((page) => SEO_LANGUAGES.map((language) => `${SITE_ORIGIN}${seoPath(language, page)}`))
expect(sitemapLocations.length === expectedLocations.length, `sitemap: expected ${expectedLocations.length} URLs, found ${sitemapLocations.length}`)
for (const url of expectedLocations) expect(sitemap.includes(`<loc>${url}</loc>`), `sitemap: missing ${url}`)

const robots = await readFile(new URL('robots.txt', distDir), 'utf8')
expect(robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`), 'robots.txt: missing sitemap URL')
expect(robots.includes('Disallow: /api/'), 'robots.txt: API routes must stay excluded')

const vercelConfig = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
for (const page of SEO_PAGES.filter((item) => item.path)) {
  const expectedDestination = seoPath('zh', page)
  for (const source of [`/${page.path}`, `/${page.path}/`]) {
    const redirect = vercelConfig.redirects?.find((item) => item.source === source)
    expect(redirect?.destination === expectedDestination && redirect?.permanent === true, `${source}: missing permanent redirect to ${expectedDestination}`)
  }
}

if (failures.length) {
  console.error(`SEO validation failed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}

console.log(`SEO validation passed: ${expectedLocations.length} localized URLs with unique metadata and complete language alternates.`)
