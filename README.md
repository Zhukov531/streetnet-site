# StreetNet — промо-сайт

Лендинг + страница политики конфиденциальности для приложения StreetNet.
Статический сайт (HTML/CSS, без сборки и зависимостей), хостится на GitHub Pages.

## Живые адреса

- Лендинг: https://zhukov531.github.io/streetnet-site/
- Политика: https://zhukov531.github.io/streetnet-site/privacy.html

Эти URL используются в App Store Connect (TestFlight → «Информация о тестировании»:
маркетинговый URL и privacy policy URL; privacy обязателен для релиза в App Store).

## Файлы

| Файл | Назначение |
|------|------------|
| `index.html`   | лендинг (hero + showcase + фичи + split-секции + privacy + CTA) |
| `privacy.html` | политика конфиденциальности (под реальные доступы приложения) |
| `style.css`    | все стили обеих страниц |
| `.nojekyll`    | отключает Jekyll-обработку на GitHub Pages |

## Дизайн

Тёмная премиум-эстетика по референсу **huly.io**: глубокий navy-фон
(`--bg: #07090f`), мягкие aurora-glow, много воздуха, rounded-карточки,
sentence-case типографика. Никаких граффити/uppercase.

- Шрифт: **Inter** (300–800), полная кириллица — UI на русском.
- Акценты: синий `--blue #4d9fff` + оранжевый `--orange #ff7a1a` +
  фиолетовый `--violet #8b6cff` (совпадает с Theme.Color приложения:
  neonBlue / neonOrange / neonViolet).
- Hero-визуал и split-панели — это **CSS-моки** (плавающие UI-карточки
  таймера/G/рекордов, мок-карта трассы на SVG, график перегрузок,
  список заездов). Реальных скриншотов приложения пока нет; при появлении
  заменить моки на `<img>`.
- Тон копирайта — спокойно-уверенный, без пафоса.

## Как обновить сайт

```bash
cd ~/Desktop/StreetNet/landing
# правим index.html / privacy.html / style.css
git add -A
git commit -m "..."
git push origin main
# GitHub Pages пересобирается сам за ~1 минуту
```

Проверка адаптива локально (headless Chrome, без открытия окна):

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=390,3200 --screenshot=/tmp/sn_mobile.png \
  --virtual-time-budget=5000 file://$PWD/index.html
```

Брейкпоинты: `880px` (сетка фич 2 кол., split в 1 кол.) и
`620px` (всё в 1 колонку, hero-заголовок 24px, showcase перекомпонован).

## Репозиторий и хостинг

- Репо: `github.com/Zhukov531/streetnet-site` (public), ветка `main`, корень.
- GitHub Pages включён из `main` / `/`.
- `gh` CLI залогинен как `Zhukov531`.

## TODO

- Купить домен (`streetnet.app` / `.ru`) → положить `CNAME` файл в репо
  + настроить DNS. Privacy/marketing URL переедут автоматически.
- Заменить CSS-моки на реальные скриншоты приложения, когда будут.
- При выкладке в App Store — privacy URL уже готов, вписать в карточку.
