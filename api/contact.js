// Vercel serverless function: POST /api/contact
// Writes the 联系我们 form to the Feishu 多维表格 using the Bitable OpenAPI.
// No lark-cli binary needed — credentials come from environment variables:
//   FEISHU_APP_ID      (default: cli_a9665e3c15389bef)
//   FEISHU_APP_SECRET  (REQUIRED — set in Vercel project env)
//   FEISHU_BASE_TOKEN  (default: ObunbGFxfaWafvsjmkucXC3Qn0c)
//   FEISHU_TABLE_ID    (default: tblI514L9EPXNGCl)
//
// Setup notes:
//   - Enable the "bitable:record:create" scope for the app in Feishu Open Platform.
//   - Add the app (cli_a9665e3c15389bef) as an editor collaborator on the base,
//     otherwise writes fail with a permission error.

const BASE_API = 'https://open.feishu.cn/open-apis'

const FIELDS = ['怎么称呼你？', '公司 / 行业', '微信 / 手机号', '你想通过 AI 解决什么问题？']

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        reject(new Error('提交内容格式不正确'))
      }
    })
    req.on('error', reject)
  })
}

async function parseBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body) } catch { return {} }
    }
    return req.body
  }
  return readJson(req)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ message: '仅支持 POST 请求。' }))
    return
  }

  try {
    const form = await parseBody(req)
    const details = [
      `感兴趣的服务：${form.service || '未选择'}`,
      `企业规模：${form.companySize || '未选择'}`,
      `期望启动时间：${form.startTime || '未选择'}`,
      `来源页面：${form.source || '未知'}`,
      '',
      String(form.need ?? '').trim(),
    ].join('\n').trim()
    const values = [form.name, form.company, form.contact, details].map((v) => String(v ?? '').trim())

    if (!values[0] || !values[2]) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ message: '请填写称呼和联系方式。' }))
      return
    }

    const appId = process.env.FEISHU_APP_ID || 'cli_a9665e3c15389bef'
    const appSecret = process.env.FEISHU_APP_SECRET
    const baseToken = process.env.FEISHU_BASE_TOKEN || 'ObunbGFxfaWafvsjmkucXC3Qn0c'
    const tableId = process.env.FEISHU_TABLE_ID || 'tblI514L9EPXNGCl'

    if (!appSecret) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ message: '服务器未配置 FEISHU_APP_SECRET。' }))
      return
    }

    // 1) tenant access token
    const tokenResp = await fetch(`${BASE_API}/auth/v3/tenant_access_token/internal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    })
    const tokenJson = await tokenResp.json()
    if (tokenJson.code !== 0) {
      console.error('[contact] token failed:', tokenJson)
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ message: '飞书鉴权失败，请检查 FEISHU_APP_ID / FEISHU_APP_SECRET。' }))
      return
    }
    const accessToken = tokenJson.tenant_access_token

    // 2) write record
    const records = [{ fields: Object.fromEntries(FIELDS.map((f, i) => [f, values[i]])) }]
    const createResp = await fetch(
      `${BASE_API}/bitable/v1/apps/${baseToken}/tables/${tableId}/records/batch_create`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ records }),
      },
    )
    const createJson = await createResp.json()
    if (createJson.code !== 0) {
      console.error('[contact] create failed:', createJson)
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ message: '写入飞书失败（权限不足？请在多维表格中把该飞书应用添加为可编辑协作者）。' }))
      return
    }

    res.statusCode = 201
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ ok: true }))
  } catch (error) {
    console.error('[contact] error:', error)
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ message: '暂时无法提交到飞书，请稍后重试。' }))
  }
}
