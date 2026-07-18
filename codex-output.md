# Creative brief — “The Night Codex”

A complete remake of KNIGHT’s portfolio as an explorable pixel-art nocturne: part medieval manuscript, part RPG character archive, part living GitHub observatory.

The central metaphor is the golden tree: one trunk, two disciplines, many branches. Medicine and code are not competing identities; they are two ways of understanding systems, diagnosing problems, and building tools that help people.

No files were modified.

## 1. What the current codebase already establishes

The existing portfolio has strong raw material:

- A Next.js 16 / React 19 / Tailwind 4 Pages Router foundation.
- Live GitHub overview, contribution, and activity APIs with cached seed data.
- 89+ repositories with search, filtering, sorting, pagination, language metadata, topics, stars, forks, and live links.
- Five useful project families:
  - AI & Agents
  - Med-Tech
  - Arabic & Islamic
  - Media & Streaming
  - Dev Tools & Craft
- A clear personal identity: Moroccan second-year medical student, self-taught builder, LLM experimenter, Arabic-first maker.
- Strong flagship material: ZeroQCM, FORGE, fm-radio, Huroof, ReLearn and Serve.
- Accessibility foundations including reduced-motion handling, semantic navigation, loading states and fallbacks.

The main composition is visible in [index.tsx](C:/Users/hiba/Desktop/test-project/knight-portfolio/src/pages/index.tsx:38). The identity and project content live in [github.ts](C:/Users/hiba/Desktop/test-project/knight-portfolio/src/constants/github.ts:15), while the five-world taxonomy is defined in [repo-utils.ts](C:/Users/hiba/Desktop/test-project/knight-portfolio/src/lib/repo-utils.ts:17).

What should change is the presentation system. The current experience relies heavily on liquid-glass cards, conventional three-column grids, generic icon tiles and repeated fade-up reveals. It explains the KNIGHT identity, but it does not yet make the visitor feel as though they have entered KNIGHT’s world.

## 2. The new creative direction

Working title: **The Night Codex**

Alternative titles:

- The Golden Root
- Knightfall Archive
- The Scholar & the Smith
- The Nocturne Workshop
- The Tree of Two Disciplines

Core experience statement:

> At the center of a blue midnight valley stands a golden tree. Its roots descend into medicine; its branches reach into code. Every repository is a leaf, every commit a pulse, and every finished product a relic forged after dark.

The site should feel:

- Mysterious, but immediately readable.
- Medieval in structure, not costume-shop medieval.
- Pixel-art in material and motion, not covered in novelty 8-bit UI.
- Game-like without hiding essential information.
- Personal, imperfect and handcrafted.
- Cinematic at first glance; functional once the visitor begins exploring.

Avoid castles, dragons, generic fantasy inventory panels and excessive blackletter. The world is closer to an illuminated manuscript interpreted through a late-1990s adventure game.

## 3. The golden-tree background

The supplied [golden tree GIF](C:/Users/hiba/Desktop/test-project/knight-portfolio/tumblr_ppyeg9k6c51uxrf48o1_540.gif) becomes the geographic anchor of the entire site.

It is a 540 × 360 pixel-art night scene with an intense cobalt landscape, dark mountains, reflective water and a luminous gold-white tree. Its low resolution is an advantage: preserve the pixel structure deliberately rather than smoothing it.

Treatment:

- Display with crisp pixel scaling and `image-rendering: pixelated`.
- Position the tree around 62–68% across the desktop hero so text can occupy the darker left sky.
- Add a navy-to-transparent directional scrim behind text, never a uniform black overlay.
- Extend the GIF beyond its original frame with CSS-painted night fields, mountain silhouettes and fog bands matching its palette.
- Keep the background fixed through the opening chapters, then let it evolve:
  - Hero: distant tree.
  - About: camera appears closer to the trunk.
  - Project realms: visitor moves beneath its branches.
  - Activity: reflected tree in the lake.
  - Contact: sunrise never arrives; the tree simply burns brighter.
- Add very sparse independent pixel fireflies and falling gold fragments. They should not obscure the original animation.
- Preserve the visible artist credit or provide a clear attribution elsewhere unless usage rights permit removal.

The GIF must not become generic wallpaper. Every major section should be spatially related to the tree.

## 4. Color system

