# StreetNet — промо-сайт

Лендинг + страница политики конфиденциальности для приложения StreetNet.
Статический сайт (HTML/CSS, без сборки и зависимостей), хостится на GitHub Pages.

## Живые адреса

- Лендинг: **https://streetnet.ru** (кастомный домен на reg.ru, HTTPS enforced)
- Политика: **https://streetnet.ru/privacy.html**
- Резервно: https://zhukov531.github.io/streetnet-site/

Эти URL используются в App Store Connect (TestFlight → «Информация о тестировании»:
маркетинговый URL и privacy policy URL; privacy обязателен для релиза в App Store).

## Файлы

| Файл | Назначение |
|------|------------|
| `index.html`   | лендинг (hero + продуктовый мокап + фичи + секции + CTA) |
| `privacy.html` | политика конфиденциальности (под реальные доступы приложения) |
| `style.css`    | токены, база, nav, hero, кнопки, footer |
| `sections.css` | стили секций (фичи, мокапы, телеметрия) |
| `app.js`       | интерактив: sticky nav, scroll-reveal, live-таймер, G-meter, parallax, count-up |
| `favicon.svg`  | фавикон |
| `CNAME`        | кастомный домен `streetnet.ru` (НЕ удалять при правках) |
| `.nojekyll`    | отключает Jekyll-обработку на GitHub Pages |

## Дизайн

Премиум тёмный (дизайн от Claude design, заменён 2026-06-02). Navy-фон
`--bg: #07090f`, aurora-blobs, продуктовый мокап телефона с живым HUD
(таймер / мини-карта / G-метр), count-up счётчики, анимации появления.

- Шрифты: **Russo One** (дисплей) + **Inter** (текст) + **JetBrains Mono**
  (телеметрия/цифры) — подключены с `subset=cyrillic` (UI на русском).
- Акценты: синий `--blue #4d9fff` + оранжевый `--orange #ff7a1a` +
  фиолетовый `--violet #8b6cff` (= Theme.Color приложения).
- Визуалы — CSS/SVG-мокапы (реальных скриншотов пока нет; при появлении
  заменить на `<img>`).

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

- [x] Домен `streetnet.ru` подключён (CNAME в репо + DNS в reg.ru + HTTPS enforced).
- [ ] Заменить CSS-моки на реальные скриншоты приложения, когда будут.
- [ ] Вписать privacy URL в App Store Connect (TestFlight → Информация о тестировании).
