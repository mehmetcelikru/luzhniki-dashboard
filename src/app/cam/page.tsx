'use client'
import { useEffect, useState } from 'react'
import { PageHeader, KpiCard, SectionHeader, Card, Badge, LoadingSpinner, ErrorMessage } from '@/components/ui'
import { Search } from 'lucide-react'

export default function CamPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterBlok, setFilterBlok] = useState('TÜMÜ')
  const [filterDurum, setFilterDurum] = useState('TÜMÜ')

  useEffect(() => {
    fetch('/api/cam')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Veri alınamadı'); setLoading(false) })
  }, [])

  if (loading) return <div className="min-h-screen"><PageHeader title="CAM TAKİP" /><LoadingSpinner /></div>
  if (error) return <div className="min-h-screen p-6"><ErrorMessage message={error} /></div>

  const partiler = data?.partiler ?? []
  const ozet = data?.ozet ?? {}

  const bloklar = ['TÜMÜ', ...Array.from(new Set(partiler.map((p: any) => p.blok).filter(Boolean))) as string[]]
  const durumlar = ['TÜMÜ', 'Açık', 'Kapalı']

  const filtered = partiler.filter((p: any) => {
    const blokOk = filterBlok === 'TÜMÜ' || p.blok === filterBlok
    const durumOk = filterDurum === 'TÜMÜ' ||
      (filterDurum === 'Açık' && p.faturaDurumu !== '100%' && p.faturaDurumu !== 'Kapali') ||
      (filterDurum === 'Kapalı' && (p.faturaDurumu === '100%' || p.faturaDurumu === 'Kapali'))
    const searchOk = !search || p.aciklama?.toLowerCase().includes(search.toLowerCase()) ||
      p.blok?.toLowerCase().includes(search.toLowerCase()) ||
      p.faturaNo?.toLowerCase().includes(search.toLowerCase())
    return blokOk && durumOk && searchOk
  })

  return (
    <div className="min-h-screen">
      <PageHeader title="CAM TAKİP" sub="Sipariş ve sevkiyat durumu" />

      <div className="p-4 md:p-6 space-y-6">

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 bg-border">
          <KpiCard label="Toplam Parti" value={ozet.toplamParti ?? 0} color="green" />
          <KpiCard label="Açık Parti" value={ozet.acikParti ?? 0} sub="Teslim bekliyor" color="orange" />
          <KpiCard label="Toplam m²" value={Math.round(ozet.toplamMetraj ?? 0).toLocaleString('tr')} color="blue" />
          <KpiCard label="Kalan m²" value={Math.round(ozet.kalanMetraj ?? 0).toLocaleString('tr')} color="red" />
        </div>

        {/* Filtreler */}
        <Card>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ara: açıklama, blok, fatura no..."
                className="w-full bg-surface2 border border-border text-text font-mono text-xs pl-8 pr-3 py-2 outline-none focus:border-accent"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {bloklar.map(b => (
                <button key={b} onClick={() => setFilterBlok(b)}
                  className={`font-mono text-[10px] px-3 py-1.5 border uppercase tracking-wide transition-colors ${
                    filterBlok === b ? 'bg-accent text-bg border-accent' : 'border-border text-muted hover:border-accent hover:text-accent'
                  }`}>
                  {b}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {durumlar.map(d => (
                <button key={d} onClick={() => setFilterDurum(d)}
                  className={`font-mono text-[10px] px-3 py-1.5 border uppercase tracking-wide transition-colors ${
                    filterDurum === d ? 'bg-accent2 text-bg border-accent2' : 'border-border text-muted hover:border-accent2 hover:text-accent2'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Tablo */}
        <Card className="overflow-x-auto p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['NO', 'PARTİ', 'BLOK', 'AÇIKLAMA', 'SİPARİŞ m²', 'GELEN m²', 'KALAN m²', '%', 'DURUM', 'SEVKİYAT'].map(h => (
                  <th key={h} className="text-left px-3 py-3 font-mono text-[9px] text-muted uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: any, i: number) => {
                const isOpen = p.faturaDurumu !== '100%' && p.faturaDurumu !== 'Kapali'
                const pct = p.gelenYuzde ?? 0
                return (
                  <tr key={i} className="border-b border-border/40 hover:bg-surface2 transition-colors">
                    <td className="px-3 py-2.5 font-mono text-[10px] text-muted">{p.no}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-text">{p.partiNo}</td>
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-[10px] font-bold text-accent">{p.blok}</span>
                    </td>
                    <td className="px-3 py-2.5 font-sans text-xs text-text max-w-48 truncate">{p.aciklama}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-text text-right">{p.siparisMetraj?.toFixed(2)}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-accent text-right">{p.gelenMetraj?.toFixed(2)}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-danger text-right">{p.kalanMetraj?.toFixed(2)}</td>
                    <td className="px-3 py-2.5 w-24">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 bg-border h-0.5">
                          <div className={`h-full ${pct >= 80 ? 'bg-accent' : pct >= 50 ? 'bg-accent2' : 'bg-danger'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-mono text-[9px] text-muted w-7 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge label={isOpen ? 'Açık' : 'Kapalı'} color={isOpen ? 'orange' : 'green'} />
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-muted whitespace-nowrap">{p.sevkTarihi}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-border font-mono text-[10px] text-muted">
            {filtered.length} kayıt gösteriliyor (toplam {partiler.length})
          </div>
        </Card>
      </div>
    </div>
  )
}
