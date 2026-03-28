'use client'
import { useEffect, useState } from 'react'
import { PageHeader, KpiCard, SectionHeader, Card, Badge, LoadingSpinner, ErrorMessage } from '@/components/ui'
import { UserCheck, UserMinus, UserX, AlertCircle } from 'lucide-react'

export default function PersonelPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/personel')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Veri alınamadı'); setLoading(false) })
  }, [])

  if (loading) return <div className="min-h-screen"><PageHeader title="PERSONEL" /><LoadingSpinner /></div>
  if (error) return <div className="min-h-screen p-6"><ErrorMessage message={error} /></div>

  const ozet = data?.ozet ?? {
    toplam: 116, aktif: 113, izinde: 1, cikis: 20, gelmeyenBugun: 0,
    roller: { 'İşçi': 93, 'Staff': 8, 'Ustabaşı': 7, 'Haritacı': 5, 'Formen': 2, 'Depo Görevlisi': 1 },
    izindekiler: [{ ad: 'OTABEK MELİBAEV', sicil: '5027' }],
  }

  const rolRenkler: Record<string, string> = {
    'İşçi': 'text-accent', 'Staff': 'text-accent3', 'Ustabaşı': 'text-accent2',
    'Haritacı': 'text-text', 'Formen': 'text-muted', 'Depo Görevlisi': 'text-muted',
  }

  const maxRol = Math.max(...Object.values(ozet.roller ?? {}).map(Number))

  return (
    <div className="min-h-screen">
      <PageHeader title="PERSONEL" sub="Saha ekibi durumu" />

      <div className="p-4 md:p-6 space-y-6">

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 bg-border">
          <KpiCard label="Toplam Personel" value={ozet.toplam} color="green" />
          <KpiCard label="Aktif" value={ozet.aktif} color="blue" sub="Sahada çalışıyor" />
          <KpiCard label="İzinde" value={ozet.izinde} color="orange" sub="Onaylı izin" />
          <KpiCard label="Bugün Gelmeyen" value={ozet.gelmeyenBugun} color={ozet.gelmeyenBugun > 0 ? 'red' : 'green'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Durum özeti */}
          <div>
            <SectionHeader title="DURUM ÖZETİ" />
            <Card>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-accent/5 border border-accent/20">
                  <UserCheck size={24} className="text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-mono text-[10px] text-muted uppercase tracking-wide mb-1">Aktif</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border h-1.5">
                        <div className="h-full bg-accent" style={{ width: `${Math.round((ozet.aktif/ozet.toplam)*100)}%` }} />
                      </div>
                      <span className="font-display text-2xl text-accent">{ozet.aktif}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-accent2/5 border border-accent2/20">
                  <UserMinus size={24} className="text-accent2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-mono text-[10px] text-muted uppercase tracking-wide mb-1">İzinde</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border h-1.5">
                        <div className="h-full bg-accent2" style={{ width: `${Math.round((ozet.izinde/ozet.toplam)*100)}%` }} />
                      </div>
                      <span className="font-display text-2xl text-accent2">{ozet.izinde}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-surface2 border border-border">
                  <UserX size={24} className="text-muted flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-mono text-[10px] text-muted uppercase tracking-wide mb-1">Çıkış Yapan</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border h-1.5">
                        <div className="h-full bg-muted" style={{ width: `${Math.round((ozet.cikis/ozet.toplam)*100)}%` }} />
                      </div>
                      <span className="font-display text-2xl text-muted">{ozet.cikis}</span>
                    </div>
                  </div>
                </div>

                {ozet.gelmeyenBugun > 0 && (
                  <div className="flex items-center gap-4 p-3 bg-danger/5 border border-danger/20">
                    <AlertCircle size={24} className="text-danger flex-shrink-0" />
                    <div>
                      <div className="font-mono text-[10px] text-muted uppercase tracking-wide">Bugün Gelmeyen</div>
                      <div className="font-display text-2xl text-danger">{ozet.gelmeyenBugun}</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Rol dağılımı */}
          <div>
            <SectionHeader title="ROL DAĞILIMI" />
            <Card>
              <div className="space-y-3">
                {Object.entries(ozet.roller ?? {}).map(([rol, sayi]) => {
                  const pct = Math.round((Number(sayi) / maxRol) * 100)
                  return (
                    <div key={rol}>
                      <div className="flex justify-between font-mono text-[10px] mb-1">
                        <span className="text-muted uppercase tracking-wide">{rol}</span>
                        <span className={rolRenkler[rol] ?? 'text-text'}>{sayi as number}</span>
                      </div>
                      <div className="bg-border h-1.5">
                        <div
                          className={`h-full transition-all duration-700 ${
                            rol === 'İşçi' ? 'bg-accent' :
                            rol === 'Staff' ? 'bg-accent3' :
                            rol === 'Ustabaşı' ? 'bg-accent2' : 'bg-muted'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* İzindekiler */}
        {ozet.izindekiler?.length > 0 && (
          <div>
            <SectionHeader title="İZİNDE OLAN PERSONEL" tag={`${ozet.izindekiler.length} Kişi`} tagColor="orange" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ozet.izindekiler.map((k: any) => (
                <Card key={k.sicil} className="border-accent2/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent2/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-sm text-accent2">{k.ad[0]}</span>
                  </div>
                  <div>
                    <div className="font-sans text-sm font-medium text-text">{k.ad}</div>
                    <div className="font-mono text-[10px] text-muted">Sicil: {k.sicil}</div>
                  </div>
                  <div className="ml-auto">
                    <Badge label="İzinde" color="orange" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Personel listesi */}
        {data?.personeller?.length > 0 && (
          <div>
            <SectionHeader title="PERSONEL LİSTESİ" tag={`${data.personeller.length} Kişi`} />
            <Card className="overflow-x-auto p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['SİCİL', 'AD SOYAD', 'ROL', 'DURUM'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-mono text-[9px] text-muted uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.personeller.map((p: any, i: number) => (
                    <tr key={i} className="border-b border-border/40 hover:bg-surface2 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-[10px] text-muted">{p.sicil}</td>
                      <td className="px-4 py-2.5 font-sans text-xs font-medium text-text">{p.ad}</td>
                      <td className="px-4 py-2.5 font-mono text-[10px] text-muted">{p.rol}</td>
                      <td className="px-4 py-2.5">
                        <Badge
                          label={p.durum}
                          color={p.durum === 'Aktif' ? 'green' : p.durum === 'İzinde' ? 'orange' : 'gray'}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
