# huseyinhakiefendi.com

Giritli Hüseyin Haki Efendi — Şirket-i Hayriye'nin vizyoner müdürü (1866-1894) ve dünyanın ilk arabalı vapuru Suhulet'in mucidine adanmış dijital biyografi sitesi.

## Teknoloji

- Static HTML/CSS/JS (framework'süz, maksimum performans)
- Google Fonts (Playfair Display, Source Serif 4, Cinzel, Inter)
- CSS Custom Properties + IntersectionObserver animasyonları
- Vercel deploy + CDN

## Geliştirme

```bash
# Yerel sunucu (VS Code Live Server veya herhangi bir static server)
npx serve .

# Vercel deploy
vercel --prod
```

## Yapı

```
huseyinhakiefendi/
├── index.html          # Ana sayfa (tüm bölümler)
├── css/style.css       # Stiller
├── js/main.js          # Animasyonlar + etkileşim
├── assets/             # Görseller, SVG, fontlar
├── vercel.json         # Deploy konfigürasyonu
├── robots.txt          # SEO
├── sitemap.xml         # SEO
└── 404.html            # Özel hata sayfası
```

## İlişkili Proje

- [sirket-ihayriye.com](https://github.com/narworks/sirket-i-hayriye) — Şirket-i Hayriye ana sitesi
