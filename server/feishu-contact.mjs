import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { existsSync } from 'node:fs'

const execFileAsync = promisify(execFile)

const baseToken = process.env.FEISHU_BASE_TOKEN ?? 'ObunbGFxfaWafvsjmkucXC3Qn0c'
const tableId = process.env.FEISHU_TABLE_ID ?? 'tblI514L9EPXNGCl'
const fields = ['怎么称呼你？', '公司 / 行业', '微信 / 手机号', '你想通过 AI 解决什么问题？']

// Resolve the lark-cli binary to an absolute path so the contact endpoint works
// no matter what PATH the server process was started with. Override with
// LARK_CLI_PATH when deploying to a host where it lives elsewhere.
function resolveLarkCli() {
  const candidates = [
    process.env.LARK_CLI_PATH,
    '/Users/baoling/.workbuddy/binaries/node/versions/22.22.2/bin/lark-cli',
    '/opt/homebrew/bin/lark-cli',
    '/usr/local/bin/lark-cli',
  ].filter(Boolean)
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  return 'lark-cli'
}
const larkCli = resolveLarkCli()

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => { body += chunk })
    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        reject(new Error('提交内容格式不正确'))
      }
    })
    request.on('error', reject)
  })
}

function send(response, status, payload) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

// Shared request handler — used by the Vite dev server, the Vite preview server,
// and the standalone production server (server/index.mjs). If lark-cli is missing
// on the host, we surface a clear, actionable message instead of a silent failure.
export async function handleContact(request, response) {
  if (request.method !== 'POST') {
    send(response, 405, { message: '仅支持 POST 请求。' })
    return
  }
  try {
    const form = await readBody(request)
    const attribution = form.attribution && typeof form.attribution === 'object' ? form.attribution : {}
    const short = (value) => String(value ?? '').trim().slice(0, 160)
    const sourceDetails = [
      form.source && `页面：${short(form.source)}`,
      attribution.currentPage && `提交路径：${short(attribution.currentPage)}`,
      attribution.landingPage && `首次落地：${short(attribution.landingPage)}`,
      attribution.referrer && `外部来源：${short(attribution.referrer)}`,
      attribution.language && `语言：${short(attribution.language)}`,
      ...['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
        .filter((key) => attribution[key])
        .map((key) => `${key}：${short(attribution[key])}`),
    ].filter(Boolean).join('\n')
    const details = [
      `感兴趣的服务：${form.service || '未选择'}`,
      `企业规模：${form.companySize || '未选择'}`,
      `期望启动时间：${form.startTime || '未选择'}`,
      `来源页面：${sourceDetails || form.source || '未知'}`,
      '',
      String(form.need ?? '').trim(),
    ].join('\n').trim()
    const values = [form.name, form.company, form.contact, details].map((value) => String(value ?? '').trim())

    if (!values[0] || !values[2]) {
      send(response, 400, { message: '请填写称呼和联系方式。' })
      return
    }

    await execFileAsync(
      larkCli,
      [
        'base', '+record-batch-create', '--as', 'user', '--base-token', baseToken,
        '--table-id', tableId,
        '--json', JSON.stringify({ fields, rows: [values] }),
      ],
      { timeout: 20_000, maxBuffer: 1_024 * 1_024 },
    )

    send(response, 201, { ok: true })
  } catch (error) {
    console.error('[contact] Feishu submission failed:', error)
    const missingCli = error.code === 'ENOENT' || /spawn.*ENOENT|lark-cli/.test(error.message || '')
    if (missingCli) {
      send(response, 502, { message: '提交服务未就绪：服务器上未找到 lark-cli，请安装并登录后重试。' })
    } else {
      send(response, 502, { message: '暂时无法提交到飞书，请稍后重试。' })
    }
  }
}

function mountContactMiddleware(server) {
  server.middlewares.use('/api/contact', (request, response, next) => {
    if (request.method !== 'POST') return next()
    handleContact(request, response)
  })
}

export function feishuContactPlugin() {
  return {
    name: 'feishu-contact-form',
    // Dev server (npm run dev)
    configureServer(server) {
      mountContactMiddleware(server)
    },
    // Preview server (npm run preview) — serves the built dist/ and previously
    // had NO /api/contact backend, which is what broke the deployed site.
    configurePreviewServer(server) {
      mountContactMiddleware(server)
    },
  }
}
