export function basicAuthOk(header?: string | null) {
  const user = process.env.ADMIN_USER || ''
  const pass = process.env.ADMIN_PASS || ''
  if (!user || !pass) return false
  if (!header) return false
  const [type, creds] = header.split(' ')
  if (type?.toLowerCase() !== 'basic') return false
  try {
    const decoded = Buffer.from(creds, 'base64').toString('utf8')
    const [u, p] = decoded.split(':')
    return u === user && p === pass
  } catch { return false }
}