The site should be night-first, with no conventional light theme. A “moonlit” accessibility mode may increase contrast without turning the experience white.

| Role | Color | Use |
|---|---:|---|
| Abyss | `#030817` | Deepest page background |
| Midnight | `#07132C` | Primary surface and sky |
| Royal night | `#0A2460` | Elevated areas and mountains |
| Lake blue | `#0B49A0` | Reflections and selected states |
| Moon mist | `#9FB7D9` | Secondary text |
| Parchment | `#E8E0C9` | Primary body text |
| Tree gold | `#F6C64E` | Main accent and interactive focus |
| Leaf light | `#FFF1A6` | Highest highlight |
| Ember | `#E88A24` | Warm depth, hover and forge effects |
| Tarnished gold | `#8D6C2E` | Borders and inactive ornament |
| Error wine | `#9D4050` | Errors only |

Rules:

- Gold is the single expressive accent.
- Medical content uses moonlit pale blue and clean ivory.
- Coding content uses tree gold and ember.
- Shared work uses both through adjacency, not gradients on text.
- Large surfaces stay blue. Gold should feel precious and scarce.
- Borders resemble one-pixel engraved lines, not glowing neon.
- Use subtle dither patterns instead of glass blur and large shadows.

## 5. Typography

Use four distinct voices, but only three font families.

- **KNIGHT wordmark:** a custom bitmap-lettered mark constructed on a 12–16px grid. It should resemble engraved capitals translated into pixels.
- **Chapter headings:** Cormorant Garamond, Semibold. Large, narrow and literary without becoming theatrical.
- **Body/UI:** Geist, already present in the codebase. Clean enough to keep the fantasy layer usable.
- **Technical data:** JetBrains Mono, already present. Use for repositories, commands, timestamps, counts and system messages.

Typographic behavior:

- Chapter numbers appear as oversized faint Roman numerals behind headings.
- Pixel type is reserved for labels, buttons, map coordinates and game status.
- Never set paragraphs in a pixel font.
- Arabic project names appear in a carefully chosen Arabic companion face rather than being forced through the Latin display font.
- Text hierarchy should be created through spacing and contrast, not oversized 12vw headlines everywhere.

## 6. Hero — “The Tree of Two Paths”

The hero occupies at least one full dynamic viewport and begins without a visible card.

Composition:

- Golden tree dominates the right two-thirds.
- A vertical copy block sits in the lower-left darkness.
- A small line reads: `MOROCCO // FMPC // NIGHT WATCH`.
- Main wordmark: **KNIGHT**
- Hero statement:

> I study the body by day.  
> At night, I build systems that teach, remember and speak.

- Supporting line: “Second-year medical student. AI agent builder. 89 public experiments and counting.”
- Two path sigils sit beneath the introduction:
  - **Enter the Clinic** — med-tech and education.
  - **Enter the Workshop** — AI agents, tools and experiments.
- Primary action: **Open the Codex**
- Secondary action: **Visit GitHub**
- Real statistics appear as small engraved coordinates beside the tree, not in four cards.
- A golden root emerging from the tree becomes the scroll-progress path for the rest of the page.

On entry, the first letters of KNIGHT appear as scattered gold pixels that gather into the wordmark. No loading percentage unless the app is genuinely loading data.

## 7. Section architecture

The experience should have 14 distinct chapters, grouped under six navigation destinations.

