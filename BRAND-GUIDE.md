# CHRONOS — Brand Identity Guide

## The Operating System For Time

---

## 1. Brand Philosophy

CHRONOS is not a time-tracking tool. It is not a calendar. It is not a project management platform.

CHRONOS is the infrastructure that makes time observable, navigable, and simulable — the same way an operating system makes a computer's hardware accessible to software.

The brand exists at the intersection of three domains:

- **Archaeology** — humanity's drive to understand what came before
- **Theoretical physics** — the mathematical pursuit of time's true nature
- **Luxury engineering** — the craft of building objects that outlast their creators

The brand should feel like it was designed by a team that includes a watchmaker, a cosmologist, a museum curator, and an industrial designer — none of whom work in tech.

---

## 2. Design Principles

**Precision over Perfection**
Every measurement is deliberate. Nothing is approximate. The brand tolerates exactness, not guesswork.

**Depth over Flatness**
Nothing should feel surface-level. Every visual element should suggest that more exists beneath — physically, temporally, conceptually.

**Silence over Noise**
The brand communicates through restraint. Empty space is a material, not an absence. Visual density is a privilege earned by content.

**Permanence over Novelty**
The brand should feel as relevant in fifty years as it does today. It does not chase trends. It establishes standards.

**Discovery over Explanation**
The interface reveals itself gradually. The brand rewards curiosity. Not everything is visible on first glance.

**Material over Digital**
Even in a purely digital context, everything should feel like it has physical presence — mass, texture, weight, and behavior governed by natural law.

---

## 3. The Temporal Core

### Concept

The Temporal Core is the single most important visual object in the CHRONOS brand. It is to CHRONOS what the Apple logo is to Apple, what the Nike Swoosh is to Nike — except it is not a logo. It is a *discovered object*.

The Core appears to be an artifact that has existed for millennia, built from materials that do not yet exist, using techniques that have been forgotten. It was found, not designed.

### Composition (from inside out)

**The Crystal**
A faceted, suspended crystal at the center. Internally refractive — light enters and bends before exiting. The crystal contains a slow-moving internal light source, like captured starlight. The crystal is not perfectly clear; it has ancient inclusions, microscopic fractures, signs of age.

**The Rings**
Three fractured metallic rings orbit the crystal. Each ring is incomplete — broken arcs rather than full circles. The gaps represent fractures in time.

- Ring 1 (innermost): Tight orbit, fast rotation, brushed titanium, horizontal axis
- Ring 2 (middle): Wider orbit, medium rotation, dark chrome, 45-degree axis
- Ring 3 (outermost): Widest orbit, slowest rotation, worn gunmetal, vertical axis

Each ring has intentional missing segments. The gaps are not the same size. The rings never align to complete a circle — time can never be whole.

**The Fragments**
Small crystalline shards float in the space between and around the rings. They drift independently. They appear to have broken off from the rings or the crystal. Some rotate slowly. Some tumble. All are sharp, faceted, deliberate.

**The Particles**
A sparse field of sub-millimeter particles orbits the entire assembly. They are barely visible — more sensed than seen. They behave like dust in a beam of light, catching occasional reflections.

**The Energy Flow**
Subtle, thread-thin lines of light connect components without touching them. The energy flows from the crystal outward through the rings, then loops back. It is not electricity. It is not magic. It is a phenomenon not yet understood.

### Behavior (idle state)

| Component | Motion | Duration |
|-----------|--------|----------|
| Crystal | Subtle breathing (scale ±1.5%) | 8s cycle |
| Internal light | Slow pulse (intensity oscillation) | 12s cycle |
| Ring 1 | Rotation on X axis | 20s per revolution |
| Ring 2 | Rotation on Y axis | 45s per revolution |
| Ring 3 | Rotation on Z axis | 90s per revolution |
| Shards | Independent orbital drift | 30–120s cycles |
| Particles | Slow orbital drift | 60–300s cycles |
| Energy threads | Flow animation | 15s cycle |

Nothing stops. Nothing accelerates. Everything maintains its own calm, eternal rhythm.

### Behavioral rules

- When hovered, the Core subtly shifts its center of mass toward the cursor
- When clicked, the rings momentarily slow, then resume
- When idle for 30s, the internal light dims to a minimum
- At system loading, the Core assembles from fragments outward (crystal first, then rings, then shards, then particles, then energy)
- At system error, the rings reverse direction briefly, then recover
- The Core never glows excessively. Its light is contained.

---

