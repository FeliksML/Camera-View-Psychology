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

## Что осталось сделать

1. **SVG-экспорт иконок**: выбрать лучший вариант каждой иконки и в проекте Recraft
   экспортировать её как SVG (клик по картинке → Export → SVG). PNG 1024px тоже ок для 20–56px UI.
2. **Иконки эмоций/стадий фоном #171526**: фон запечён в PNG — при использовании поверх
   тёмных карточек он сливается с UI; для «прозрачности» удалить фоновый rect из SVG.
3. App icon: выбрать концепт (C — самый сильный), прогнать через `scripts/make-icon.mjs`.
4. Splash 2732×2732: апскейл из `splash/splash-*.png` (в Recraft есть Upscale).
5. Логотипы Apple/Google для кнопок Sign-in — НЕ генерировать, только официальные ассеты.