| Chapter | Concept and interaction |
|---|---|
| 1. The Threshold | Minimal hero and path selection. The visitor chooses Clinic or Workshop, which subtly biases the ordering of later content without hiding anything. |
| 2. Character Folio | A medieval character sheet: “Scholar / Artificer,” FMPC year, Morocco, languages, current obsessions and real GitHub data. No fictional level number. |
| 3. The Two Oaths | A split narrative. Left is a moonlit anatomy notebook; right is a glowing terminal manuscript. Scrolling aligns matching ideas: observe/inspect, diagnose/debug, treat/build, revise/iterate. |
| 4. Roots of the Story | A nonlinear biography around the tree roots. Each root node holds a concise event: entering medicine, discovering LLMs, first useful tool, ZeroQCM, 89 repositories. |
| 5. The Realm Map | The five existing repository categories become places on a panoramic world map. Selecting a place shifts the landscape and introduces its projects. |
| 6. The Relic Chamber | Six flagship projects displayed as individual artifacts on pedestals: radio dial, QCM codex, forge hammer, Arabic letter tiles, memory vessel and lesson lantern. |
| 7. ZeroQCM: The Healing Archive | A focused case study styled like an annotated medical folio. Show the real 215,000+ question scale, problem, audience, workflow and product link. |
| 8. The Living Canopy | The full unique repository explorer. Every public repository becomes an interactive leaf on the golden tree. |
| 9. The Forge Bench | Technology and language inventory arranged as tools on a workbench. TypeScript is a central blade; Python, Rust, Go and JavaScript are supporting instruments. |
| 10. The AI Bestiary | Models and agent experiments presented as field notes about different “creatures”: strengths, failure modes and what KNIGHT built with them. Keep claims concrete. |
| 11. The Pulse Chronicle | Contribution history becomes a year-long ECG-meets-constellation trace. Commits are beats; streaks become illuminated runs through the lake reflection. |
| 12. The Arabic Grove | A quieter RTL-aware chapter for Huroof, prayer tools and Arabic-first projects. Gold letterforms grow from dark branches when activated. |
| 13. The Night Broadcast | fm-radio and media experiments appear around a pixel campfire/radio. Visitors may opt into a short station ident or ambient loop. |
| 14. The Summoning Gate | Contact and collaboration finale. The tree fills with every illuminated project leaf visited during the session. CTA: “Bring me a difficult idea.” |

The footer becomes a tiny post-credits scene: the tree in the distance, GitHub data timestamp, technology credits, sound toggle and artist attribution.

## 8. Unique repository display — “The Living Canopy”

The existing searchable arsenal in [arsenal.tsx](C:/Users/hiba/Desktop/test-project/knight-portfolio/src/components/portfolio/arsenal.tsx:28) is functionally useful, but the card grid should be replaced by a spatial system.

Primary view:

- The trunk divides into five branches matching the current taxonomy.
- Every repository is one leaf.
- Leaf location is deterministic, so the map remains familiar between visits.
- Leaf size reflects project prominence using a restrained combination of stars, recency and featured status.
- Recently pushed repositories flicker once every several seconds.
- Forks are silver-blue leaves.
- Archived repositories are dim, hanging leaves.
- Live products have a tiny square of lake-blue reflection below them.
- Featured repositories appear as large gold fruit or hanging relics rather than merely larger cards.

Interaction:

- Hovering or focusing a leaf reveals its name on a small engraved label.
- Selecting it opens a side “codex page” containing description, language, topics, dates, stars, fork status, GitHub link and live demo.
- Search behaves like an incantation: unmatched leaves dim while matches pulse once.
- Theme filters rotate the tree toward the selected branch.
- Sorting changes the optional list view, not the physical tree, preventing spatial disorientation.
- A clearly labeled accessible **List View** retains the current search/filter functionality for keyboard, screen-reader and low-power users.

This display turns 89 repositories from a quantity into a memorable body of work.

## 9. Game-like layer

Gamification must be derived from real actions and data—never fake XP.

- **Quest Log:** shows visited chapters and selected projects.
- **Path choice:** Clinic or Workshop changes narrative emphasis, not available content.
- **Relic discoveries:** opening a featured project adds its sigil to a small inventory strip.
- **Map completion:** based only on sections genuinely visited.
- **GitHub achievements:** Pull Shark, Pair Extraordinaire and YOLO appear as real heraldic badges.
- **Save state:** optional local storage remembers sound, chosen path and discovered relics.
- **Secret:** clicking the tree’s reflection three times reveals a small command console with useful commands such as `repos medical`, `open zeroqcm`, `now`, and `github`.
- **Final state:** the contact section visually reflects what the visitor explored.

Avoid health bars, fake combat, fabricated skill ratings and “Level 99 Developer” language.

## 10. Medieval navigation

Desktop navigation becomes a narrow illuminated chapter ribbon.

- Left: KNIGHT crest, built from the K and a minimal tree/root symbol.
- Center: six chapters — Threshold, Oath, Realms, Relics, Chronicle, Summon.
- Active section is connected to the golden scroll-root rather than shown as a rounded pill.
- Hover reveals the modern plain-language title underneath the poetic label.
- Right: GitHub, sound and contrast controls.

