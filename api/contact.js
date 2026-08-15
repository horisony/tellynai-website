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

const pick = (v) => String(v ?? '').trim()
const pickAttribution = (v) => pick(v).slice(0, 160)

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
    const name = pick(form.name)
    const company = pick(form.company)
    const contact = pick(form.contact)
    const need = pick(form.need)

    if (!name || !contact) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ message: '请填写称呼和联系方式。' }))
      return
    }

    // 每个字段写入自己的列；select 字段只接受已有选项，空值按语义映射。
    const fields = {
      '怎么称呼你？': name,
      '公司 / 行业': company,
      '微信 / 手机号': contact,
      '你想通过 AI 解决什么问题？': need,
      '感兴趣的服务': pick(form.service) || '还不确定',
      '期望什么时候启动？': pick(form.startTime) || '还不确定',
    }
    const companySize = pick(form.companySize)
    const source = pick(form.source)
    const attribution = form.attribution && typeof form.attribution === 'object' ? form.attribution : {}
    if (companySize) fields['企业规模'] = companySize
    const sourceDetails = [
      source && `页面：${pickAttribution(source)}`,
      pickAttribution(attribution.currentPage) && `提交路径：${pickAttribution(attribution.currentPage)}`,
      pickAttribution(attribution.landingPage) && `首次落地：${pickAttribution(attribution.landingPage)}`,
      pickAttribution(attribution.referrer) && `外部来源：${pickAttribution(attribution.referrer)}`,
      pickAttribution(attribution.language) && `语言：${pickAttribution(attribution.language)}`,
      pickAttribution(attribution.utm_source) && `utm_source：${pickAttribution(attribution.utm_source)}`,
      pickAttribution(attribution.utm_medium) && `utm_medium：${pickAttribution(attribution.utm_medium)}`,
      pickAttribution(attribution.utm_campaign) && `utm_campaign：${pickAttribution(attribution.utm_campaign)}`,
      pickAttribution(attribution.utm_content) && `utm_content：${pickAttribution(attribution.utm_content)}`,
      pickAttribution(attribution.utm_term) && `utm_term：${pickAttribution(attribution.utm_term)}`,
    ].filter(Boolean).join('\n')
    if (sourceDetails) fields['来源页面'] = sourceDetails

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
    const records = [{ fields }]
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
