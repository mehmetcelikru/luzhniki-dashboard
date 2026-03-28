'use client'
import { useEffect, useState } from 'react'
import { PageHeader, KpiCard, SectionHeader, Card, Badge, ProgressBar, LoadingSpinner, ErrorMessage } from '@/components/ui'

const BLOK_ORDER = ['E', 'C2', 'C1', 'A1', 'A2', 'A3', 'B2']

export default function PanelPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/panel')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Veri alınamadı'); setLoading(false) })
  }, [])

  if (loading) return <div className="min-h-screen"><PageHeader title="PANEL TAKİP" /><LoadingSpinner /></div>
  if (error) return <div className="min-h-screen p-6"><ErrorMessage message={error} /></div>

  const ozet = data?.ozet ?? {}
  const blokOzet = data?.blokOzet ?? {}

  const gelenPct = ozet.duzUretilen + ozet.koseUretilen > 0
    ? Math.round((ozet.toplamGelen / (ozet.duzUretilen + ozet.koseUretilen)) * 100) : 0

  return (
    <div className="min-h-screen">
      <PageHeader title="PANEL TAKİP" sub="Modül sevkiyat ve montaj durumu" />

      <div className="p-4 md:p-6 space-y-6">

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 bg-border">
          <KpiCard label="Düz Üretilen" value={(ozet.duzUretilen ?? 1781).toLocaleString('tr')} color="green" sub="Fabrika çıkışı" />
          <KpiCard label="Köşe Üretilen" value={(ozet.koseUretilen ?? 393).toLocaleString('tr')} color="blue" sub="Fabrika çıkışı" />
          <KpiCard label="Şantiyeye Gelen" value={(ozet.toplamGelen ?? 1023).toLocaleString('tr')} color="orange" sub={`%${gelenPct} teslim`} />
          <KpiCard label="Kalan Teslim" value={(ozet.toplamKalan ?? 1151).toLocaleString('tr')} color="red" sub="Henüz gelmedi" />
        </div>

        {/* Genel ilerleme */}
        <Card>
          <SectionHeader title="GENEL İLERLEME" />
          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-mono text-[10px] text-muted mb-1.5">
                <span>DÜZ MODÜL — Gelen / Toplam</span>
                <span>{ozet.duzGelen ?? 803} / {ozet.duzUretilen ?? 1781}</span>
              </div>
              <ProgressBar
                value={ozet.duzUretilen ? Math.round(((ozet.duzGelen ?? 803) / ozet.duzUretilen) * 100) : 45}
                showLabel={true}
              />
            </div>
            <div>
              <div className="flex justify-between font-mono text-[10px] text-muted mb-1.5">
                <span>KÖŞE MODÜL — Gelen / Toplam</span>
                <span>{ozet.koseGelen ?? 220} / {ozet.koseUretilen ?? 393}</span>
              </div>
              <ProgressBar
                value={ozet.koseUretilen ? Math.round(((ozet.koseGelen ?? 220) / ozet.koseUretilen) * 100) : 56}
                showLabel={true}
              />
            </div>
          </div>
        </Card>

        {/* Bina bina özet */}
        <div>
          <SectionHeader title="BİNA BAZINDA DURUM" tag="Sevkiyat" tagColor="blue" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BLOK_ORDER.map(blok => {
              const b = blokOzet[blok] ?? { duzGelen: 0, koseGelen: 0 }
              const toplamGelen = b.duzGelen + b.koseGelen
              return (
                <Card key={blok} className="hover:border-accent3/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-display text-3xl text-accent3">{blok}</div>
                    <div className="text-right">
                      <div className="font-display text-2xl text-text">{toplamGelen}</div>
                      <div className="font-mono text-[9px] text-muted">toplam gelen</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-surface2 p-2">
                      <div className="font-mono text-[9px] text-muted mb-1">DÜZ GELEN</div>
                      <div className="font-display text-xl text-accent">{b.duzGelen}</div>
                    </div>
                    <div className="bg-surface2 p-2">
                      <div className="font-mono text-[9px] text-muted mb-1">KÖŞE GELEN</div>
                      <div className="font-display text-xl text-accent3">{b.koseGelen}</div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Son gelen modüller */}
        <div>
          <SectionHeader title="SON GELEN MODÜLLER" tag="Son 20" tagColor="orange" />
          <Card className="overflow-x-auto p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['NO', 'MODÜL KODU', 'BLOK', 'TÜR', 'ADET', 'TARİH'].map(h => (
                    <th key={h} className="text-left px-3 py-3 font-mono text-[9px] text-muted uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.moduller ?? []).slice(-20).reverse().map((m: any, i: number) => (
                  <tr key={i} className="border-b border-border/40 hover:bg-surface2 transition-colors">
                    <td className="px-3 py-2 font-mono text-[10px] text-muted">{m.no}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-text">{m.modulKodu}</td>
                    <td className="px-3 py-2">
                      <span className="font-mono text-[10px] font-bold text-accent">
                        {m.modulKodu?.split('_')[0] ?? '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        label={m.imalatTuru === 'Düz Modül' ? 'Düz' : 'Köşe'}
                        color={m.imalatTuru === 'Düz Modül' ? 'green' : 'gray'}
                      />
                    </td>
                    <td className="px-3 py-2 font-mono text-[10px] text-text text-center">{m.gelenAdet}</td>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted">{m.tarih}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

      </div>
    </div>
  )
}
