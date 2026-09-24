# Soccer Cards War

React ve Vite ile hazırlanmış futbol kart oyununun tek kaynaklı proje paketi.

## Başlatma

Node.js 22 veya üzeri sürümü kurduktan sonra bu klasörde terminal açın:

```bash
npm ci
npm run dev
```

Terminalde gösterilen yerel adresi tarayıcıda açın. Yayına uygun dosyaları oluşturmak için `npm run build` çalıştırın; çıktı `dist/` klasörüne yazılır.

## GitHub Pages

`.github/workflows/deploy.yml`, `main` dalına gönderilen projeyi derleyip GitHub Pages'e yayımlar. Depo adı `soccer-cards-war` olmalıdır; başka bir depo adı kullanırsanız `vite.config.js` içindeki `base` ve `public/sw.js` içindeki `BASE_PATH` değerlerini aynı yeni ada göre değiştirin. Depo ayarlarında **Settings → Pages → Build and deployment → Source: GitHub Actions** seçin.

## Bu pakette

- Kariyer, etkinlik, 11. Ultimate aşaması, kadro, antrenman, transfer ve koleksiyon.
- Milli Takım modunda aynı ülkeden 10 uydurma oyuncuyla beş turluk kart savaşları ve seri ödülleri.
- Kariyer tamamlandığında etkinlik maçlarını finale kadar otomatik oynatma.
- Tarayıcıda yerel kayıt (v6), telefona kurulum için PWA dosyaları ve ses ayarları.

Oyun kayıtları kullanılan tarayıcı ve adreste saklanır. Adres değiştirildiğinde eski kayıt otomatik taşınmaz. Mağazadaki `SAMSUN` kodu bu sürümde açık bir deneme kodudur; gerçek ödeme doğrulaması değildir.

`npm run build` başarılıdır. `npm run lint` mevcut kaynakta daha önceden bulunan stil ve React kuralı ihlallerini raporlar; bunlar ayrıca ele alınmalıdır.
