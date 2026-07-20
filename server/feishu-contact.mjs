import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const baseToken = process.env.FEISHU_BASE_TOKEN ?? 'ObunbGFxfaWafvsjmkucXC3Qn0c'
const tableId = process.env.FEISHU_TABLE_ID ?? 'tblI514L9EPXNGCl'
const fields = ['怎么称呼你？', '公司 / 行业', '微信 / 手机号', '你想通过 AI 解决什么问题？']

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

export function feishuContactPlugin() {
  return {
    name: 'feishu-contact-form',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (request, response, next) => {
        if (request.method !== 'POST') return next()

        try {
          const form = await readBody(request)
          const values = [form.name, form.company, form.contact, form.need].map((value) => String(value ?? '').trim())

          if (!values[0] || !values[2]) {
            return send(response, 400, { message: '请填写称呼和联系方式。' })
          }

          await execFileAsync('lark-cli', [
            'base', '+record-batch-create', '--as', 'user', '--base-token', baseToken,
            '--table-id', tableId,
            '--json', JSON.stringify({ fields, rows: [values] }),
          ], { timeout: 20_000, maxBuffer: 1_024 * 1_024 })

          return send(response, 201, { ok: true })
        } catch (error) {
          console.error('Feishu Base submission failed:', error)
          return send(response, 502, { message: '暂时无法提交到飞书，请稍后重试。' })
        }
      })
    },
  }
}
