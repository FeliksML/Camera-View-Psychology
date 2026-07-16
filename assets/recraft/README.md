# Recraft asset pack — generated 2026-07-12

Все ассеты сгенерированы в Recraft AI (аккаунт Feliks, проект **«CameraView Assets»**,
https://www.recraft.ai/project/0da7f299-8c9f-4725-a453-99064dffcf5b) по промпт-паку
[design/recraft-prompts.md](../../design/recraft-prompts.md).

- Иконки: **Recraft V4.1 Vector**, 1024×1024 (в Recraft хранятся как вектор — из проекта можно доэкспортировать SVG любой иконки; здесь PNG-рендеры + один готовый SVG).
- Иллюстрации: **Recraft V4.1**, размеры по назначению (1:1 / 4:5 / 1:2 / 9:16 / 3:2 / 5:4 / 4:3 / 2:1).
- Потрачено ≈ 284 кредита, остаток ≈ 478.
- `-1` / `-2` — два варианта одной генерации: выбирайте лучший, второй запасной.

## Структура

| Папка | Что внутри |
|---|---|
| `icons/emotions/` | 7 эмоций Setup: anxiety, anger (×4), sadness (svg+png), shame, fear, resentment, other |
| `icons/stages/` | 6 стадий Session: grounding, scene, stepback, askcopy, belief, comingback |
| `icons/tabs/` | 4 таба: home, journal, progress, settings |
| `icons/misc/` | streak (солнце-диафрагма), belief-marker (стрелка), film-frame (рамка-видоискатель 9:16) |
| `appicon/` | Концепты иконки приложения: A «фигура в кадре», B «кольца дыхания», C «дверной проём» ×2 |
| `splash/` | Заставка (safe-center композиция) |
| `illustrations/` | onboarding1/2/3, signin-bg, home-card, session-aura, session-particles, summary-path, journal-empty, threads-constellation, crisis, paywall |
| `glows/` | glow-peach, glow-sage — спрайты на чёрном фоне: класть через `mix-blend-mode: screen` / `background-blend-mode: screen` |
| `appstore/` | 3 маркетинговых фона (768×1536, для финала апскейлить до 1290×2796) |
| `_variants/` | Запасные варианты онбординга (дубли из-за повторных сабмитов) + 2 случайных квадратных рендера |
| `_rejected/` | Первая партия эмоций (Recraft V3, image-set) — стиль не тот (дудлы с текстом), не использовать |

## Что уже интегрировано в приложение (2026-07-12)

- **App icon** — мотив «диафрагмы»: центр `splash/splash-1.png` (пич-точка + кольца
  на тёмном) кропится в `scripts/make-icon.mjs` → `assets/icon-only.png` +
  `resources/icon.png`, а `npx @capacitor/assets generate --ios` прописал
  `ios/.../AppIcon.appiconset/AppIcon-512@2x.png`. Выбран за максимальный контраст
  на 40px и консистентность со splash. Флаг `ICON_FROM_APERTURE=false` в скрипте
  переключит на фигуру `concept-a` (старая синтетическая SVG-иконка — в истории git).
- **Splash** — `splash/splash-1.png` апскейлен до 2732² + серифный вордмарк
  «CameraView» → `assets/splash.png` / `splash-dark.png` → весь `Splash.imageset` в iOS.
- **Signin backdrop** — `illustrations/signin-bg-1.png` подключён как фон экрана
  входа (`src/screens/Signin.tsx`, Vite-импорт PNG, слой z-index:0 + затемняющий
  градиент снизу под кнопки). Экран был плоско-тёмным → чистый additive-слой.
- **Paywall backdrop** — тот же `signin-bg-1.png` за premium-эмблемой листа
  (`src/components/Paywall.tsx`, opacity .4) — диафрагма подложки усиливает кольца
  эмблемы, частицы добавляют глубину; текст/цены/CTA остаются читаемыми.

## Осознанно НЕ трогали (иначе регресс)

Экраны Onboarding / Crisis / Journal-empty / Home-card / Session / Threads уже несут
**собственную анимированную инлайн-SVG-графику** (дышащие кольца, фигурки-бутылочки,
радиальные свечения, дрейф частиц). Статичный PNG туда — понижение качества. Растровые
иллюстрации из пака остаются как альтернативная арт-библиотека / исходники для маркетинга.

## Что осталось сделать (опционально)

1. **SVG-экспорт иконок**: выбрать лучший вариант каждой иконки и в проекте Recraft
   экспортировать её как SVG (клик → Export → SVG). Тонкие линии эмоций/стадий/табов
   лучше жить как перекрашиваемый SVG, а не PNG с запечённым фоном `#171526`.
2. **App Store**: `appstore/*` (768×1536) апскейлить до 1290×2796 под скриншоты.
3. Логотипы Apple/Google для кнопок Sign-in — НЕ генерировать, только официальные ассеты.
