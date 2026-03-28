import { google } from 'googleapis'

const CACHE_TTL = parseInt(process.env.CACHE_TTL || '900') * 1000
const cache = new Map<string, { data: any; ts: number }>()

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  return auth
}

export async function fetchSheet(sheetId: string, range: string): Promise<any[][]> {
  const cacheKey = `${sheetId}:${range}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data

  try {
    const auth = await getAuth()
    const sheets = google.sheets({ version: 'v4', auth })
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    })
    const data = res.data.values || []
    cache.set(cacheKey, { data, ts: Date.now() })
    return data
  } catch (err) {
    console.error('Sheets fetch error:', err)
    return []
  }
}

export function cacheAge(sheetId: string, range: string): number | null {
  const cached = cache.get(`${sheetId}:${range}`)
  if (!cached) return null
  return Math.floor((Date.now() - cached.ts) / 1000)
}