Mobile navigation becomes a **Pocket Codex**:

- A small fixed book clasp.
- Opening it reveals a full-height dark manuscript page.
- Sections appear as numbered chapters with progress marks.
- It closes on selection, Escape or backdrop activation.
- Navigation remains ordinary semantic links underneath the art direction.

## 11. Motion language

Motion should look authored frame-by-frame.

Ambient motion:

- GIF remains the main source of life.
- Fireflies update at low frequency with stepped timing.
- Gold leaves occasionally detach and drift downward.
- Lake reflections offset by one or two pixels.
- Distant stars blink asymmetrically.
- No constant floating glass cards.

Scroll motion:

- The golden root draws through the page as progress increases.
- Sections enter through a pixel-dither mask, not repeated opacity fades.
- Map layers shift at different speeds by only 8–24px.
- Chapter numerals appear before their content.
- The split medical/code section synchronizes two columns like a comparison instrument.

Interaction motion:

- Buttons depress by one pixel.
- Repository leaves turn, brighten and settle with a short rustle animation.
- Codex drawers unfold in two stages: spine, then page.
- Data refresh sends a brief gold pulse from the tree root into the selected branch.
- Errors appear as a broken rune that resolves into a readable message.

Timing:

- Input feedback: 90–140ms.
- Page/drawer transitions: 240–360ms.
- Chapter reveals: 500–700ms.
- Ambient cycles: 7–18 seconds.
- Pixel effects use `steps()` where appropriate; UI movement uses restrained easing.

Reduced-motion mode freezes the GIF on a representative frame, removes parallax and leaf drift, and replaces animated reveals with immediate rendering.

## 12. Sound design

Sound is opt-in and muted by default. The first activation should come from an explicit **Hear the Night** control.

Three ambient layers:

- Low mountain wind.
- Quiet water near the tree.
- Very sparse metallic leaf chimes.

Interface sounds:

- Navigation: muted wooden tick.
- Codex open: short paper-and-clasp sound.
- Repository open: a two-note dulcimer motif.
- GitHub refresh: small forge strike.
- Clinic path: soft heartbeat-like low percussion, used once and never looped.
- Workshop path: restrained terminal relay click.
- Night Broadcast: separate optional radio layer.

Requirements:

- Persistent mute and volume controls.
- No sound on every hover.
- Pause ambient audio when the page becomes hidden.
- No medical monitor alarms or sounds that imply clinical emergency.
- Captions or textual descriptions for meaningful audio content.

## 13. Expressing the med-student/coder duality

This should drive the entire information architecture.

Language pairs:

- Anatomy / Architecture
- Diagnosis / Debugging
- Differential / Hypothesis
- Protocol / Function
- Revision / Iteration
- Case history / Commit history
- Instruments / Toolchain
- Pulse / Runtime

The tone should be confident but honest:

> Medicine taught me to look closely. Code gave me a place to test what I saw.

> I am not trying to make software look clinical. I build for problems I meet as a student: revision, overload, access and language.

> I learn systems twice—once through the body, once through the machine.

ZeroQCM should supply proof of medical relevance. AI agents and FORGE provide the engineering counterweight. Arabic-first projects make the identity culturally specific rather than generically “developer fantasy.”

## 14. Responsive and accessibility direction

- Desktop can be spatial and asymmetric; mobile becomes a linear illustrated codex.
- Preserve a semantic reading order independent of the visual map.
- Never require hover to discover project names or actions.
- Maintain visible gold focus states with strong navy separation.
- Provide an accessible list alternative to the canopy.
- Keep all body text at least 16px on mobile.
- Treat the GIF as decorative when equivalent narrative text exists.
- Ensure Arabic content uses correct direction and language attributes.
- Pause animation and audio when the document is not visible.
- Keep the live GitHub loading, empty and failure states already present in the codebase.

## Final design test

The remake succeeds if a visitor can answer these questions after one minute:

1. Who is KNIGHT?
2. Why do medicine and code belong in the same story?
3. What has he actually built?
4. Which project should they try first?
5. How can they explore all 89 repositories?
6. How can they contact or collaborate with him?

And after closing the page, they should remember one image: a medical student working beneath a golden tree after midnight, turning questions into tools.