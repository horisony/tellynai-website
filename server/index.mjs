// Standalone production server for the 官网.
// Serves the built site from dist/ AND handles POST /api/contact, writing
// submissions to the Feishu 多维表格. Run with: `npm run start` (or `node server/index.mjs`).
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleContact } from './feishu-contact.mjs'

const port = Number(process.env.PORT) || 3000
const distDir = fileURLToPath(new URL('../dist/', import.meta.url)).replace(/\/+$/, '')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.json': 'application/json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])

  // Contact API (no static file needed)
  if (urlPath === '/api/contact') {
    return handleContact(req, res)
  }

  // Static file serving from dist/ with SPA fallback to index.html
  let relative = urlPath === '/' ? '/index.html' : urlPath
  if (relative.endsWith('/')) relative += 'index.html'
  const filePath = normalize(join(distDir, relative))
  if (!filePath.startsWith(distDir + sep) && filePath !== distDir) {
    res.statusCode = 403
    res.end('Forbidden')
    return
  }

  if (existsSync(filePath)) {
    try {
      const data = await readFile(filePath)
      res.setHeader('Content-Type', MIME[extname(filePath)] || 'application/octet-stream')
      res.end(data)
      return
    } catch (err) {
      res.statusCode = 500
      res.end('Internal error')
      return
    }
  }

  // SPA fallback
  const fallback = join(distDir, 'index.html')
  if (existsSync(fallback)) {
    res.setHeader('Content-Type', MIME['.html'])
    res.end(await readFile(fallback))
    return
  }

  res.statusCode = 404
  res.end('Not found')
})

server.listen(port, () => {
  console.log(`[官网] serving dist/ + /api/contact on http://localhost:${port}`)
})
