# CameraView — промпт-пак для Recraft AI

Полный набор промптов для генерации ВСЕХ визуальных ассетов iOS-приложения **CameraView** в [recraft.ai](https://recraft.ai).

Заголовки, заметки и инструкции — по-русски. Сами промпты — **на английском** (Recraft лучше всего понимает английский). Каждый промпт — отдельный блок кода: нажимаете «копировать» и вставляете в Recraft как есть.

> Визуальный язык взят напрямую из кода приложения (`src/store/logic.core.js`, `src/screens/*`, `src/index.css`). Палитра, эмоции и «тепловая шкала» — точные hex из продакшена.

---

## 1 · Как пользоваться

### Какой стиль Recraft выбирать
| Тип ассета | Стиль Recraft | Почему |
|---|---|---|
| Иконки (эмоции, стадии, tab bar, стрик) | **Vector Art → Icon** (или Vector Illustration) | Прозрачный фон, чистые линии, экспорт в **SVG**, легко перекрашивать под hex |
| App icon, splash | **Digital Illustration** (с последующей ручной чисткой) | Нужен богатый градиент и свечение; экспорт PNG высокого разрешения |
| Онбординг, Summary, Journal, Crisis, Progress-иллюстрации | **Digital Illustration** | Атмосферные сцены с blur-свечением и зерном |
| Ambient-фоны, glow-спрайты, текстуры кнопок | **Digital Illustration** (или Image) | Мягкие радиальные блики, без жёстких краёв |
| App Store подложки | **Digital Illustration**, размер 1290×2796 | Фон под скриншоты, без текста |

### Как держать консистентность (важно!)
1. **Один стиль на всю партию.** Сгенерируйте сначала *app icon концепт B* или *первую иконку эмоции*. Как только результат нравится — нажмите **«Use as style»** / **«Style reference»** и генерируйте всё остальное с этой ссылкой. Так линии, свечение и «плотность» будут едиными.
2. **Фиксируйте seed.** Внутри одной серии (например, 7 иконок эмоций или 6 стадий) держите один и тот же **style** и, если Recraft позволяет, один **seed** — меняйте только предметное описание.
3. **Задайте палитру прямо в Recraft.** В панели стиля есть выбор цветов — вставьте туда набор ниже, чтобы модель не уходила в чужие оттенки.
4. **Проверяйте на тёмном.** Ассеты живут на фоне `#171526`. После генерации всегда смотрите превью на этом фоне (см. чек-лист).
5. **Иконки — только прозрачный фон + SVG.** Иллюстрации — PNG.

### Палитра для копипаста в Recraft (hex-набор)
```
#0D0C16  #100E1B  #131120  #171526  #1E1C33
#262440  #2A2748  #302C52  #3A3752  #4E4A6E
#ECEAF7  #A5A1C2  #6B678C
#E8A188  #8FBFAF  #D9A96B
```
Фоны (тёмные) · поверхности карточек · границы · текст (яркий/приглушённый/тусклый) · пич-акцент · шалфейно-зелёный (спокойствие/успех) · янтарный.

**Цвета эмоций** (по одной на эмоцию):
```
Anxiety #E8A188   Anger #D9A96B   Sadness #8E9BB8   Shame #B48FB8
Fear #7E96A8   Resentment #C98F9A   Other #A5A1C2
```

**Тепловая шкала** (distress → calm), для градиентов «путь/дыхание/аура»:
```
#E26454 → #E48769 → #D9A96B → #C9A38C → #A0B698 → #8FBFAF
```

### Размеры и формат — коротко
- Иконки приложения-навигации / эмоций / стадий: генерировать 1024×1024, экспорт **SVG** (или PNG с прозрачностью), в макете использовать 20–56px.
- App icon: **1024×1024 PNG**, без прозрачности, без скруглений (iOS сам скруглит).
- Splash: **2732×2732 PNG**, важное — в центральном круге ⌀1200px.
- App Store скриншот-фоны: **1290×2796 PNG**.

---

## 2 · Глобальный стиль-блок (copy-paste префикс)

Начинайте **каждый** промпт с одного из двух префиксов ниже — он фиксирует палитру, настроение и технику. Дальше идёт предметная часть промпта.

### 2A · Префикс для ИКОНОК (flat vector, тонкая линия, прозрачный фон)
```
Flat minimal vector icon, single-weight 1.5px thin line work, clean geometric construction, calm warm nighttime mood, muted indigo-night palette: deep indigo #171526, soft lavender-grey lines #A5A1C2, bright off-white #ECEAF7, warm peach accent #E8A188, sage-green accent #8FBFAF. Perfectly centered, generous negative space, one light source, transparent background, SVG-ready. No text, no watermark, no drop shadows, no 3D bevel, no bright white background, no photorealism.
```

### 2B · Префикс для ИЛЛЮСТРАЦИЙ и ФОНОВ (soft glow, grain, deep indigo night)
```
Soft atmospheric digital illustration, deep indigo night atmosphere fading from #100E1B to #1E1C33, warm peach #E8A188 and sage-green #8FBFAF glow accents, gentle radial light blooms, faint drifting particle dots, subtle fine film grain, thin 1px linework where lines appear, quiet warm safe meditative mood, painterly soft edges, elegant negative space. No text, no watermark, no logos, no harsh contrast, no bright white background, no clinical or stock-photo look, no neon, no lens flare cliché.
```

**Повторяющиеся мотивы приложения** (упоминайте их дословно, чтобы держать бренд):
- *bottle-shaped minimal human silhouette* — округлая фигурка: маленькая голова на скруглённом «бутылочном» теле, без черт лица;
- *concentric breathing rings* — тонкие концентрические кольца дыхания;
- *soft blurred aura blob* — размытое цветное пятно-аура за фигурой;
- *film frame / camera dolly / "TAKE 01"* — кинометафора: рамка кадра, отъезд камеры;
- *aperture lens* — диафрагма: концентрические окружности с точкой-акцентом в центре;
- *constellation threads* — созвездие: точки-сессии, соединённые тонкими нитями.

---

## 3 · Промпты по ассетам

---

### 3.1 · App icon — концепт A: «Фигура в рамке кадра»
**Экран/назначение:** иконка приложения (главный кандидат — читается на маленьком размере).
**Размер/формат:** 1024×1024, PNG (без прозрачности, без скруглений — iOS маскирует сам).
**Стиль Recraft:** Digital Illustration.
```
Soft atmospheric digital illustration, deep indigo night background fading from #131120 center to #100E1B edges. Centered: a single minimal bottle-shaped human silhouette (small rounded head on a smooth rounded body, no facial features) filled #131120 with a thin 1px #ECEAF7 outline, standing calmly. Around the figure, a thin peach #E8A188 rounded-rectangle camera frame with tiny corner ticks, like a viewfinder. A soft warm peach #E8A188 radial glow blooms behind the figure from below, plus one faint sage-green #8FBFAF particle dot. Balanced, iconic, symmetrical, lots of breathing room. App icon composition, no rounded-corner mask, no text, no watermark, no bright white background.
```

### 3.2 · App icon — концепт B: «Кольцо дыхания + аура»
**Стиль:** Digital Illustration.
```
Soft atmospheric digital illustration, deep indigo night background fading from #171526 center to #100E1B edges. Centered composition: three thin concentric breathing rings in #ECEAF7 at low opacity, and inside them a small blurred aura blob transitioning from warm peach #E8A188 to sage-green #8FBFAF (calm). At the exact center, one crisp warm peach #E8A188 dot like a camera aperture point. Faint drifting particle dots around. Meditative, symmetrical, glowing on dark. App icon composition, no text, no watermark, no bright white background, no rounded-corner mask.
```

### 3.3 · App icon — концепт C: «Дверной проём кадра со светом»
**Стиль:** Digital Illustration.
```
Soft atmospheric digital illustration, deep indigo night background #100E1B. Centered: a single tall film-frame doorway — a thin peach #E8A188 rectangular outline standing like an open door, warm sage-and-peach light spilling softly through the opening from behind, a gentle glow gradient along the heat ramp #E8A188 to #8FBFAF. A tiny minimal bottle-shaped human silhouette stands small at the threshold, calm, facing the light. Cinematic, quiet, hopeful. App icon composition, symmetrical, no text, no watermark, no bright white background, no rounded-corner mask.
```

---

### 3.4 · Splash screen (заставка запуска)
**Экран:** экран загрузки приложения.
**Размер/формат:** 2732×2732 PNG, важное держать в центральном круге ⌀1200px (safe-center).
**Стиль:** Digital Illustration.
```
Soft atmospheric splash illustration, seamless deep indigo night background fading radially from #171526 at the very center to #0D0C16 at the edges. In the exact center, one crisp warm peach #E8A188 aperture dot surrounded by two thin concentric #ECEAF7 breathing rings at low opacity, and a soft peach glow bloom behind them. A few faint drifting particle dots scattered wide. Nothing important in the outer 25% — keep the edges near-empty dark for safe cropping. Extremely calm, minimal, centered, glowing on dark. No text, no logo, no watermark, no bright white background, no harsh vignette line.
```

---

### 3.5 · Онбординг ×3 (под реальные тексты слайдов)
**Экран:** Onboarding, верхние 55% каждого слайда (иллюстрация над заголовком Lora).
**Размер/формат:** 1200×1400 PNG, прозрачный или с тёмным фоном `#100E1B` (в приложении иллюстрация уходит в затемнение по краям — оставляйте края тёмными).
**Стиль:** Digital Illustration. **Держите один style-reference на все три — они идут подряд.**

**Слайд 1 — "See yourself from the outside"**
```
Soft atmospheric digital illustration, deep indigo night scene #100E1B. Foreground: layered rounded hill silhouettes in indigo gradients (#232040, #2A2748, #302C52) like a calm nighttime horizon. On the central hill stands one small minimal bottle-shaped human silhouette (rounded head and body, no face) filled #131120 with a thin #ECEAF7 outline. Above and around it, three thin concentric breathing rings in soft #ECEAF7 expand outward like a gentle camera focus. A few drifting particle dots in peach #E8A188 and sage #8FBFAF float in the dark sky. Quiet, observational, kind. Keep the top and side edges dark for a soft inner shadow crop. No text, no watermark, no bright white background.
```

**Слайд 2 — "Watch, don't drown"**
```
Soft atmospheric digital illustration, deep indigo night scene #100E1B. Composition: one small minimal bottle-shaped human silhouette (rounded, no face, thin #ECEAF7 outline) stands calmly on the upper-center, inside a soft #ECEAF7 focus ring and a faint radial glow — the calm observer. In the lower-left foreground, a second, much larger and darker copy of the same silhouette (#100E1B, very faint outline) leans in, cropped by the frame edge — the distressed self being watched from a safe distance. One warm peach #E8A188 particle drifts between them. Emotional distance, safety, gentle. Keep edges dark for inner-shadow crop. No text, no watermark, no bright white background.
```

**Слайд 3 — "Leave with a better belief"**
```
Soft atmospheric digital illustration, deep indigo night scene #100E1B. Center-top: a dashed thin lavender-grey #A5A1C2 open oval outline like a soft cloud of old thoughts, and gently descending from it a glowing warm peach #E8A188 orb — a new belief taking form, wrapped in a soft peach radial glow. Below, a small minimal bottle-shaped human silhouette (rounded, no face, thin #ECEAF7 outline) stands on a faint sage-green #8FBFAF glow pool, calm and grounded. A few drifting particle dots. Resolution, warmth, a fresh start. Keep edges dark for inner-shadow crop. No text, no watermark, no bright white background.
```

---

### 3.6 · Sign-in фон (атмосферный)
**Экран:** Signin — фон за логотипом-диафрагмой и кнопками входа.
**Размер/формат:** 1200×2600 PNG, тёмный фон.
**Стиль:** Digital Illustration.

> ⚠️ **ВАЖНО про логотипы Apple / Google:** НЕ генерируйте в Recraft логотипы Apple или Google (кнопки «Continue with Apple/Google»). Это чужие товарные знаки — их нельзя рисовать нейросетью. Используйте **только официальные брендовые ассеты** по гайдлайнам: [Apple — Sign in with Apple](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple) и [Google — Branding Guidelines](https://developers.google.com/identity/branding-guidelines). Recraft-фон должен быть **чистым, без каких-либо логотипов и иконок брендов.**

```
Soft atmospheric vertical background illustration, deep indigo night gradient from #131120 at the top to #100E1B at the bottom. Upper-center: a faint aperture motif — two thin concentric lavender-grey #3A3752 rings with a tiny warm peach #E8A188 point at their center, surrounded by a very soft glow. Sparse drifting particle dots (#ECEAF7 low opacity, one peach) across the upper third. The lower two-thirds is calm near-empty dark space for buttons to sit on. Extremely quiet, private, welcoming. No text, no logos, no brand icons, no watermark, no bright white background.
```

---

### 3.7 · Home — фоновая текстура-градиент карточки сессии
**Экран:** Home, большая карточка «Today's session» (308px высотой, скруглённая 24px).
**Размер/формат:** 1080×1080 PNG.
**Стиль:** Digital Illustration.
```
Soft atmospheric card-fill illustration, diagonal indigo-to-warm gradient from #232045 top-left through #2A2550 and #4A3550 to a muted warm mauve #7A5350 at the bottom. From the bottom-center, a warm peach #E8A188 radial glow blooms upward and fades out. Three faint thin #ECEAF7 concentric circle outlines (very low opacity) rise from below the bottom edge, only their upper arcs visible. Smooth, calm, premium, no hard edges. Seamless fill for a rounded card. No text, no watermark, no figures, no bright white background.
```

**3.7b · Иконка стрика (Streak)** — маленькая иконка «солнце/диафрагма» в карточке.
**Размер/формат:** 512×512, SVG, прозрачный фон. **Стиль:** Vector Icon.
```
Flat minimal vector icon, single-weight 1.1px thin line, warm peach #E8A188. A simple sun-aperture mark: one thin circle in the center with four short radiating tick-lines at top, right, bottom, left (like sun rays or lens marks). Perfectly centered, small, calm. Transparent background, SVG-ready. No text, no fill, no shadow, no bright white background.
```

**3.7c · Декор карточек убеждений («Your new beliefs»)** — крошечный маркер-стрелка «старое → новое».
**Размер/формат:** 256×256, SVG, прозрачный. **Стиль:** Vector Icon.
```
Flat minimal vector icon, single-weight 1.3px thin line, sage-green #8FBFAF. A small downward transformation arrow: a short vertical line ending in a gentle chevron pointing down, symbolizing an old belief settling into a new one. Perfectly centered, tiny, clean. Transparent background, SVG-ready. No text, no fill, no shadow, no bright white background.
```

---

### 3.8 · Setup — сет из 7 иконок эмоций
**Экран:** Setup, выбор эмоции (сетка кнопок).
**Размер/формат:** 512×512 каждая, SVG, прозрачный фон.
**Стиль:** Vector Icon. **Держите ОДИН style-reference и seed на все 7 — меняется только форма и hex-цвет.**

**Промпт-шаблон** (подставьте `{{EMOTION}}` и `{{HEX}}` из таблицы ниже):
```
Flat minimal vector icon, single-weight 1.5px thin line work on transparent background, one soft glowing accent color {{HEX}}. Subject: an abstract emotional glyph representing "{{EMOTION}}" — {{MOTIF}}. Enclosed loosely inside a thin soft-rounded container, calm and non-literal, no facial expressions. Muted indigo-night mood, one light source, perfectly centered, generous negative space, SVG-ready. No text, no watermark, no drop shadow, no bright white background, no photorealism.
```

**Таблица подстановок:**
| Эмоция | `{{EMOTION}}` | `{{HEX}}` | `{{MOTIF}}` (вставить вместо мотива) |
|---|---|---|---|
| Тревога | Anxiety | `#E8A188` | a tight cluster of thin nervous concentric ripples vibrating outward |
| Гнев | Anger | `#D9A96B` | a single sharp upward flame-like line with a taut angular kink |
| Печаль | Sadness | `#8E9BB8` | a slow downward teardrop curve with one falling dot below it |
| Стыд | Shame | `#B48FB8` | a small figure-loop curling inward on itself, folding away |
| Страх | Fear | `#7E96A8` | a wide alert eye-shaped oval with a small tense dot at its center |
| Обида | Resentment | `#C98F9A` | two thin lines turning away from each other with a small knot between |
| Другое | Other | `#A5A1C2` | three small soft dots in a gentle open arc, neutral and open |

> Совет: сгенерируйте сначала **Anxiety** (пич — базовый цвет бренда), утвердите линию, затем прогоните остальные 6 с той же style-reference.

---

### 3.9 · Session — 6 иконок стадий
**Экран:** Session, индикатор прогресса и заголовки стадий (`GROUNDING · THE SCENE · STEP BACK · ASK YOUR COPY · THE BELIEF · COMING BACK`).
**Размер/формат:** 512×512 каждая, SVG, прозрачный.
**Стиль:** Vector Icon. **Единый style-reference и seed на все 6.** Линия — `#A5A1C2`, акцент — `#E8A188` (пич) или `#8FBFAF` (шалфей) как указано.

**Стадия 1 — GROUNDING (кольцо дыхания)**
```
Flat minimal vector icon, single-weight 1.5px thin line, lavender-grey #A5A1C2 with a soft sage-green #8FBFAF center. Three concentric breathing rings expanding outward, with a small solid calm dot at the exact center. Symbol of grounding and slow breath. Perfectly centered, transparent background, SVG-ready. No text, no watermark, no shadow, no bright white background.
```

**Стадия 2 — THE SCENE (дверной проём света)**
```
Flat minimal vector icon, single-weight 1.5px thin line, lavender-grey #A5A1C2 with a warm peach #E8A188 glow accent. A tall open doorway / film frame rectangle, thin lines, with a soft peach light gradient spilling through the opening. Symbol of stepping into the scene. Perfectly centered, transparent background, SVG-ready. No text, no watermark, no shadow, no bright white background.
```

**Стадия 3 — STEP BACK (отъезд камеры / film dolly)**
```
Flat minimal vector icon, single-weight 1.5px thin line, lavender-grey #A5A1C2 with a warm peach #E8A188 accent. Three nested rectangular film frames of decreasing size, one inside another, with two tiny motion ticks suggesting a camera dollying backward. A small "TAKE" corner tick mark in peach. Symbol of pulling back to watch from a distance. Perfectly centered, transparent background, SVG-ready. No text words, no watermark, no shadow, no bright white background.
```

**Стадия 4 — ASK YOUR COPY (две обращённые фигуры / зеркало)**
```
Flat minimal vector icon, single-weight 1.5px thin line, lavender-grey #A5A1C2 with a warm peach #E8A188 accent. Two identical minimal bottle-shaped human silhouettes (rounded, no faces) facing each other across a thin vertical mirror line, one slightly glowing peach. Symbol of a gentle dialogue with your own self. Perfectly centered, symmetrical, transparent background, SVG-ready. No text, no watermark, no shadow, no bright white background.
```

**Стадия 5 — THE BELIEF (гравированный камень / эмблема)**
```
Flat minimal vector icon, single-weight 1.5px thin line, lavender-grey #A5A1C2 with a sage-green #8FBFAF accent. A small rounded engraved stone or medallion emblem with a single soft sage-green line-mark carved at its center, like a held truth. Calm, solid, reassuring. Perfectly centered, transparent background, SVG-ready. No text, no watermark, no shadow, no bright white background.
```

**Стадия 6 — COMING BACK (кадры, отъезжающие наружу)**
```
Flat minimal vector icon, single-weight 1.5px thin line, lavender-grey #A5A1C2 with a warm peach #E8A188 accent. Nested rectangular frames zooming outward with small directional ticks pointing away from center, and a tiny calm dot returning to the middle. Symbol of gently returning to the present. Perfectly centered, transparent background, SVG-ready. No text, no watermark, no shadow, no bright white background.
```

---

### 3.10 · Session — ambient-фоны сессии
**Экран:** Session, фоновые слои за диалогом (аура, частицы, рамка кадра).
**Размер/формат:** 1080×1920 PNG.
**Стиль:** Digital Illustration.

**3.10a · Aura blob (peach → sage), охлаждающаяся аура**
```
Soft atmospheric background, deep indigo night #131120, mostly empty. In the upper-center, one large soft blurred aura blob with a heavy gaussian blur, its color transitioning along the heat ramp from warm peach #E8A188 on one side to sage-green #8FBFAF on the other, at gentle opacity — like calming emotional heat. Nothing else but faint darkness around. Extremely soft, no edges, meditative. Seamless. No text, no figures, no watermark, no bright white background.
```

**3.10b · Particle drift (дрейф частиц)**
```
Soft atmospheric background, deep indigo night #131120. Scattered faint drifting particle dots of varying tiny sizes, most in low-opacity off-white #ECEAF7, a few in peach #E8A188 and sage #8FBFAF, softly blurred, floating gently across a mostly-dark field. Sparse, calm, dreamy, seamless. No text, no watermark, no bright white background, no dense starfield — keep it airy.
```

**3.10c · Film-frame border texture (рамка кадра)**
```
Thin film-frame border texture on transparent background, single-weight 1px lavender-grey #A5A1C2 line at very low opacity forming a large rounded-rectangle viewfinder frame with tiny corner brackets and small side tick marks, like a cinematic overlay. Empty transparent center. Subtle, elegant, SVG-ready. No text, no watermark, no fill, no bright white background.
```

---

### 3.11 · Summary — иллюстрация «путь пройден»
**Экран:** Summary, блок «The path this session took» (линия пути со светящимися узлами).
**Размер/формат:** 1080×720 PNG, тёмный фон `#171526`.
**Стиль:** Digital Illustration.
```
Soft atmospheric illustration, deep indigo night background #171526. A single flowing thin 1.6px path line that wanders gently from lower-left to upper-right, its stroke color transitioning along the heat ramp #E26454 → #E48769 → #D9A96B → #C9A38C → #A0B698 → #8FBFAF — from distress-warm to calm-sage. Along the path sit a few small glowing nodes: a peach #E8A188 starting dot with a soft glow, one thin outlined ring dot in the middle, and a sage-green #8FBFAF ending dot with a bright glow marking the shift. A few faint particle dots in the dark background. Quiet, hopeful, a journey completed. No text, no watermark, no bright white background.
```

---

### 3.12 · Journal — empty-state иллюстрация
**Экран:** Journal, пустое состояние (ещё нет сессий).
**Размер/формат:** 900×900 PNG, тёмный/прозрачный.
**Стиль:** Digital Illustration.
```
Soft atmospheric empty-state illustration, deep indigo night #100E1B. Centered: a thin lavender-grey #3A3752 open book / journal outline drawn in delicate 1px line, its pages blank and faintly glowing, with one small warm peach #E8A188 dot resting on a page like a first entry waiting to be written. A single soft breathing ring around it and a couple of faint drifting particles. Calm, inviting, gently empty. No text, no watermark, no bright white background.
```

---

### 3.13 · Progress / Connections — созвездие нитей
**Экран:** Threads / Progress, карта «созвездие» (два корневых узла-убеждения, нити к сессиям).
**Размер/формат:** 1080×1080 PNG, тёмный фон `#171526`.
**Стиль:** Digital Illustration.
```
Soft atmospheric constellation illustration, deep indigo night background #171526. Two larger root nodes — one glowing warm peach #E8A188, one glowing sage-green #8FBFAF, each softly haloed — sit apart. Around each root, several smaller session dots colored subtly in emotion hues (peach #E8A188, amber #D9A96B, dusty-blue #8E9BB8, mauve #B48FB8) of varying tiny sizes, connected to their root by thin faint 1px lavender-grey #3A3752 thread lines, like a constellation. One faint dashed thread hints at a link between the two roots. A few drifting particle dots in the dark. Elegant, quiet, interconnected. No text, no watermark, no bright white background, no dense grid.
```

---

### 3.14 · Crisis — бережная иллюстрация
**Экран:** Crisis support (пауза сессии, кризисные телефоны).
**Размер/формат:** 1080×900 PNG, тёплый тёмный фон.
**Стиль:** Digital Illustration.

> ⚠️ **RU-предупреждение — максимальная сдержанность.** Это экран кризиса. Никакой драмы, слёз, острых форм, красного тревожного свечения, изображений вреда. Только тепло, дыхание, безопасность, мягкий приглушённый янтарный свет. Проверьте результат на «спокойность»: если картинка вызывает тревогу — перегенерируйте мягче.
```
Soft, extremely gentle atmospheric illustration, warm dark background gradient from deep indigo #141021 at the top to a soft warm amber-brown #4E3423 at the bottom, with a very soft warm amber #E8AA78 radial glow rising from the bottom center like being held. Centered: two thin overlapping open circles in warm cream #F0DCC6 line, suggesting two cupped hands or two people close together — protective, tender. Above them, one small soft breathing dot inside a thin ring, slowly exhaling. No sharp shapes, no red alarm tones, no tears, no distress imagery. Calm, safe, warm, human, holding. No text, no watermark, no bright white background.
```

---

### 3.15 · Paywall (Plus) — premium glow emblem
**Экран:** Paywall sheet, эмблема сверху («Go deeper with a live guide»).
**Размер/формат:** 900×700 PNG, тёмный фон `#1E1B36`.
**Стиль:** Digital Illustration.
```
Soft premium emblem illustration, deep indigo night background #1E1B36. Centered: a small minimal bottle-shaped human silhouette (rounded, no face, thin #ECEAF7 outline, #131120 fill) haloed by three concentric rings — the innermost a glowing warm peach #E8A188 ring with a soft outer glow, the others thin off-white #ECEAF7. A soft peach radial bloom rises from the bottom. A few tiny sparkle-like particle dots (#ECEAF7 and peach) float around like a quiet premium constellation. Refined, warm, aspirational but calm. No text, no watermark, no gold cliché, no bright white background.
```

---

### 3.16 · Tab bar — 4 иконки (home / journal / progress / settings)
**Экран:** нижняя навигация (активная — пич `#E8A188`, неактивная — `#7A7699`).
**Размер/формат:** 512×512 каждая, SVG, прозрачный.
**Стиль:** Vector Icon. **Единый style-reference и seed на все 4 — одинаковая толщина и стиль скруглений.** Генерируйте в нейтральном `#A5A1C2`, цвет активного/неактивного состояния задаётся кодом.
```
Flat minimal vector icon, single-weight 1.6px thin line, lavender-grey #A5A1C2, rounded line caps, on transparent background. Subject: {{ICON}}. Perfectly centered, consistent optical size, calm and geometric, SVG-ready. No text, no watermark, no fill, no shadow, no bright white background.
```
Подставьте `{{ICON}}`:
| Таб | `{{ICON}}` |
|---|---|
| Home | a simple soft circle (aperture-like), clean and open |
| Journal | an open book / journal with a spine and two faint page lines |
| Progress | a gentle rising wave / pulse line with soft crests, like a calm graph |
| Settings | three horizontal slider rows, each with a small knob at a different position |

---

### 3.17 · Кнопочные текстуры — glow-спрайты
**Экран:** подложки под pill-кнопки (пич CTA и sage «успех»).
**Размер/формат:** 512×256 PNG с прозрачностью (radial glow, растягивается под кнопку).
**Стиль:** Digital Illustration / Image.

**3.17a · Peach pill glow**
```
A soft horizontal radial glow sprite on a fully transparent background: a warm peach #E8A188 elliptical bloom, brightest at center, fading smoothly to full transparency at the edges, no hard rim. Subtle, premium, meant to sit softly behind a rounded button. No text, no shape outline, no watermark, no bright white background.
```

**3.17b · Sage pill glow**
```
A soft horizontal radial glow sprite on a fully transparent background: a calm sage-green #8FBFAF elliptical bloom, brightest at center, fading smoothly to full transparency at the edges, no hard rim. Gentle, reassuring, meant to sit softly behind a rounded success button. No text, no shape outline, no watermark, no bright white background.
```

---

### 3.18 · App Store — 3 фоновые подложки для скриншотов
**Назначение:** фон под маркетинговые скриншоты (текст и рамка телефона накладываются сверху вручную).
**Размер/формат:** 1290×2796 PNG (6.7"), без текста.
**Стиль:** Digital Illustration. **Один style-reference на все 3 — единая серия.**

**Подложка 1 — «Тёплое начало» (для первых экранов)**
```
Soft atmospheric vertical marketing background, deep indigo night gradient from #232045 at the top through #2A2550 to a warm mauve #7A5350 at the bottom, with a warm peach #E8A188 radial glow blooming from the lower-center. Faint concentric #ECEAF7 ring arcs rising from below and a few drifting particle dots. Empty center-top space reserved for a phone mockup. Premium, calm, warm. No text, no phone, no watermark, no bright white background.
```

**Подложка 2 — «Спокойствие» (для середины)**
```
Soft atmospheric vertical marketing background, deep indigo night gradient from #171526 to #100E1B, with a large soft sage-green #8FBFAF aura blob blurred in the upper third and a subtle peach #E8A188 accent glow lower down. Sparse drifting particle dots. Airy empty space for a phone mockup and a headline. Serene, premium, spacious. No text, no phone, no watermark, no bright white background.
```

**Подложка 3 — «Путь / связи» (для финальных экранов)**
```
Soft atmospheric vertical marketing background, deep indigo night #131120, with a faint constellation of thread-linked dots (peach #E8A188 and sage #8FBFAF nodes joined by thin #3A3752 lines) drifting across the upper area, and a soft warm glow at the bottom edge. Lots of calm empty space in the center for a phone mockup. Elegant, interconnected, quiet. No text, no phone, no watermark, no bright white background.
```

---

## 4 · Чек-лист консистентности

- [ ] **Единая толщина линий** — иконки 1.5–1.6px, декоративные штрихи 1px. Не смешивать «жирные» и «тонкие» в одной серии.
- [ ] **Один источник света** — свечение всегда мягкое и идёт снизу/из центра; нет жёстких теней и бликов сверху.
- [ ] **Прозрачный фон + SVG для всех иконок** (эмоции, стадии, tab bar, стрик). Иллюстрации — PNG.
- [ ] **Проверка на тёмном `#171526`** — положить ассет на этот фон: линии `#A5A1C2` должны читаться, но не «выжигать»; ничего белого `#FFFFFF`.
- [ ] **Палитра строго из набора** — никаких неоновых/кислотных оттенков; цвета эмоций и heat-ramp — точные hex.
- [ ] **Фигура-«бутылочка» одинаковой формы** везде: маленькая круглая голова, скруглённое тело, без лица.
- [ ] **Без текста, логотипов и водяных знаков** на всех ассетах (текст добавляется в приложении; логотипы Apple/Google — только официальные брендовые).
- [ ] **Серии — с одним style-reference и seed** (7 эмоций / 6 стадий / 4 таба / 3 App Store подложки генерировать пачкой).
