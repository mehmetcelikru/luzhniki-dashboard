import { NextResponse } from 'next/server'
import { fetchSheet } from '@/lib/sheets'

export const revalidate = 900

export async function GET() {
  try {
    const sheetId = process.env.SHEET_CIZIM_ID!
    const rows = await fetchSheet(sheetId, 'Çizim Takip!A4:Q300')

    const cizimler: any[] = []

    for (const row of rows) {
      if (!row[0] || isNaN(Number(row[0]))) continue

      cizimler.push({
        no: Number(row[0]),
        blok: (row[1] || '').toString(),
        cizimAdi: (row[2] || '').toString(),
        cizimNo: (row[3] || '').toString(),
        revizyon: (row[4] || '').toString(),
        kategori: (row[5] || '').toString(),
        sorumlu: (row[6] || '').toString(),
        gonderimTarihi: (row[7] || '').toString(),
        geriDonusTarihi: (row[8] || '').toString(),
        onayTarihi: (row[9] || '').toString(),
        onayDurumu: (row[10] || 'Bekliyor').toString(),
        aciklama: (row[12] || '').toString(),
        dosyaKodu: (row[15] || '').toString(),
        enkaOnayNo: (row[16] || '').toString(),
      })
    }

    const blokOzet: Record<string, any> = {}
    const bloklar = ['E', 'C2', 'C1', 'A1', 'A2', 'A3', 'B2', 'GENEL']
    
    for (const blok of bloklar) {
      const blokCizimler = cizimler.filter(c => c.blok === blok)
      blokOzet[blok] = {
        toplam: blokCizimler.length,
        onaylandi: blokCizimler.filter(c => c.onayDurumu === 'Onaylandı').length,
        bekliyor: blokCizimler.filter(c => c.onayDurumu === 'Bekliyor').length,
        revize: blokCizimler.filter(c => c.onayDurumu === 'Revize Gerekli').length,
        reddedildi: blokCizimler.filter(c => c.onayDurumu === 'Reddedildi').length,
      }
    }

    return NextResponse.json({
      cizimler,
      blokOzet,
      ozet: {
        toplam: cizimler.length,
        onaylandi: cizimler.filter(c => c.onayDurumu === 'Onaylandı').length,
        bekliyor: cizimler.filter(c => c.onayDurumu === 'Bekliyor').length,
        revize: cizimler.filter(c => c.onayDurumu === 'Revize Gerekli').length,
        reddedildi: cizimler.filter(c => c.onayDurumu === 'Reddedildi').length,
      },
      sonGuncelleme: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Veri alınamadı' }, { status: 500 })
  }
}
