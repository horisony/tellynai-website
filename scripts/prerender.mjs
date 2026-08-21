import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { SEO_LANGUAGES, SEO_PAGES, SITE_ORIGIN, seoForRoute, seoPath } from '../src/seo.js'
import { seoLandingContent } from '../src/seo-content.js'

const root = new URL('../', import.meta.url)
const distDir = new URL('../dist/', import.meta.url)
const serverEntry = new URL('../dist-ssr/entry-server.js', import.meta.url)
const template = await readFile(new URL('index.html', distDir), 'utf8')
const { render } = await import(pathToFileURL(serverEntry.pathname).href)

const escapeAttribute = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
const jsonLd = (value) => JSON.stringify(value).replaceAll('<', '\\u003c')

function alternateLinks(page) {
  const links = SEO_LANGUAGES.map((language) =>
    `<link rel="alternate" hreflang="${language === 'zh' ? 'zh-Hans' : language}" href="${SITE_ORIGIN}${seoPath(language, page)}" />`,
  )
  links.push(`<link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/" />`)
  return links.join('\n    ')
}

function structuredData(seo) {
  const organizationId = `${SITE_ORIGIN}/#organization`
  const productNames = {
    tellwin: 'TellWin',
    qixiao: seo.language === 'zh' ? '启晓（Qixiao）' : 'Qixiao',
  }
  const graph = [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: 'TellWin AI',
      alternateName: ['图灵驭界', '图灵驭界 AI', 'Tellyn AI'],
      url: SITE_ORIGIN,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/assets/tuling-logo.png`,
      },
      description: '图灵驭界 is the Chinese company brand of TellWin AI, providing enterprise sales conversation intelligence, AI workflow diagnosis, training and FDE co-delivery for high-value, long-cycle sales teams.',
      email: 'baolyang@tellynai.com',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'baolyang@tellynai.com',
        availableLanguage: ['Chinese', 'English', 'Arabic'],
      },
      address: { '@type': 'PostalAddress', addressLocality: 'Shanghai', addressCountry: 'CN' },
      knowsAbout: [
        'Enterprise sales conversation intelligence',
        'AI sales call analysis',
        'Customer intelligence',
        'Enterprise AI implementation',
        'Forward Deployed Engineering',
        'Enterprise AI public relations intelligence',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      name: 'TellWin AI',
      url: SITE_ORIGIN,
      publisher: { '@id': organizationId },
      inLanguage: ['zh-CN', 'en', 'ar'],
    },
    {
      '@type': 'WebPage',
      '@id': `${seo.canonical}#webpage`,
      url: seo.canonical,
      name: seo.localizedTitle,
      description: seo.localizedDescription,
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
      about: { '@id': organizationId },
      inLanguage: seo.language === 'zh' ? 'zh-CN' : seo.language,
    },
  ]
  if (productNames[seo.key]) {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${seo.canonical}#software`,
      name: productNames[seo.key],
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: seo.localizedDescription,
      url: seo.canonical,
      provider: { '@id': organizationId },
      brand: { '@id': organizationId },
    })
  } else if (['fde', 'training', 'salesIntelligence', 'salesCallAnalysis', 'automotive', 'realEstate'].includes(seo.key)) {
    graph.push({
      '@type': 'Service',
      name: seo.localizedTitle.split('｜')[0].split('|')[0].trim(),
      description: seo.localizedDescription,
      url: seo.canonical,
      provider: { '@id': organizationId },
      areaServed: seo.key === 'realEstate' ? ['AE'] : ['CN', 'AE'],
    })
  }
  const landingCopy = seoLandingContent[seo.key]?.[seo.language]
  if (landingCopy) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${seo.canonical}#faq`,
      mainEntity: landingCopy.faqs.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    })
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${seo.canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'TellWin AI', item: `${SITE_ORIGIN}/${seo.language}/` },
        { '@type': 'ListItem', position: 2, name: seo.localizedTitle, item: seo.canonical },
      ],
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

function buildHtml(seo, appHtml, { canonicalOverride = '' } = {}) {
  const canonical = canonicalOverride || seo.canonical
  const languageTag = seo.language === 'zh' ? 'zh-CN' : seo.language
  const direction = seo.language === 'ar' ? 'rtl' : 'ltr'
  const head = `
    <meta name="description" content="${escapeAttribute(seo.localizedDescription)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
    ${alternateLinks(seo)}
    <meta property="og:title" content="${escapeAttribute(seo.localizedTitle)}" />
    <meta property="og:description" content="${escapeAttribute(seo.localizedDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="TellWin AI" />
    <meta property="og:locale" content="${seo.language === 'zh' ? 'zh_CN' : seo.language === 'ar' ? 'ar_AE' : 'en_US'}" />
    <meta property="og:image" content="${SITE_ORIGIN}/og.png" />
    <meta property="og:image:width" content="1731" />
    <meta property="og:image:height" content="909" />
    <meta property="og:image:alt" content="TellWin AI — Enterprise Sales Intelligence" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${SITE_ORIGIN}/og.png" />
    <script type="application/ld+json">${jsonLd(structuredData({ ...seo, canonical }))}</script>`

  return template
    .replace(/<html[^>]*>/, `<html lang="${languageTag}" dir="${direction}">`)
    .replace(/<meta name="description"[^>]*>\s*/g, '')
    .replace(/<meta property="og:[^>]*>\s*/g, '')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${seo.localizedTitle}</title>`)
    .replace('</head>', `${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace(/\n[ \t]+\n/g, '\n\n')
}

for (const language of SEO_LANGUAGES) {
  for (const page of SEO_PAGES) {
    const seo = seoForRoute(language, page.key)
    const html = buildHtml(seo, render(seo.pathname, language))
    const output = join(distDir.pathname, seo.pathname, 'index.html')
    await mkdir(dirname(output), { recursive: true })
    await writeFile(output, html)
  }
}

const rootSeo = seoForRoute('zh', 'home')
await writeFile(new URL('index.html', distDir), buildHtml(rootSeo, render('/', 'zh'), { canonicalOverride: rootSeo.canonical }))

const sitemapUrls = SEO_PAGES.flatMap((page) => SEO_LANGUAGES.map((language) => {
  const loc = `${SITE_ORIGIN}${seoPath(language, page)}`
  const alternates = SEO_LANGUAGES.map((alternate) =>
    `    <xhtml:link rel="alternate" hreflang="${alternate === 'zh' ? 'zh-Hans' : alternate}" href="${SITE_ORIGIN}${seoPath(alternate, page)}" />`,
  ).join('\n')
  return `  <url>\n    <loc>${loc}</loc>\n${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/" />\n  </url>`
})).join('\n')

await writeFile(new URL('sitemap.xml', distDir), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapUrls}\n</urlset>\n`)
await writeFile(new URL('robots.txt', distDir), `# ChatGPT search crawler. This is independent from GPTBot model-training controls.\nUser-agent: OAI-SearchBot\nAllow: /\nDisallow: /api/\nDisallow: /customer/\n\nUser-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /customer/\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`)
await rm(new URL('../dist-ssr/', root), { recursive: true, force: true })

console.log(`Prerendered ${SEO_LANGUAGES.length * SEO_PAGES.length} localized SEO pages.`)
