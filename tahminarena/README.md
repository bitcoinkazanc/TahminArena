TahminArena

Telegram Mini App tabanlı sosyal futbol tahmin platformu.

Proje

TahminArena; futbol maçlarını takip etmeyi, maçlar hakkında tahmin oluşturmayı, tahminleri sosyal olarak paylaşmayı ve kullanıcıların birbirleriyle etkileşim kurmasını sağlayan Telegram Mini App projesidir.

Temel Özellikler

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

Reklam Sistemi

Maç listelerinde reklam alanları bulunacaktır.

Örnek yerleşim:

3 maç
→ Reklam alanı
→ 3 maç
→ Reklam alanı
→ 3 maç
→ Reklam alanı

Reklam sistemi maç verilerinden bağımsız tasarlanacaktır.

Teknolojiler

- Next.js
- React
- TypeScript
- Supabase
- PostgreSQL
- Vercel
- Telegram Mini Apps
- Mackolik maç verileri
- Cron-job.org

Veri Akışı

Mackolik
→ Vercel API / Server
→ Supabase
→ TahminArena
→ Telegram Mini App

Maç Verileri

Mackolik yalnızca futbol maç verileri için kullanılacaktır.

TahminArena içerisinde Mackolik'in bahis oranları veya İddaa oranları kullanılmayacaktır.

Telegram

Uygulama Telegram Mini App olarak çalışacaktır.

Telegram kullanıcı kimliği backend tarafında doğrulanacaktır.

"initDataUnsafe" güvenilir kimlik kaynağı olarak kullanılmayacaktır.

Telegram "initData" backend tarafında doğrulanacaktır.

Veritabanı

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

Güvenlik

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

Ortam Değişkenleri

Gizli anahtarlar GitHub'a gönderilmeyecektir.

Yerel geliştirme için ".env.local" kullanılacaktır.

Örnek değişkenler:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TELEGRAM_BOT_TOKEN=

Gerçek secret değerleri GitHub repository'sine commit edilmemelidir.

Geliştirme

Projeyi kurmak için:

npm install

Geliştirme sunucusunu başlatmak için:

npm run dev

Production build kontrolü:

npm run build

Production sunucusu:

npm start

Deployment

Uygulama Vercel üzerinde yayınlanacaktır.

GitHub repository:

"tahminarena"

Deployment akışı:

GitHub
→ Vercel
→ Next.js uygulaması

Zamanlanmış İşlemler

Cron-job.org kullanılarak belirli işlemler periyodik olarak çalıştırılacaktır.

Planlanan görevler:

- Günlük maç verilerinin güncellenmesi
- Canlı maçların güncellenmesi
- Tamamlanan maçların güncellenmesi
- Tahmin sonuçlarının hesaplanması
- Kupon sonuçlarının hesaplanması

Proje Geliştirme Sırası

1. Temel proje kurulumu
2. Arayüz
3. Supabase veritabanı
4. Güvenlik
5. Telegram entegrasyonu
6. Maç sistemi
7. Kullanıcı ve profil sistemi
8. Tahmin sistemi
9. Sosyal tahmin sistemi
10. Kupon sistemi
11. Sohbet sistemi
12. Takip ve arkadaş sistemi
13. Bildirim sistemi
14. Liderlik sistemi
15. Moderasyon
16. Ayarlar
17. Güvenlik denetimi
18. Test
19. Production

Lisans ve Veri Kullanımı

Üçüncü taraf veri kaynaklarının kullanım koşulları production öncesinde kontrol edilecektir.

Mackolik verileri kullanılmadan önce ilgili güncel kullanım şartları ve erişim koşulları ayrıca değerlendirilecektir.