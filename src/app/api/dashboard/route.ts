import { NextResponse } from 'next/server'
import { fetchSheet } from '@/lib/sheets'

export const revalidate = 900

export async function GET() {
  try {
    const [camRows, panelRows, odemeRows, cizimRows] = await Promise.all([
      fetchSheet(process.env.SHEET_CAM_ID!, 'Cam Tablosu!A3:DL400'),
      fetchSheet(process.env.SHEET_PANEL_ID!, 'Gelen ve Kalan Modüller!A2:F2000'),
      fetchSheet(process.env.SHEET_ODEME_ID!, 'Odeme Listesi!A4:P300'),
      fetchSheet(process.env.SHEET_CIZIM_ID!, 'Çizim Takip!A4:Q300'),
    ])

    // CAM özet
    const camPartiler = camRows.filter(r => r[0] && !isNaN(Number(r[0])))
    const acikCam = camPartiler.filter(r => {
      const d = (r[3] || '').toString().trim()
      return d !== '100%' && d !== 'Kapali' && d !== ''
    })

    // PANEL özet
    const panelModuller = panelRows.filter(r => r[0] && !isNaN(Number(r[0])))
    const toplamGelen = panelModuller.reduce((s, r) => s + (parseInt(r[3]) || 0), 0)
    const duzGelen = panelModuller.filter(r => r[2] === 'Düz Modül').reduce((s, r) => s + (parseInt(r[3]) || 0), 0)
    const koseGelen = panelModuller.filter(r => r[2] === 'Köse Modül').reduce((s, r) => s + (parseInt(r[3]) || 0), 0)

    // ÖDEME özet
    const faturalar = odemeRows.filter(r => r[0] && !isNaN(Number(r[0])))
    const acikFaturalar = faturalar.filter(r => {
      const d = (r[5] || '').toString().trim()
      return d !== '100%' && d !== 'Kapalı✅'
    })
    const toplamKalan = acikFaturalar.reduce((s, r) => {
      const val = parseFloat((r[12] || '0').toString().replace(/[₽\s,]/g, '')) || 0
      return s + val
    }, 0)

    // ÇİZİM özet
    const cizimler = cizimRows.filter(r => r[0] && !isNaN(Number(r[0])))

    return NextResponse.json({
      cam: {
        toplamParti: camPartiler.length,
        acikParti: acikCam.length,
      },
      panel: {
        toplamGelen,
        toplamKalan: 2174 - toplamGelen,
        duzGelen,
        koseGelen,
      },
      odeme: {
        acikFatura: acikFaturalar.length,
        toplamKalan,
        toplamFatura: faturalar.length,
      },
      personel: {
        toplam: 116,
        aktif: 113,
        izinde: 1,
        cikis: 20,
        gelmeyenBugun: 0,
        roller: { 'İşçi': 93, 'Staff': 8, 'Ustabaşı': 7, 'Haritacı': 5, 'Formen': 2, 'Depo Görevlisi': 1 },
        izindekiler: [{ ad: 'OTABEK MELİBAEV', sicil: '5027' }],
      },
      cizim: {
        toplam: cizimler.length,
        onaylandi: cizimler.filter(r => r[10] === 'Onaylandı').length,
        bekliyor: cizimler.filter(r => r[10] === 'Bekliyor').length,
        revize: cizimler.filter(r => r[10] === 'Revize Gerekli').length,
      },
      sonGuncelleme: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Dashboard verisi alınamadı' }, { status: 500 })
  }
}
