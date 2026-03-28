'use client'
import { useEffect, useState } from 'react'
import { PageHeader, KpiCard, SectionHeader, Card, Badge, ProgressBar, LoadingSpinner, ErrorMessage } from '@/components/ui'
import { Search } from 'lucide-react'

const DURUM_COLOR: Record<string, 'green' | 'orange' | 'red' | 'gray'> = {
  'Onaylandı':      'green',
  'Bekliyor':       'orange',
  'Revize Gerekli': 'orange',
  'Reddedildi':     'red',
  'İptal':          'gray',
}

export default function CizimPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterBlok, setFilterBlok] = useState('TÜMÜ')
  const [filterDurum, setFilterDurum] = useState('TÜMÜ')

  useEffect(() => {
    fetch('/api/cizim')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Veri alınamadı'); setLoading(false) })
  }, [])

  if (loading) return <div className="min-h-screen"><PageHeader title="ÇİZİM TAKİP" /><LoadingSpinner /></div>
  if (error) return <div className="min-h-screen p-6"><ErrorMessage message={error} /></div>

  const cizimler = data?.cizimler ?? []
  const ozet = data?.ozet ?? {}
  const blokOzet = data?.blokOzet ?? {}

  const bloklar = ['TÜMÜ', 'E', 'C2', 'C1', 'A1', 'A2', 'A3', 'B2', 'GENEL']
  const durumlar = ['TÜMÜ', 'Onaylandı', 'Bekliyor', 'Revize Gerekli', 'Reddedildi']

  const filtered = cizimler.filter((c: any) => {
    const blokOk = filterBlok === 'TÜMÜ' || c.blok === filterBlok
    const durumOk = filterDurum === 'TÜMÜ' || c.onayDurumu === filterDurum
    const searchOk = !search ||
      c.cizimAdi?.toLowerCase().includes(search.toLowerCase()) ||
      c.cizimNo?.toLowerCase().includes(search.toLowerCase()) ||
      c.sorumlu?.toLowerCase().includes(search.toLowerCase())
    return blokOk && durumOk && searchOk
  })

  const onayPct = ozet.toplam > 0 ? Math.round((ozet.onaylandi / ozet.toplam) * 100) : 0

  return (
    <div className="min-h-screen">
      <PageHeader title="ÇİZİM TAKİP" sub="Onay ve revizyon durumu" />

      <div className="p-4 md:p-6 space-y-6">

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 bg-border">
          <KpiCard label="Toplam Çizim" value={ozet.toplam ?? 0} color="blue" />
          <KpiCard label="Onaylandı" value={ozet.onaylandi ?? 0} color="green" sub={`%${onayPct} onay oranı`} />
          <KpiCard label="Bekliyor" value={ozet.bekliyor ?? 0} color="orange" />
          <KpiCard label="Revize Gerekli" value={ozet.revize ?? 0} color="red" />
        </div>

        {/* Genel ilerleme */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-[10px] text-muted uppercase tracking-widest">GENEL ONAY İLERLEMESİ</div>
            <div className="font-display text-2xl text-accent">{onayPct}%</div>
          </div>
          <ProgressBar value={onayPct} showLabel={false} />
        </Card>

        {/* Blok bazında özet */}
        <div>
          <SectionHeader title="BLOK BAZINDA DURUM" tag="Onay Özeti" tagColor="blue" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(blokOzet).filter(([, v]: any) => v.toplam > 0).map(([blok, b]: any) => {
              const pct = b.toplam > 0 ? Math.round((b.onaylandi / b.toplam) * 100) : 0
              return (
                <Card key={blok} className="hover:border-accent3/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-display text-2xl text-accent3">{blok}</div>
                    <div className="font-mono text-xs text-muted">{b.toplam} çizim</div>
                  </div>
                  <ProgressBar value={pct} showLabel={true} />
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    <div className="font-mono text-[9px] text-accent">✓ {b.onaylandi}</div>
                    <div className="font-mono text-[9px] text-accent2">⏳ {b.bekliyor}</div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Filtreler */}
        <Card className="p-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-40">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ara: çizim adı, no, sorumlu..."
                className="w-full bg-surface2 border border-border text-text font-mono text-xs pl-8 pr-3 py-2 outline-none focus:border-accent"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {bloklar.map(b => (
                <button key={b} onClick={() => setFilterBlok(b)}
                  className={`font-mono text-[10px] px-2.5 py-1.5 border uppercase tracking-wide transition-colors ${
                    filterBlok === b ? 'bg-accent text-bg border-accent' : 'border-border text-muted hover:border-accent hover:text-accent'
                  }`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-1 flex-wrap mt-2">
            {durumlar.map(d => (
              <button key={d} onClick={() => setFilterDurum(d)}
                className={`font-mono text-[10px] px-2.5 py-1.5 border uppercase tracking-wide transition-colors ${
                  filterDurum === d ? 'bg-accent2 text-bg border-accent2' : 'border-border text-muted hover:border-accent2 hover:text-accent2'
                }`}>
                {d}
              </button>
            ))}
          </div>
        </Card>

        {/* Çizim tablosu */}
        <Card className="overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['NO', 'BLOK', 'ÇİZİM ADI', 'ÇİZİM NO', 'REV.', 'KATEGORİ', 'SORUMLU', 'GÖNDERİM', 'GERİ DÖNÜŞ', 'ONAY', 'DURUM'].map(h => (
                  <th key={h} className="text-left px-3 py-3 font-mono text-[9px] text-muted uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.no} className="border-b border-border/40 hover:bg-surface2 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-[10px] text-muted">{c.no}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px] font-bold text-accent3">{c.blok}</td>
                  <td className="px-3 py-2.5 font-sans text-xs text-text max-w-52 truncate">{c.cizimAdi}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px] text-muted whitespace-nowrap">{c.cizimNo}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px] text-accent2 font-bold">{c.revizyon}</td>
                  <td className="px-3 py-2.5 font-mono text-[9px] text-muted whitespace-nowrap">{c.kategori}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px] text-text">{c.sorumlu}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px] text-muted whitespace-nowrap">{c.gonderimTarihi}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px] text-muted whitespace-nowrap">{c.geriDonusTarihi}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px] text-accent whitespace-nowrap">{c.onayTarihi}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <Badge label={c.onayDurumu} color={DURUM_COLOR[c.onayDurumu] ?? 'gray'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-border font-mono text-[10px] text-muted">
            {filtered.length} kayıt gösteriliyor (toplam {cizimler.length})
          </div>
        </Card>

      </div>
    </div>
  )
}
