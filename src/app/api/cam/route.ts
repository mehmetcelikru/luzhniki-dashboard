import { NextResponse } from 'next/server'
import { fetchSheet } from '@/lib/sheets'
import type { CamParti } from '@/types'

export const revalidate = 900 // 15 dakika

export async function GET() {
  try {
    const sheetId = process.env.SHEET_CAM_ID!
    const rows = await fetchSheet(sheetId, 'Cam Tablosu!A3:DO400')

    const partiler: CamParti[] = []

    for (const row of rows) {
      if (!row[0] || isNaN(Number(row[0]))) continue

      const durum = (row[3] || '').toString().trim()
      const gelenMetraj = parseFloat((row[116] || '0').toString().replace(',', '.')) || 0
      const kalanMetraj = parseFloat((row[117] || '0').toString().replace(',', '.')) || 0
      const siparisMetraj = gelenMetraj + kalanMetraj
      const gelenYuzde = parseInt((row[118] || '0').toString()) || 0

      partiler.push({
        no: Number(row[0]),
        partiNo: (row[1] || '').toString(),
        faturaNo: (row[2] || '').toString(),
        faturaDurumu: durum,
        blok: (row[11] || '').toString().trim(),
        aciklama: (row[12] || '').toString(),
        siparisMetraj,
        gelenMetraj,
        kalanMetraj,
        gelenYuzde,
        sevkTarihi: (row[18] || '').toString(),
      })
    }

    const acikPartiler = partiler.filter(p =>
      p.faturaDurumu !== '100%' && p.faturaDurumu !== 'Kapali' && p.faturaDurumu !== ''
    )

    return NextResponse.json({
      partiler,
      ozet: {
        toplamParti: partiler.length,
        acikParti: acikPartiler.length,
        toplamMetraj: partiler.reduce((s, p) => s + p.siparisMetraj, 0),
        kalanMetraj: partiler.reduce((s, p) => s + p.kalanMetraj, 0),
      },
      sonGuncelleme: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 })
  }
}
