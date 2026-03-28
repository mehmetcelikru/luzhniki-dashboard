export interface CamParti {
  no: number
  partiNo: string
  faturaNo: string
  faturaDurumu: string
  blok: string
  aciklama: string
  siparisMetraj: number
  gelenMetraj: number
  kalanMetraj: number
  gelenYuzde: number
  sevkTarihi: string
}

export interface PanelModul {
  no: number
  modulKodu: string
  imalatTuru: 'Düz Modül' | 'Köse Modül'
  gelenAdet: number
  tarih: string
  notlar: string
}

export interface PanelOzet {
  blok: string
  duzGelen: number
  duzKalan: number
  koseGelen: number
  koseKalan: number
  duzToplamUretilen: number
  koseToplamUretilen: number
}

export interface OdemeFatura {
  no: number
  blok: string
  aciklama: string
  kategori: string
  firma: string
  durum: string
  durumYuzde: number
  faturaTutari: number
  odenenTutar: number
  kalanTutar: number
  faturaTarihi: string
  odemeTarihi: string
  malzemeDurumu: string
  not: string
}

export interface PersonelKisi {
  id: string
  ad: string
  rol: string
  durum: 'Aktif' | 'İzinde' | 'Çıkış'
  giris?: string
  cikis?: string
}

export interface PersonelOzet {
  toplam: number
  aktif: number
  izinde: number
  cikis: number
  gelmeyenBugun: number
  roller: Record<string, number>
  izindekiler: { ad: string; sicil: string }[]
}

export interface CizimKayit {
  no: number
  blok: string
  cizimAdi: string
  cizimNo: string
  revizyon: string
  kategori: string
  sorumlu: string
  gonderimTarihi: string
  geriDonusTarihi: string
  onayTarihi: string
  onayDurumu: 'Onaylandı' | 'Bekliyor' | 'Revize Gerekli' | 'Reddedildi' | 'İptal'
  aciklama: string
  dosyaKodu: string
  enkaOnayNo: string
}

export interface DashboardData {
  cam: {
    toplamParti: number
    acikParti: number
    toplamMetraj: number
    kalanMetraj: number
  }
  panel: {
    toplamGelen: number
    toplamKalan: number
    duzGelen: number
    koseGelen: number
  }
  odeme: {
    acikFatura: number
    toplamKalan: number
    toplamFatura: number
  }
  personel: PersonelOzet
  cizim: {
    toplam: number
    onaylandi: number
    bekliyor: number
    revize: number
  }
  sonGuncelleme: string
}
