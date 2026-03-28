# MIMSA — Luzhniki Collection Proje Takip Sistemi

Next.js 14 tabanlı, Google Sheets bağlantılı proje yönetim dashboard'u.

## Özellikler

- 📊 **Dashboard** — Tüm verilerin özeti
- 🪟 **Cam Takip** — Sipariş ve sevkiyat durumu
- 🧩 **Panel Takip** — Modül sevkiyat takibi
- 💰 **Ödemeler** — Fatura ve ödeme takibi
- 👷 **Personel** — Saha ekibi durumu
- 📐 **Çizim Takip** — Onay ve revizyon durumu
- ⏱ 15 dakikada bir otomatik güncelleme
- 📱 Mobil uyumlu (responsive)
- 🌙 Koyu tema

---

## Kurulum

### 1. Google Cloud API Kurulumu

1. [Google Cloud Console](https://console.cloud.google.com) adresine git
2. Yeni proje oluştur: **"luzhniki-dashboard"**
3. **APIs & Services → Enable APIs** → **Google Sheets API** aktifleştir
4. **APIs & Services → Credentials → Create Credentials → Service Account**
   - Ad: `luzhniki-sheets`
   - Rol: **Viewer**
5. Service Account'a tıkla → **Keys → Add Key → JSON** → indir
6. JSON dosyasından şunları kopyala:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY`

### 2. Google Sheets Paylaşımı

Her tabloyu service account e-postası ile paylaş (**Görüntüleyici** yetkisiyle):
- Cam Takip tablosu
- Panel Takip tablosu
- Ödeme Listesi tablosu
- Personel Takip tablosu
- Çizim Takip tablosu

### 3. Vercel Kurulumu

1. [Vercel](https://vercel.com) hesabı aç
2. **New Project → Import Git Repository**
3. Bu klasörü GitHub'a yükle, Vercel'e bağla
4. **Settings → Environment Variables** bölümüne gir ve şunları ekle:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL = your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = -----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n
SHEET_CAM_ID = 1-7nQpmo2Enlpme_dyJfPn83RLGTIQLAd0f7KK0cLtl4
SHEET_PANEL_ID = 1fHAM1MsoI-P5lKgNDQsNRvKUh6jgpSwPnqmwPyNTYzk
SHEET_ODEME_ID = 1YxerYlb2DvT2JPNFWsGohcj2beLhgF6HiqxDnPu475w
SHEET_PERSONEL_ID = 1omxdvGbXKJ3Purh9iz4zh3FlwjU49ts4XrUVbcst_ew
SHEET_CIZIM_ID = CIZIM_TABLOSUNUN_ID_SI
CACHE_TTL = 900
```

5. **Deploy** — sistem canlıya geçer!

---

## Yerel Geliştirme

```bash
npm install
cp .env.local.example .env.local
# .env.local dosyasını doldur
npm run dev
```

---

## Tablolar Hakkında

Her tablonun ilgili sayfasından veri çekilir:

| Sistem | Google Sheet | Sayfa |
|--------|-------------|-------|
| Cam | SHEET_CAM_ID | CAM TAKIP TABLOSU |
| Panel | SHEET_PANEL_ID | Sevkiyat Listesi |
| Ödeme | SHEET_ODEME_ID | Odeme Listesi |
| Personel | SHEET_PERSONEL_ID | PERSONEL LISTESI |
| Çizim | SHEET_CIZIM_ID | Çizim Takip |

---

## Yapım: MIMSA Alüminyum × Claude (Anthropic)
