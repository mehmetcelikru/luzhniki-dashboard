'use client'
import { useEffect, useState } from 'react'
import { PageHeader, KpiCard, SectionHeader, Card, Badge, ProgressBar, LoadingSpinner, ErrorMessage } from '@/components/ui'
import { Search } from 'lucide-react'

function formatRuble(n: number) {
  if (!n) return '—'
  return n.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' ₽'
}

export default function OdemePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('TÜMÜ')

  useEffect(() => {
    fetch('/api/odeme')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Veri alınamadı'); setLoading(false) })
  }, [])

  if (loading) return <div className="min-h-screen"><PageHeader title="ÖDEMELER" /><LoadingSpinner /></div>
  if (error) return <div className="min-h-screen p-6"><ErrorMessage message={error} /></div>

  const faturalar = data?.faturalar ?? []
  const ozet = data?.ozet ?? {}

  const filtered = faturalar.filter((f: any) => {
    const durumOk = filter === 'TÜMÜ' || f.durum === filter
    const searchOk = !search ||
      f.aciklama?.toLowerCase().includes(search.toLowerCase()) ||
      f.firma?.toLowerCase().includes(search.toLowerCase()) ||
      f.blok?.toLowerCase().includes(search.toLowerCase())
    return durumOk && searchOk
  })

  const odenmePct = ozet.toplamTutar > 0
    ? Math.round(((ozet.toplamTutar - ozet.toplamKalan) / ozet.toplamTutar) * 100) : 0

  return (
    <div className="min-h-screen">
      <PageHeader title="ÖDEMELER" sub="Fatura ve ödeme takibi" />

      <div className="p-4 md:p-6 space-y-6">

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 bg-border">
          <KpiCard label="Toplam Fatura" value={ozet.toplamFatura ?? 0} color="green" />
          <KpiCard label="Kapalı Fatura" value={ozet.kapaliiFatura ?? 0} color="blue" sub="Ödeme tamamlandı" />
          <KpiCard label="Açık Fatura" value={ozet.acikFatura ?? 0} color="orange" sub="Ödeme bekliyor" />
          <KpiCard label="Kalan Ödeme" value={formatRuble(ozet.toplamKalan ?? 0)} color="red" />
        </div>

        {/* Genel ilerleme */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <SectionHeader title="ÖDEME İLERLEMESİ" />
            <div className="font-display text-3xl text-accent">{odenmePct}%</div>
          </div>
          <ProgressBar value={odenmePct} showLabel={false} />
          <div className="flex justify-between font-mono text-[10px] text-muted mt-2">
            <span>Ödenen: {formatRuble((ozet.toplamTutar ?? 0) - (ozet.toplamKalan ?? 0))}</span>
            <span>Toplam: {formatRuble(ozet.toplamTutar ?? 0)}</span>
          </div>
        </Card>

        {/* Açık faturalar özeti */}
        {data?.acikFaturalar?.length > 0 && (
          <div>
            <SectionHeader title="AÇIK FATURALAR" tag={`${data.acikFaturalar.length} Kalem`} tagColor="red" />
            <div className="space-y-2">
              {data.acikFaturalar.map((f: any) => (
                <Card key={f.no} className="border-danger/20">
                  <div className="flex items-center gap-4">
                    <div className="font-mono text-[10px] text-muted w-6">{f.no}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-sm font-medium text-text">{f.aciklama}</div>
                      <div className="font-mono text-[10px] text-muted">{f.firma} · {f.blok}</div>
                      <div className="mt-2">
                        <ProgressBar value={f.durumYuzde} showLabel={false} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-sm text-danger font-medium">{formatRuble(f.kalanTutar)}</div>
                      <div className="font-mono text-[9px] text-muted">kalan</div>
                      <div className="font-mono text-[9px] text-muted mt-0.5">%{f.durumYuzde} ödendi</div>
                    </div>
                  </div>
                </Card>
              ))}
              <Card className="bg-danger/5 border-danger/30">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-muted uppercase tracking-wide">Toplam Açık Ödeme</span>
                  <span className="font-display text-3xl text-danger">{formatRuble(ozet.toplamKalan ?? 0)}</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tüm faturalar tablosu */}
        <div>
          <SectionHeader title="TÜM FATURALAR" />
          <Card className="p-3 mb-3">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-40">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Ara: açıklama, firma, blok..."
                  className="w-full bg-surface2 border border-border text-text font-mono text-xs pl-8 pr-3 py-2 outline-none focus:border-accent"
                />
              </div>
              {['TÜMÜ', 'Açık', 'Kapalı'].map(d => (
                <button key={d} onClick={() => setFilter(d)}
                  className={`font-mono text-[10px] px-3 py-1.5 border uppercase tracking-wide transition-colors ${
                    filter === d ? 'bg-accent text-bg border-accent' : 'border-border text-muted hover:border-accent hover:text-accent'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </Card>

          <Card className="overflow-x-auto p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['NO', 'BLOK', 'AÇIKLAMA', 'FİRMA', 'KATEGORİ', 'TUTAR', 'ÖDENEN', 'KALAN', '%', 'DURUM'].map(h => (
                    <th key={h} className="text-left px-3 py-3 font-mono text-[9px] text-muted uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f: any) => (
                  <tr key={f.no} className="border-b border-border/40 hover:bg-surface2 transition-colors">
                    <td className="px-3 py-2.5 font-mono text-[10px] text-muted">{f.no}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] font-bold text-accent">{f.blok}</td>
                    <td className="px-3 py-2.5 font-sans text-xs text-text max-w-48 truncate">{f.aciklama}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-muted whitespace-nowrap">{f.firma}</td>
                    <td className="px-3 py-2.5 font-mono text-[9px] text-muted">{f.kategori}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-text text-right whitespace-nowrap">{formatRuble(f.faturaTutari)}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-accent text-right whitespace-nowrap">{formatRuble(f.odenenTutar)}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-danger text-right whitespace-nowrap">{formatRuble(f.kalanTutar)}</td>
                    <td className="px-3 py-2.5 w-20">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 bg-border h-0.5">
                          <div className={`h-full ${f.durumYuzde === 100 ? 'bg-accent' : f.durumYuzde >= 70 ? 'bg-accent2' : 'bg-danger'}`}
                            style={{ width: `${f.durumYuzde}%` }} />
                        </div>
                        <span className="font-mono text-[9px] text-muted w-7">{f.durumYuzde}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge label={f.durum} color={f.durum === 'Kapalı' ? 'green' : 'orange'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-border font-mono text-[10px] text-muted">
              {filtered.length} kayıt gösteriliyor
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
