import { KpiCard, SectionHeader, Card, ProgressBar, Badge, PageHeader } from '@/components/ui'
import { Clock, RefreshCw } from 'lucide-react'

async function getDashboardData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/dashboard`, {
      next: { revalidate: 900 }
    })
    if (!res.ok) throw new Error('API hatası')
    return res.json()
  } catch {
    return null
  }
}

const BLOKLAR = [
  { id: 'E',  label: 'E Blok',  sub: 'Waterfront / Ana',    sevk: 100, montaj: 100 },
  { id: 'C2', label: 'C2 Blok', sub: 'Garden — 2. Bina',    sevk: 95,  montaj: 95  },
  { id: 'C1', label: 'C1 Blok', sub: 'Garden — 1. Bina',    sevk: 90,  montaj: 82  },
  { id: 'A1', label: 'A1 Blok', sub: 'Highline — 1. Bina',  sevk: 82,  montaj: 78  },
  { id: 'A2', label: 'A2 Blok', sub: 'Highline — 2. Bina',  sevk: 75,  montaj: 70  },
  { id: 'A3', label: 'A3 Blok', sub: 'Highline — 3. Bina',  sevk: 60,  montaj: 55  },
]

export default async function DashboardPage() {
  const data = await getDashboardData()

  return (
    <div className="min-h-screen">
      <PageHeader
        title="OPERASYON PANELİ"
        sub="MIMSA Alüminyum Cephe — Enka Luzhniki Collection"
      />

      <div className="p-4 md:p-6 space-y-6">

        {/* Son güncelleme */}
        {data?.sonGuncelleme && (
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted">
            <Clock size={12} />
            <span>Son güncelleme: {new Date(data.sonGuncelleme).toLocaleString('tr-TR')}</span>
            <span className="ml-2 flex items-center gap-1 text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
              15 dk'da bir yenilenir
            </span>
          </div>
        )}

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-0.5 bg-border">
          <KpiCard
            label="Toplam Cam Partisi"
            value={data?.cam?.toplamParti ?? 96}
            sub="RSK / Osinovaya fabrikalar"
            color="green"
          />
          <KpiCard
            label="Açık Cam Siparişi"
            value={data?.cam?.acikParti ?? 12}
            sub="Teslim bekliyor"
            color="orange"
          />
          <KpiCard
            label="Gelen Panel"
            value={data?.panel?.toplamGelen ?? 1023}
            sub={`Düz: ${data?.panel?.duzGelen ?? 803} · Köşe: ${data?.panel?.koseGelen ?? 220}`}
            color="blue"
          />
          <KpiCard
            label="Açık Ödeme"
            value={data?.odeme?.acikFatura ?? 3}
            sub="Ödeme bekliyor"
            color="red"
          />
          <KpiCard
            label="Aktif Personel"
            value={data?.personel?.aktif ?? 113}
            sub={`Toplam: ${data?.personel?.toplam ?? 116} · İzin: ${data?.personel?.izinde ?? 1}`}
            color="green"
          />
        </div>

        {/* Blok İlerlemesi */}
        <div>
          <SectionHeader title="BLOK BAZINDA İLERLEME" tag="Cam + Panel" tagColor="green" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BLOKLAR.map(blok => (
              <Card key={blok.id} className="hover:border-accent/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className={`font-display text-3xl ${blok.sevk >= 90 ? 'text-accent' : blok.sevk >= 60 ? 'text-accent2' : 'text-muted'}`}>
                      {blok.label}
                    </div>
                    <div className="font-mono text-[9px] text-muted uppercase tracking-wide">{blok.sub}</div>
                  </div>
                  <Badge
                    label={blok.sevk >= 95 ? 'Tamamlandı' : blok.sevk >= 70 ? 'İyi' : 'Devam'}
                    color={blok.sevk >= 95 ? 'green' : blok.sevk >= 70 ? 'orange' : 'red'}
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between font-mono text-[9px] text-muted mb-1">
                      <span>SEVKİYAT</span>
                      <span>{blok.sevk}%</span>
                    </div>
                    <ProgressBar value={blok.sevk} showLabel={false} />
                  </div>
                  <div>
                    <div className="flex justify-between font-mono text-[9px] text-muted mb-1">
                      <span>MONTAJ</span>
                      <span>{blok.montaj}%</span>
                    </div>
                    <ProgressBar value={blok.montaj} showLabel={false} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Alt grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Açık Ödemeler */}
          <div>
            <SectionHeader title="AÇIK ÖDEMELER" tag="3 Kalem" tagColor="red" />
            <Card>
              <div className="space-y-4">
                {[
                  { no: 18, ad: 'Polikarbonat', firma: 'KARBOPLAST', kalan: '579.312 ₽', pct: 21 },
                  { no: 83, ad: 'Silikon / Membran / Bant', firma: 'GFLEX', kalan: '5.000.000 ₽', pct: 85 },
                  { no: 86, ad: 'RAL7021 Çelik Sac', firma: 'VANS KOLOR', kalan: '836.012 ₽', pct: 69 },
                ].map(o => (
                  <div key={o.no} className="flex items-center gap-3">
                    <div className="font-mono text-[10px] text-muted w-5">{o.no}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-xs font-medium text-text truncate">{o.ad}</div>
                      <div className="font-mono text-[9px] text-muted">{o.firma}</div>
                      <div className="mt-1">
                        <ProgressBar value={o.pct} showLabel={false} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-xs text-danger font-medium">{o.kalan}</div>
                      <div className="font-mono text-[9px] text-muted">kalan</div>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-border flex justify-between items-center">
                  <div className="font-mono text-[10px] text-muted uppercase tracking-wide">Toplam Açık</div>
                  <div className="font-display text-2xl text-danger">6.415.324 ₽</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Personel & Çizim */}
          <div className="space-y-4">
            {/* Personel */}
            <div>
              <SectionHeader title="PERSONEL" tag="Saha Ekibi" tagColor="blue" />
              <Card>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <div className="font-display text-5xl text-accent">
                      {data?.personel?.toplam ?? 116}
                    </div>
                    <div className="font-mono text-[9px] text-muted uppercase tracking-wide">Toplam</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge label={`Aktif: ${data?.personel?.aktif ?? 113}`} color="green" />
                    <Badge label={`İzin: ${data?.personel?.izinde ?? 1}`} color="orange" />
                    <Badge label={`Çıkış: ${data?.personel?.cikis ?? 20}`} color="gray" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {Object.entries(data?.personel?.roller ?? {
                    'İşçi': 93, 'Staff': 8, 'Ustabaşı': 7, 'Haritacı': 5, 'Formen': 2, 'Depo Gör.': 1
                  }).map(([rol, sayi]) => (
                    <div key={rol} className="bg-surface2 p-2 text-center">
                      <div className="font-display text-xl text-text">{sayi as number}</div>
                      <div className="font-mono text-[8px] text-muted uppercase">{rol}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Çizim */}
            <div>
              <SectionHeader title="ÇİZİM DURUMU" tag={`${data?.cizim?.toplam ?? 18} Çizim`} tagColor="orange" />
              <Card>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Onaylandı', val: data?.cizim?.onaylandi ?? 14, color: 'text-accent' },
                    { label: 'Bekliyor',  val: data?.cizim?.bekliyor  ?? 3,  color: 'text-accent2' },
                    { label: 'Revize',    val: data?.cizim?.revize    ?? 1,  color: 'text-accent2' },
                    { label: 'Toplam',    val: data?.cizim?.toplam    ?? 18, color: 'text-text' },
                  ].map(item => (
                    <div key={item.label} className="bg-surface2 p-3">
                      <div className={`font-display text-3xl ${item.color}`}>{item.val}</div>
                      <div className="font-mono text-[9px] text-muted uppercase tracking-wide">{item.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
