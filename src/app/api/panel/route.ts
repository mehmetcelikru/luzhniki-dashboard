import { NextResponse } from 'next/server'
import { fetchSheet } from '@/lib/sheets'

export const revalidate = 900

export async function GET() {
  try {
    const sheetId = process.env.SHEET_PANEL_ID!
    const rows = await fetchSheet(sheetId, 'Gelen ve Kalan Modüller!A2:F2000')

    const moduller: any[] = []
    const blokOzet: Record<string, { duzGelen: number; koseGelen: number }> = {}

    for (const row of rows) {
      if (!row[0] || isNaN(Number(row[0]))) continue

      const modulKodu = (row[1] || '').toString()
      const imalatTuru = (row[2] || '').toString()
      const gelenAdet = parseInt((row[3] || '0').toString()) || 0
      const tarih = (row[4] || '').toString()

      // Blok adını modül kodundan çıkar (C2_BH-... → C2)
      const blokMatch = modulKodu.match(/^([A-Z0-9]+)_/)
      const blok = blokMatch ? blokMatch[1] : 'DİĞER'

      if (!blokOzet[blok]) blokOzet[blok] = { duzGelen: 0, koseGelen: 0 }

      if (imalatTuru === 'Düz Modül') {
        blokOzet[blok].duzGelen += gelenAdet
      } else if (imalatTuru === 'Köse Modül') {
        blokOzet[blok].koseGelen += gelenAdet
      }

      moduller.push({ no: Number(row[0]), modulKodu, imalatTuru, gelenAdet, tarih })
    }

    // Üretilen toplam (sabit - tablodaki özet değerler)
    const uretilen = { duz: 1781, kose: 393 }
    const toplamGelen = moduller.reduce((s, m) => s + m.gelenAdet, 0)
    const duzGelen = Object.values(blokOzet).reduce((s, b) => s + b.duzGelen, 0)
    const koseGelen = Object.values(blokOzet).reduce((s, b) => s + b.koseGelen, 0)

    return NextResponse.json({
      moduller,
      blokOzet,
      ozet: {
        toplamGelen,
        toplamKalan: (uretilen.duz + uretilen.kose) - toplamGelen,
        duzGelen,
        duzKalan: uretilen.duz - duzGelen,
        koseGelen,
        koseKalan: uretilen.kose - koseGelen,
        duzUretilen: uretilen.duz,
        koseUretilen: uretilen.kose,
      },
      sonGuncelleme: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 })
  }
}
