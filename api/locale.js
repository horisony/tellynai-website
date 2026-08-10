export default function handler(req, res) {
  const country = req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'] || ''
  res.setHeader('Cache-Control', 'private, max-age=3600')
  res.status(200).json({ country })
}
