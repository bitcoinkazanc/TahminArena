# TahminArena

Telegram Mini App tabanlı sosyal futbol tahmin platformu.

## Proje

TahminArena; futbol maçlarını takip etmeyi, maçlar hakkında tahmin oluşturmayı, tahminleri sosyal olarak paylaşmayı ve kullanıcıların birbirleriyle etkileşim kurmasını sağlayan Telegram Mini App projesidir.

## Temel Özellikler

- Futbol maçları
- Canlı maç bilgileri
- Maç detayları
- Maç özel sohbeti
- Kullanıcı tahminleri
- Tahmin paylaşımı
- Tahmin beğenme
- Tahmin beğenmeme
- Yorumlar
- Çoklu maç kuponları
- Kupon paylaşımı
- Genel sohbet
- Kullanıcı profilleri
- Açık / gizli profil
- Takip sistemi
- Arkadaşlar
- Bildirimler
- Liderlik tablosu
- Kullanıcı engelleme
- Kullanıcı ve içerik raporlama
- Moderasyon

## Reklam Sistemi

Maç listelerinde reklam alanları bulunacaktır.

Örnek yerleşim:

3 maç
→ Reklam alanı
→ 3 maç
→ Reklam alanı
→ 3 maç
→ Reklam alanı

Reklam sistemi maç verilerinden bağımsız tasarlanacaktır.

## Teknolojiler

- Next.js
- React
- TypeScript
- Supabase
- PostgreSQL
- Vercel
- Telegram Mini Apps
- Mackolik maç verileri
- Cron-job.org

## Veri Akışı

Mackolik
→ Vercel API / Server
→ Supabase
→ TahminArena
→ Telegram Mini App

## Maç Verileri

Mackolik yalnızca futbol maç verileri için kullanılacaktır.

TahminArena içerisinde Mackolik'in bahis oranları veya İddaa oranları kullanılmayacaktır.

## Telegram

Uygulama Telegram Mini App olarak çalışacaktır.

Telegram kullanıcı kimliği backend tarafında doğrulanacaktır.

`initDataUnsafe` güvenilir kimlik kaynağı olarak kullanılmayacaktır.

Telegram `initData` backend tarafında doğrulanacaktır.

## Veritabanı

Supabase PostgreSQL kullanılacaktır.

Kullanılacak ana veri grupları:

- users
- matches
- predictions
- coupons
- chat_messages
- follows
- reactions
- comments
- notifications
- leaderboard
- blocks
- reports

## Güvenlik

Güvenlik uygulamanın başından itibaren mimariye dahil edilecektir.

Planlanan güvenlik özellikleri:

- Telegram initData doğrulaması
- Supabase Row Level Security
- Server-side yetkilendirme
- Kullanıcı izin kontrolü
- Rate limiting
- Input validation
- XSS koruması
- Özel profil verilerinin server-side korunması
- Secret key'lerin client tarafına gönderilmemesi
- Güvenli hata mesajları
- Raporlama ve engelleme sistemi

## Ortam Değişkenleri

Gizli anahtarlar GitHub'a gönderilmeyecektir.

Yerel geliştirme için `.env.local` kullanılacaktır.

Örnek değişkenler:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TELEGRAM_BOT_TOKEN=