## 4. Material System

### Crystal

| Property | Value |
|----------|-------|
| Base color | Deep violet-grey (#1A1030) |
| Refraction index | High (simulated caustics) |
| Surface | Polished, with microscopic wear |
| Internal | Inclusions, fractures, bubbles |
| Transparency | Semi-transparent (cloudy center, clear edges) |
| Edge behavior | Thin edge glow (cyan) |

### Metal — Ring 1

| Property | Value |
|----------|-------|
| Material | Brushed titanium |
| Color | Warm silver-grey (#8A8A8A) |
| Finish | Brushed, direction consistent |
| Wear | Minimal edge wear at gap points |
| Highlights | Sharp, directional |

### Metal — Ring 2

| Property | Value |
|----------|-------|
| Material | Dark chrome |
| Color | Deep graphite (#2A2A2A) |
| Finish | Mirror-polished |
| Wear | Fingertip patina at gap edges |
| Highlights | Broad, environmental |

### Metal — Ring 3

| Property | Value |
|----------|-------|
| Material | Gunmetal |
| Color | Warm dark grey (#3A3028) |
| Finish | Sand-blasted matte |
| Wear | Heavy — pitted, aged |
| Highlights | Diffuse, soft |

### Energy

| Property | Value |
|----------|-------|
| Color | Soft cyan → violet gradient |
| Intensity | Low (barely visible in ambient light) |
| Behavior | Flows like liquid light, not electricity |
| Thickness | Below 0.5px | 

---

## 5. Color System

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--chronos-black` | #0A0A0A | Primary background |
| `--chronos-graphite` | #1A1A1A | Surface, cards |
| `--chronos-white` | #F5F5F5 | Primary text |
| `--chronos-off-white` | #A3A3A3 | Secondary text |

### Accent Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--chronos-cyan` | #22D3EE | Primary accent, energy, links |
| `--chronos-violet` | #8B5CF6 | Secondary accent, depth, UI focus |
| `--chronos-gold` | #D4A853 | Tertiary accent, highlights, achievements |

### Extended Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--chronos-surface-elevated` | #141414 | Elevated cards |
| `--chronos-surface-highest` | #1F1F1F | Modals, dialogs |
| `--chronos-border-subtle` | rgba(255,255,255,0.04) | Default borders |
| `--chronos-border-default` | rgba(255,255,255,0.08) | Standard borders |
| `--chronos-border-strong` | rgba(255,255,255,0.12) | Focused borders |
| `--chronos-text-secondary` | #737373 | Muted text |
| `--chronos-text-tertiary` | #525252 | Placeholder, disabled |
| `--chronos-cyan-subtle` | rgba(34,211,238,0.08) | Subtle cyan surfaces |
| `--chronos-violet-subtle` | rgba(139,92,246,0.08) | Subtle violet surfaces |

### Semantic Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--chronos-success` | #10B981 | Positive states |
| `--chronos-warning` | #F59E0B | Warning states |
| `--chronos-error` | #EF4444 | Error states |
| `--chronos-info` | #3B82F6 | Information |

### Color Rules

- Never apply accent colors on large surfaces
- Accent colors exist only at 5–15% opacity for backgrounds
- Only text, borders, and small UI elements use full accent opacity
- Never use pure white (#FFFFFF). Always use `#F5F5F5` or warmer
- Never use pure black (#000000). Always use `#0A0A0A`

### Gradient System

| Name | Definition | Usage |
|------|-----------|-------|
| Brand | `linear-gradient(135deg, #22D3EE, #8B5CF6)` | Logo, hero text |
| Surface | `linear-gradient(180deg, rgba(255,255,255,0.02), transparent)` | Card surfaces |
| Border | `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))` | Refined borders |
| Energy | `radial-gradient(circle at 50% 50%, #22D3EE, #8B5CF6, transparent)` | Temporal Core glow |

---

## 6. Typography Recommendations

### Primary Display — *PP Mori* by William H. Leong

**Why:** Mori was designed specifically for environmental and spatial contexts. Its generous proportions, subtle geometric construction, and unconventional character shapes feel both ancient (roman inscription roots) and futuristic (the slight angularity in curves). It is not a typical SaaS font.

Recommended usage: Display typography 48px+, hero headings, large numbers, temporal metrics.

### Primary Text — *Inter* by Rasmus Andersson

**Why:** The default choice for premium digital products. Numeric tabular figures align perfectly with CHRONOS's data-heavy interfaces. Excellent legibility at all sizes. The neutrality of Inter allows Mori to take all the expressive weight.

Recommended usage: Body text, UI labels, data displays, all text below 48px.

### Monospace — *Berkeley Mono* by Berkeley Graphics

**Why:** A contemporary monospace that feels engineered rather than retro. Its even spacing and distinctive character shapes suit code, timestamps, temporal coordinates, and real-time data feeds. The slight personality prevents it from feeling like a terminal font.

Recommended usage: Code blocks, timestamps, temporal coordinates, system messages, telemetry data.

### Pairing Strategy

| Context | Font | Weight | Size | Leading | Tracking |
|---------|------|--------|------|---------|----------|
| Hero display | PP Mori | 300 | 80–120px | 0.9 | -0.03em |
| Section heading | PP Mori | 400 | 48–64px | 1.0 | -0.02em |
| Subheading | Inter | 500 | 20–28px | 1.2 | -0.01em |
| Body | Inter | 400 | 14–16px | 1.6 | 0em |
| Small | Inter | 400 | 12–13px | 1.5 | 0.01em |
| Caption | Inter | 500 | 10–11px | 1.4 | 0.03em |
| Data | Berkeley Mono | 400 | 13–15px | 1.4 | 0em |
| Code | Berkeley Mono | 400 | 12–14px | 1.6 | 0em |
| Temporal markers | Berkeley Mono | 500 | 11–12px | 1.2 | 0.05em |

### Typography Rules

- Every line of text must have a clear typographic role
- Never mix Mori and Inter within the same typographic group
- Never letter-space Mori (its forms are designed to be read as shapes)
- Only Berkeley Mono receives wide tracking — and only for temporal data
- Never use bold weight where medium would suffice
- Every text element must have an explicitly defined line-height

---

## 7. Motion Principles

### Philosophy

Motion in CHRONOS communicates intelligence. Every animation has a reason. Nothing moves without purpose. The system should feel alive but never jittery, responsive but never aggressive.

### The Five Commandments

**Nothing appears. Everything assembles.**
Elements do not fade in. They construct themselves — fragment by fragment, piece by piece — as if being built by invisible hands. The assembly duration should be proportional to the element's complexity.

**Nothing disappears. Everything dissolves.**
Elements do not fade out. They disassemble, break apart, or dissolve into constituent particles. The dissolution pattern mirrors the assembly pattern.

**Nothing rotates mechanically. Everything drifts.**
No element should rotate around a fixed axis at a fixed speed. Everything has orbital drift — slight precession, subtle axial wobble, natural variance in velocity.

**Nothing accelerates instantly. Everything eases naturally.**
No motion starts or stops abruptly. All motion follows a custom ease curve: `cubic-bezier(0.16, 1, 0.3, 1)` — a "smooth-out" curve that feels gravitational.

**Nothing moves alone. Everything reacts.**
When one element moves, nearby elements move in sympathy. The system suggests interconnectedness. A button hover should subtly influence adjacent elements.

### Timing Baseline

| Context | Duration | Ease |
|---------|----------|------|
| Hover response | 150ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Button press | 100ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Card reveal | 400ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Page transition | 500ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Modal entry | 350ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Fragment assembly | 800–2000ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Particle drift | continuous | linear |

### Hover Behavior

| Element | Response |
|---------|----------|
| Button | Scale 1.02, border accent shift, subtle top shadow increase |
| Card | Elevate 4px, border opacity 0.08 → 0.12 |
| Timeline marker | Expand 1.5x, emit particle burst |
| Link | Underline emerges from center outward, color to accent |
| Data point | Counter detail panel slides from trailing edge |

### Reduced Motion

When `prefers-reduced-motion` is detected:

- No assemblies or dissolutions. Elements appear at full opacity immediately
- No orbital drift. Everything is static
- Hover responses become instant (0ms delay, 10ms duration)
- Particle fields are removed entirely
- Temporal Core settles to a static pose
- Page transitions become instant crossfades

---

## 8. Lighting Principles

### Core Lighting Model

CHRONOS exists in a single, consistent volumetric environment.

- **Primary light source:** A single soft key light positioned at 45° above and 30° left of center. Mimics morning sun through a high window.
- **Fill light:** A very subtle bounce from below (15% intensity of key). Prevents deep shadows.
- **Rim light:** A sharp edge light from behind-right. Creates the premium silhouette.
- **Ambient:** Dark, cool — approximating a museum gallery with black walls.

### Rules

- Every 3D element receives key + rim + fill
- No element is lit by more than three lights
- No harsh shadows — all shadow edges are soft (radius 30+)
- Specular highlights are sharp but dim (reflectivity capped at 60%)
- Background elements receive 40% less light than foreground elements
- Temporal Core receives an additional rim light from below (revealing internal structure)

### Environment

- Background gradient: 0A0A0A (top) → 050505 (bottom)
- Subtle volumetric fog at depth edges
- No environmental lighting maps that introduce warm colors
- Reflections are tinted cyan-violet (match accent palette)

### Bloom

- Amount: Minimal (0.3% threshold)
- Only applied to energy threads and crystal internal light
- Never applied to text, UI elements, or metal surfaces
- Radius: 8px

---

## 9. Logo Concepts

### Primary Logo

**Wordmark:** "CHRONOS" set in PP Mori, weight 300, tracking -0.02em. The letters 'C' and 'S' are subtly fractured — a single horizontal break through each, offset by 0.5px. Imperceptible until noticed. Once noticed, unforgettable.

**Icon:** A simplified temporal core — one ring (broken arc), one crystal fragment (faceted diamond shape), one particle. Three elements. Nothing more.

### Logo Variants

| Variant | Description |
|---------|-------------|
| Primary | Wordmark + icon, horizontal lockup |
| Stacked | Wordmark below icon, vertical lockup |
| Icon only | Core symbol alone (favicon primary) |
| Monochrome | Single color (white on dark, black on light) |
| Embossed | Debossed look for dark surfaces |
| Glass | Frosted glass panel with icon etched |
| App icon | Crop to square, icon centered on gradient field |

### Favicon (16×16)

At the smallest size, the favicon is a single broken arc with a dot at the break point. It reads as "C" with a period. At 16px, the crystal fragment is approximated by a single pixel offset. The favicon must be tested at actual 16×16 before being finalized.

### Logo Rules

- Never stretch the logo
- Never apply the icon without at least 16px clearance on all sides
- Never place the logo on a busy background
- Never recolor the logo outside the approved palette
- Never animate the wordmark — only the icon may animate
- The preferred position is top-left with horizontal lockup

---

## 10. Icon System

### Style

- Stroke-based at 1.5px weight
- Rounded terminals (2px radius on all strokes)
- 24×24px base grid with 2px padding
- No filled variants — all icons are outline
- Accent color only for active states

### Core Icons

| Concept | Visual |
|---------|--------|
| Time | Broken circle with orbital arc |
| History | Layered rings, concentric but offset |
| Simulate | Three overlapping timeline strands |
| Observe | Eye with ring-shaped pupil |
| Navigate | Arrow passing through ring |
| Timeline | Vertical line with evenly spaced nodes |
| Era | Ring segment with interior facet |
| Crystal | Diamond shape with internal refraction lines |
| Timeline marker | Diamond with connecting line |
| Event | Small ring with central dot |
| Data | Three ascending bars with ring caps |
| System | Circle with three orbital arcs |
| Settings | Gear constructed from broken circle fragments |
| Warning | Triangle with crystal facet interior |
| Error | Broken ring fragment |
| Success | Complete ring (only full circle in system) |

### Icon Rules

- No icon should contain more than 3 geometric components
- Every icon must be recognizable at 16×16 with the stroke doubled
- Icons dedicated to temporal concepts must include at least one broken arc
- Non-temporal icons (settings, user, etc.) should not use broken arcs
- Icons are never used without text labels in navigation

---

## 11. Shape Language

### Primary Shapes

**Broken Circle / Arc**
The most recognizable CHRONOS shape. Appears in logos, icons, UI borders, loading indicators, data visualizations, and decorative elements. The break represents time's inherent incompleteness.

**Concentric Ring**
Used for depth, focus indicators, timeline orbits, and modal framing. Never complete — always at least one ring missing one segment.

**Faceted Diamond (Crystal)**
A sharp, angular shape derived from the Temporal Core crystal. Used for timeline markers, waypoints, achievement badges, and cursor indicators. The diamond has exactly 6 facets (left, right, top, bottom, two internal).

**Orbital Arc**
A curved path suggesting movement around an invisible center. Used for loading states, progress indicators, and navigation transitions.

**Radial Symmetry**
All temporal data visualizations use radial (not linear) layouts. Time is circular, not a straight line. Bar charts become ring charts. Progress bars become orbital arcs.

### Recurring Patterns

- **Single break:** Every recurring geometric element must have exactly one intentional break
- **Three layers:** Visual compositions should rarely exceed three layers of depth
- **Offset alignment:** Nothing should be perfectly center-aligned if it can be intentionally offset
- **Negative space:** The shape of the missing pieces is as important as the shape of the existing pieces
- **Golden ratio:** All ring diameters and orbital distances follow the golden ratio (1:1.618)

---

## 12. Future UI Language

### Structural Principles

- All UI panels are panels (not cards). Panels have hard edges, no rounded corners below 8px, and float above the surface with elevation shadow.
- Glass panels are reserved for navigation, modals, and overlays. Content panels are solid.
- Every panel has a 1px border using `--chronos-border-subtle`.
- Content is organized in a single vertical column at `960px` maximum width. Sidebars and secondary panels exist outside the content column.
- Data clusters are displayed on dark glass panels that overlay the main content — not separate pages.

### Component Aesthetic

| Component | Visual |
|-----------|--------|
| Button | Solid, hard corner (radius 6px), uppercase label, frameless on hover |
| Input | Border-only, no fill, accent border on focus |
| Dropdown | Glass panel, appears with fragment assembly animation |
| Tooltip | Thin glass, no arrow, appears above element |
| Modal | Full glass, backdrop blur Extreme, centered |
| Navigation | Vertical timeline rail (left) or floating glass bar (top) |
| Data table | No horizontal borders, alternating row opacity |
| Chart | Radial (ring chart), never linear (bar chart) |

### Scrollbar

Custom scrollbar: 4px wide, transparent track, thumb is a broken ring segment that fills as you scroll. The unfilled portion remains visible as a faint track.

### Selection State

Selected elements receive a thin cyan border on the left side. The selection indicator animates as an energy flow from bottom to top.

### Loading State

Every loading state is a simplified Temporal Core — three broken arcs orbiting a central dot. The arcs assemble, orbit, and disassemble in a continuous loop. Duration: 3–5 seconds max before content appears.

### Error State

When error occurs, all borders in the viewport momentarily shift to error red, then recover. The Temporal Core's rings reverse direction once, then reset. A single crystal fragment falls and shatters.

### Empty State

Empty states show a single Temporal Core particle slowly drifting downward. Text informs the user what belongs here and provides a call to action.

---

## 13. Brand Do's and Don'ts

### Do

- Use deep black `#0A0A0A` as the primary background
- Use Inter for all UI text, PP Mori for display
- Use broken arcs as the primary decorative motif
- Keep accent colors at low opacity for backgrounds
- Allow generous whitespace
- Use the temporal core icon as the primary favicon
- Maintain 8px spacing grid consistently
- Use the custom easing curve for all motion
- Support `prefers-reduced-motion` completely
- Use the golden ratio for spatial compositions

### Don't

- Use gradient backgrounds behind text
- Apply accent colors to large surface areas
- Use full white (#FFFFFF) anywhere
- Mix more than two typefaces in a single view
- Create rainbow or multi-color gradients
- Use glow effects stronger than 5px blur
- Use stock icons from generic icon sets
- Create horizontal bar charts (use radial)
- Use completely closed circles (always break them)
- Place UI elements without defined vertical rhythm
- Use SaaS clichés (rocket, cloud, gear, graph line going up)

---

## 14. Mood Board Keywords

Anthropocene · Apophenia · Archaeological dig · Astronomical observatory · Baselworld · Brutalism (refined) · Camera obscura · Carbon dating · Celestial mechanics · CERN control room · Chronometer · Cold light · Deep time · Derelict spacecraft · Desert observatory · Die Another Day (titles) · Discovery One (2001: A Space Odyssey) · Edge of Tomorrow (minimalist sci-fi) · Endurance (Interstellar) · Event Horizon Telescope · First light · Foucault's pendulum · Frozen in time · Gears of War (architecture) · Glacier ice (internal light) · Grand Seiko dial · Gravity (interior shots) · Griffith Observatory · Halogen · Heavy water · Hubble Deep Field · Ice core sample · Ingenuity · Inside a mechanical watch · Kubrick · Lascaux cave paintings · LIGO control room · Mass · Minimalist architecture (Tadao Ando) · Monolith · Moon (2009) · Natural history museum · Neutrino detector · Observatory domes · Oil derrick at night · Optical bench · Orrery · Particle accelerator · Pendulum clock · Plumb line · Polar night · Precision engineering · Pulsar · Quartz · Radar array · Radio telescope · Raised-relief map · Reflection nebula · Refraction · Sand hourglass (deconstructed) · Saturn V engine · Scientific glassware · Seismograph · Sidereal · Silent Running · Slide rule · South Pole Telescope · Space: 1999 (minimalist) · Spectrum analyzer · Stained glass (ancient) · Star navigation · Starlight · Steel mill · Stillness · Stirling engine · Stone carving · Stretched time · Submarine periscope · Sundial (ancient, precise) · Surveyor's transit · Tension · The Abyss (underwater light) · The Andromeda Strain · The Fountain · The Navigator · The Northern Lights · Thermoluminescence · Time dilation · Time-lapse stars · Titanium machining · Torsion balance · Triangulation · Tritium illumination · Underground laboratory · Underwater cave · Universal Turing machine · Vacuum chamber · Vantablack · Vernier scale · Watch movement · Water clock · Wave tank · X-ray crystallography

---

## 15. Blender Creation Guide — Temporal Core

### Scene Setup

- Render engine: Cycles
- Resolution: 3840×2160
- Focal length: 85mm
- Depth of field: f/2.8, focus on crystal center
- Background: Pure black (#000000), add world volume scatter at 0.01 density

### Lighting

- **Key light:** Area light (soft), 45° up-left, 500W, color 5600K, size 2m
- **Rim light:** Area light (sharp), behind-right, 200W, cyan tint (#22D3EE at 20% strength), size 0.5m
- **Fill light:** Point light, below-center, 50W, violet (#8B5CF6), very soft
- **Internal light:** Point light inside crystal, 30W, animated intensity, cyan (#22D3EE)
- **Ambient:** World color #050505

### Crystal

- Geometry: Custom faceted mesh (24 faces minimum, 48 maximum)
- Material: Principled BSDF
  - Base color: #1A1030
  - Roughness: 0.0
  - IOR: 2.0
  - Transmission: 0.9
  - Alpha: 0.85
- Add Glass BSDF mixed at 30% for secondary refraction
- Internal geometry: A smaller crystal inside with emission shader

### Rings

- Each ring: 24 segments minimum
  - Geometry: Curve with bevel (rectangular profile, 0.05m × 0.02m)
  - Gap: Delete 2–4 segments per ring (different positions per ring)
- Ring 1 material: Principled BSDF
  - Base: #8A8A8A (titanium)
  - Roughness: 0.15
  - Metallic: 0.9
  - Anisotropic: 0.5
- Ring 2 material: Principled BSDF
  - Base: #2A2A2A (dark chrome)
  - Roughness: 0.05
  - Metallic: 1.0
  - Anisotropic: 0.8
- Ring 3 material: Principled BSDF
  - Base: #3A3028 (gunmetal)
  - Roughness: 0.6
  - Metallic: 0.7

### Shards

- 5–9 small crystal fragments
- Scale: 3–10% of main crystal
- Material: Same as crystal but with higher alpha (0.95)
- Distribution: Within ring bounds, no two on the same orbital plane

### Energy Threads

- Curve path with 8 control points per thread
- 3 threads total
- Bevel depth: 0.003m
- Material: Emission shader
  - Color: #22D3EE
  - Strength: 0.5
  - Mix with transparent at 50%

### Particles

- 500–1000 points
- Scale: 0.002–0.008m
- Material: Emission (color #22D3EE, strength 0.1) + Transparent
- Distribution: Spherical volume, radius 3m around center
- Add a tiny random offset to each particle position

### Animation

- Add rotation drivers to each ring's Euler rotation
  - Ring 1: X rotation at 0.05 rad/frame
  - Ring 2: Y rotation at 0.02 rad/frame
  - Ring 3: Z rotation at 0.01 rad/frame
  - Add slight noise modifier to each (±0.002 rad/frame variation)
- Crystal internal light emission strength: Keyframe 0.3–0.5 over 60 frames, loop
- Shards: Add random location noise (amplitude 0.02, scale 3)
- Particles: Add turbulence force field (strength 0.1, size 2)

### Rendering

- Samples: 256 (final), 64 (preview)
- Denoiser: Optix
- Output: PNG 16-bit, RGBA
- Rotation: 360 frames at 24fps = 15 seconds
- Suggested background plate: Subtle dark gradient with one bright star in frame (for context)

---

*This brand guide is the single source of truth for all CHRONOS visual identity decisions. Every future phase — UI development, animation, 3D, sound, marketing — derives from this document. If a creative decision contradicts this guide, the guide wins.*
