import { NextResponse } from 'next/server'
import { fetchSheet } from '@/lib/sheets'

export const revalidate = 900

function parseRuble(val: string): number {
  if (!val) return 0
  return parseFloat(val.toString().replace(/[₽\s,]/g, '').replace('.', '').replace(',', '.')) || 0
}

export async function GET() {
  try {
    const sheetId = process.env.SHEET_ODEME_ID!
    const rows = await fetchSheet(sheetId, 'Odeme Listesi!A4:P300')

    const faturalar: any[] = []

    for (const row of rows) {
      if (!row[0] || isNaN(Number(row[0]))) continue

      const durumStr = (row[5] || '').toString().trim()
      const durumYuzde = parseInt(durumStr.replace('%', '')) || 0
      const faturaTutari = parseRuble(row[8])
      const odenenTutar = parseRuble(row[10])
      const kalanTutar = parseRuble(row[12])

      faturalar.push({
        no: Number(row[0]),
        blok: (row[1] || '').toString(),
        aciklama: (row[2] || '').toString(),
        kategori: (row[3] || '').toString(),
        firma: (row[4] || '').toString(),
        durum: durumYuzde === 100 ? 'Kapalı' : 'Açık',
        durumYuzde,
        faturaNo: (row[7] || '').toString(),
        faturaTutari,
        odenenTutar,
        kalanTutar,
        faturaTarihi: (row[9] || '').toString(),
        odemeTarihi: (row[11] || '').toString(),
        malzemeDurumu: (row[14] || '').toString(),
        not: (row[15] || '').toString(),
      })
    }

    const acikFaturalar = faturalar.filter(f => f.durum === 'Açık')
    const toplamKalan = acikFaturalar.reduce((s, f) => s + f.kalanTutar, 0)
    const toplamFatura = faturalar.reduce((s, f) => s + f.faturaTutari, 0)

    return NextResponse.json({
      faturalar,
      acikFaturalar,
      ozet: {
        toplamFatura: faturalar.length,
        acikFatura: acikFaturalar.length,
        kapaliiFatura: faturalar.length - acikFaturalar.length,
        toplamTutar: toplamFatura,
        toplamKalan,
        toplamOdenen: toplamFatura - toplamKalan,
      },
      sonGuncelleme: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 })
  }
}
