# KemperSports Homepage 2026: Production notes

Source: Claude Design canvas export `kempersports-homepage.zip`, swapped in on 2026-11-16.
Earlier contents of this folder (Lorax name-submission form, Apps Script, setup doc) are in
`_archive/2026-11-16-lorax-name-form/`.

## Warnings

**Robustness**
- `index.html` (formerly `Main.dc.html`) needs the Claude Design runtime `support.js`, which the zip didn't include. I copied it in from `../BCG/site/support.js`. All six copies across projects have the same md5 (`951ae391…`). If Claude Design ever changes the runtime, refresh this copy.
- ~~Mobile breaks at 390px.~~ **Resolved 2026-11-16.** The real cause was the missing viewport meta tag, so phones laid the page out at 980px. Added the tag, plus a `max-width:760px` block that does the following:
  - Stacks "Who we serve" vertically and turns off its sideways scroll.
  - Shortens the pinned "What we do" section and puts it on the 20px gutter.
  - Puts the Extend cards' image above the text.
  - Fixes the proof spacing and lays the footer links out in two columns.
  - Adds About and a proper "Talk with our team" button to the mobile menu.

  I checked it at 390, 768 and 1440 in headless Chrome with mobile emulation. Nothing scrolls sideways at any of the three widths. **Not tested on a real iPhone or Android yet.** Pre-change copy is at `/private/tmp/…/scratchpad/Main.before-mobile.html` (temporary location).
- Mobile styles mostly use `!important` to beat the export's inline styles. A production rebuild should move these styles into components rather than carry the overrides forward.
- ~~Image scale effects.~~ **Resolved 2026-11-16.** My earlier note said the chapter photos settle at scale 1. That was wrong. Creative review measured chapters 1 and 2 at rest at 1.037 and 1.019. I've removed the chapter scale (1.12 to 1), the `.zoom:hover` 1.04 zoom and the dead `imgScale` 1.06. A DOM check at 1440 and 390 now finds no img or video above scale 1.
- The Tweaks pill sits over content in the bottom-right corner on mobile. It's review-only and goes away when the panel is removed.

**Content accuracy** (placeholders, from the export README)
- The proof figures (94%, 18-year, 2025 sources) and the `[X]` / `[year]` result numbers are placeholders.
- Placeholders: the Village Club of Sands Point proof line, the Golf Digest source line, and the result-card names and titles.
- City of Ventura quote: needs client sign-off on the source.

**Imagery**
- The Henderson inset (`assets/prop-henderson-detail.jpg`, 20 KB) is low-res. Replace it.
- Licensing for the photography and `hero.mp4` hasn't been confirmed.

**Performance, unmeasured**
- `hero.mp4` is 9 MB at 1080p. Nobody has profiled it or built a mobile encode.

**Dead code / review-only**
- Everything between TWEAKS:START and TWEAKS:END is the review panel. Remove it at build.
- All links are `href="#"` on purpose.

**Accessibility** (accessibility-agent ran a WCAG 2.2 AA audit on the 2026-11-16 build, measured in headless Chrome only)
- Fixed:
  - Mobile menu: focus handling, closes on Escape and on link click.
  - Hero video pause button (2.2.2). It starts paused under reduced motion.
  - The OS reduced-motion setting is now honoured throughout.
  - Skip link and `<main>`.
  - `h4` changed to `h3`.
  - Carousel group and slide semantics, with the clone slides hidden from screen readers.
  - Focus ring.
  - `#serve` keeps focus on screen.
  - `#services` stages open on focus and unpin below 680px viewport height.
- Contrast fixes:
  - Gold hover text changed to #111512 (8.21:1).
  - "of" changed to #B4500F (5.13:1).
  - Serve subtitle changed to #5C6760 (5.55:1).
  - Inactive stage titles raised to 0.75 opacity, carousel captions to 0.7.
  - Hero and chapter scrims darkened.
- **The hero scrim is at the floor.** The worst sampled frame of the 38-second montage gives the H1 3.16:1 and the nav about 4.1-4.6:1. Any re-edit of the footage or lightening of the scrim needs re-measuring.
- Open:
  - `#services` pin clips under text-spacing overrides (1.4.12).
  - Under reduced motion the `#serve` sideways scroll and the `#services` image slides still run.
  - Footer social and legal links pass 2.5.8 only on the spacing exception.
  - Not tested with real screen readers or on real devices.
- Any colour or scrim change invalidates these ratios.

**Creative review, 2026-11-16:** verdict was hold for one fix pass. Brand score 16/24. Full write-up in `docs/REVIEW-2026-11-16.md`. Open items:
- Under-resolution images: `serve-cities` is 1000px wide, upscaled 1.44x. `do-open` and `do-plan` are upscaled 1.27x, and `do-open` has a sky seam.
- Type hierarchy: the H1 (48px) is smaller than the "How we operate" H2 (49px), and there are six different H2 sizes.
- No line under the H1 saying what KemperSports does. On mobile the first screen never says it.
- Mobile pass 2: the carousel is a sliver at 390, "What we do" hides all its photos, the page has five different left edges, and Tweaks should default off for shared links.
- Chapter scrim: review recommends lightening it to about 0.4 (models at about 6-7:1). Pending Troy's decision.

**Change log**
- 2026-11-17: removed the outlined 01/02/03 numerals from the "Who we serve" chapters, at Troy's request (this also resolves review item m8). The `n` field in `chapters` is now unused.
- 2026-11-17: serve intro subtitle now breaks before "and shape what comes next" on desktop and tablet. The break is hidden at 760px and below, because there it left "what matters" on a line of its own.
- 2026-11-17: "Who we serve" and "What we do" pins now lock at `top: 64px` (the scrolled nav height) with height `calc(100svh - 64px)`. Fallback is `100vh` for browsers without svh. The 500px and 600px min-heights are gone.
  - Scroll progress and the focus-scroll helpers now use the real `innerHeight` instead of capping at 960px, which would have cut progress short on tall screens.
  - Verified at 1440x700, x900 and x1200: both pins sit at 64 to the viewport bottom, and the stage list fits inside.
  - At 760px and below, "Who we serve" stays unpinned and stacked, as before. Below 680px viewport height, "What we do" unpins, as set in the accessibility pass.
  - The pin scroll lengths (400 and 300 `--vh`) are still capped at 960px.
- 2026-11-17: close headline set as "Start with the / responsibility / in front of you." on all widths.
- 2026-11-17: close route CTAs 8px smaller: `clamp(18px, calc(1.95vw - 8px), 22px)`, which is 20px at 1440. The 18px floor stops the mobile size dropping to 13px.
- 2026-11-17: removed the 8px dark border from the property carousel detail insets.
- 2026-11-17: **Link targets removed site-wide.** All 47 `href="#"` became `tabindex="0" role="link"`, with `a:not([href]){cursor:pointer}`. Hover and focus states are unchanged, and keyboard Tab still reaches every link (focus ring verified).
  - **Production must restore real `href`s and drop the `tabindex` and `role` attributes.** Anchors without an `href` are a stopgap for a review build.
  - Kept: the skip link (`#main`, invisible until focused, WCAG 2.4.1), the Google Fonts `<link>` stylesheet tags, and the review-only Tweaks jump links.
  - The `href: '#'` fields in the component data are now dead.
- 2026-11-17: `#serve` section background changed from #111512 to #FAF8F4. When the pin locked, the section's own dark ground was what sat behind the 94%-opaque nav, so the nav visibly went darker. It now matches the light ground behind the nav on the sections around it.
- 2026-11-17: "What we do" headline set as "Start with the challenge / in front of you." on all widths.
- 2026-11-17: Extend cards: each image now runs exactly 12px above and below its text block. The card uses `align-items: stretch`, the image is absolutely positioned with cover fill, and the text has 12px top and bottom padding. Each card sizes to its own content, so the two images can differ in height (219px and 192px at 1440). At 760px and below the image still stacks above the text at 16:10.
- 2026-11-17: "What we do" gap under the headline raised 40%, from 40px to 56px (`margin-bottom: 16px` on `#do-h`).
- 2026-11-17: removed the "Extend the experience" label above the two Extend cards. The top rule and 40px padding above the cards remain.
- 2026-11-17: "How we operate": the two labels ("The people and the experience", "The business behind it") are now ghost-button CTAs matching "See how we operate". Three equal buttons, 12px apart when stacked at 760px and below. Arrow colours: sage, orange, orange.
- 2026-11-17: "How we operate" green band now carries `assets/prop-streamsong.jpg` behind it at 10% opacity (cover fill, scale 1, decorative, `alt=""`). The image is 1500px wide, so it would be soft at full strength; at 10% that doesn't show.
- 2026-11-17: "Who we serve" chapter scrim (desktop) is now a single bottom-up gradient: 0.92 at the bottom, 0.82 at 30%, 0.45 at 55%, clear by 80%. The left-to-right darkening layer is gone. The mobile scrim was already darkest at the bottom and is unchanged.
  - **Accessibility:** this invalidates the chapter contrast figures from the 2026-11-16 audit. The top line of the text block (the gold chapter label) now sits on roughly 0.6 scrim instead of about 0.8. Re-measure before anything goes public.
- 2026-11-17: all eyebrows now match the "Who we serve" chapter labels: uppercase with 0.06em tracking, weight 700. That covers "How we operate", the Extend card kinds, the "What we do" stage image tag, and the three footer column heads.
- 2026-11-17: H2 line-height is 1.2 everywhere (the `.h2` class plus the serve, operate, properties and close headings, which were 1.04 to 1.15).
- 2026-11-17: "How we operate" background swapped to `assets/operate-bg.jpg`, a palm-lined desert green that appears nowhere else on the page. Source: `~/Downloads/cover-kemper.jpg` (1700x2200, portrait), set at cover with `object-position: 50% 45%` and 10% opacity. Every image in the original asset folder was already in use. **Licensing:** this file came from Downloads with no provenance; confirm it's a KemperSports-owned or licensed image.
- 2026-11-17: `Main.dc.html` renamed to `index.html`, replacing the redirect stub, so the GitHub Pages root serves the homepage directly. `canvas.json` and the README are updated to match. The local URL is now http://localhost:8082/ .
- 2026-11-18: **New primary navigation.** Our Range, Who We Serve, What We Do (dropdowns, no overview), Results and About (top link to their overview page plus a separate chevron button for the dropdown), and Properties (plain link). Two typos in the supplied list were corrected: "Owners & Investors)" and "Out Commitment" became "Owners & Investors" and "Our Commitment".
  - Desktop: simple dark lists (#111512, 2px orange top rule, orange left tick on hover and focus). They open on hover or click, and close on mouse-out after 180ms, an outside click, Escape (focus returns to the trigger), focus leaving the item, or choosing a link. Triggers are buttons with `aria-expanded` and `aria-controls` (disclosure pattern, not ARIA menu roles).
  - Mobile menu: an accordion with one section open at a time. Results and About keep their label as a link with the chevron as its own 52px button.
  - Nav labels don't wrap. The gap scales from 14px to 26px; measured to fit at 1001, 1024, 1100 and 1280. The hamburger still takes over at 1000px and below.
  - Not yet audited by accessibility-agent; tested in headless Chrome only. The pre-change file is at `/private/tmp/…/scratchpad/index.before-nav.html` (temporary location).
  - ~~The footer link columns still follow the old IA.~~ **Resolved 2026-11-18**, see below.
- 2026-11-18: footer realigned to the new nav in one `<nav aria-label="Footer">` with four columns: Our Range over Who We Serve, then What We Do, then Results over Properties, then About. Results, Properties and About headings are links to their overview pages, with an orange underline on hover and focus; the other headings are plain labels. Layout: brand column beside the four columns above 1000px; brand above them from 1000px down; two columns at 760px and below. The old "Services", "Fire Pit Productions", "News", "KemperClub" links are gone. KemperClub and Fire Pit Productions no longer appear anywhere in the footer, so confirm with the client that this is intended.
- 2026-11-18: desktop dropdowns are now cream (#FAF8F4) with dark text (#1E2B22), a hover/focus tint of rgba(30,43,34,.06), the orange left tick in #CF5D13, and a dark focus ring. They now **open on click only**; hover no longer opens them. They still close on outside click, Escape, focus leaving or choosing a link. The mobile menu sub-lists stay dark inside the dark menu.
- 2026-11-18: clicking any top-level nav label now opens its dropdown. Click it again or click outside to close; clicking another label switches menus. Results and About are now plain dropdown triggers, so their overview pages are reached through new first items, "Results Overview" and "About Overview". This applies to the mobile accordion too. **Dead code:** the `isSplit` branch (label link plus separate chevron button, `.dd-chev`, `.m-chev`) is now unused; remove it at build.
- 2026-11-18: repo transferred from `troywoodland-verb/kemper` to `verb-design/kemper`. GitHub Pages is now at https://verb-design.github.io/kemper/ . The old Pages URL no longer serves the site. GitHub redirects the old repo URL to the new one.
- 2026-11-18: added the H2 "One Company. Expertise for Every Place." above the Golf, Sports Venues and Live Events cards. It uses the `.h2` style, sits on the cards' 48px gutter (20px on mobile), and the card group is now labelled by it (`aria-labelledby="range-h"`). The gap is 112px above the headline and 48px to the cards (72 and 32 on mobile). Copy is client-supplied; title case kept as given.
- 2026-11-18: range headline centered, with `text-wrap: balance` so the two lines are even on mobile.
- 2026-11-19: the intro line "We manage golf courses, private clubs, resorts and sports venues to a hospitality standard people can feel and owners can measure." moved from the proof section into the hero, under the H1. It's 17-20px, #E8ECE9, max 720px, breaking after "venues" on desktop. This resolves the review item about the first screen never saying what KemperSports does.
  - **Accessibility:** the line sits on the hero's bottom scrim (0.85 at the bottom edge) over moving video. It's not measured; the worst-frame check from 2026-11-16 covered the H1 and nav only.
- 2026-11-19: hero is now a true `110vh` (`110svh` where supported), still min 720px. It was `calc(110 * var(--vh))`, which capped at 1056px on tall screens. The pause button now sits at `100svh - 124px`, so it stays inside the first screen.
- 2026-11-19: proof intro rebalanced after the line moved out. The left column now spreads across the height of the stat list (`justify-content: space-between`, 40px minimum gaps, the -24px pulls removed). The H2 lines up with "$3B+", and "View Case Studies" lines up with the last stat.
- 2026-11-19: **Mega-menu** built from Figma node 3691:48007 ("Megamenu-what-we-do", file KemperSports (2026)), in cream (#FAF8F4) instead of the Figma green. It's a full-width panel under the header:
  - Header row: serif section title, an "Overview" link for Results and About only (per the IA; the Figma frame shows Overview on What We Do too), and a close ×.
  - Body: image cards for the first items (3:2, cover fill, scale 1), plus a chevron link list with hairlines for the rest. Menus with 3 items show 3 cards; What We Do and About show 2 cards and 4 links.
  - The header goes solid while a menu is open. Click to open and close; it also closes on outside click, Escape and the × button, and focus returns to the trigger.
  - The mobile accordion keeps its simple list, now with an "Overview" first item for Results and About; the old "Results Overview" and "About Overview" desktop items are gone.
  - Card imagery reuses page assets as stand-ins. The `isSplit` dead code is removed.
  - Pre-change copy at `/private/tmp/…/scratchpad/index.before-mega.html`.
- 2026-11-19: **Tweaks panel removed** (markup between TWEAKS:START/END). The `tw` state and `tw*` render values in the logic are now dead code.
- 2026-11-19: **Results section** added after the range cards: "Results you can count on." (Troy wrote "Result you can count on"; pluralised to match the section name; confirm). Image left (crossfades per slide), a carousel of result cards right, prev/next and counter top right, arrow keys work. Slides crossfade instead of sliding, and hidden slides use `visibility: hidden` so their links leave the tab order. Stacks image-over-card at 760px and below.
  - **Content accuracy, needs client approval before anything goes out.** Metrics come from KemperSports' own case studies (kempersports.com/results, 2022, self-reported). The quotes come from separate **selection or renewal announcements**, not from results, so every card pairs a results number with an older quote about choosing KemperSports:
    1. Galloping Hill GC, 300%+ total revenue growth 2009–2021. Quote: Alexander Mirabella, Union County Freeholder Chairman, 2009 (thegolfwire.com).
    2. Village Club of Sands Point, 250% golf membership growth over four years. Quote: Mayor Edward Adler, 2017 (kempersports.com). The quote is truncated in the source and ends with an ellipsis; pull the full sentence.
    3. Streamsong Resort, 10% average room rate gain 2021 vs 2019. Quote: Ben Pratt, The Mosaic Company, Jan 2021 (firstcallgolf.com). **Risk:** KemperSports bought Streamsong from Mosaic in Jan 2023, so Mosaic is a former owner-client.
    4. Forest Creek GC, 58% rounds growth FY2019–FY2021. Quote: Mayor Alan McGraw, City of Round Rock, Dec 2016 (roundrocktexas.gov).
    5. Desert Willow, 99th percentile in the NGF customer survey, 2021. Quote: Mayor Jan Harnik, Palm Desert, Aug 2022 (renewal release, firstcallgolf.com). The quote praises the asset, not KemperSports directly.
  - Images on cards 2 and 4 (serve-clubs, serve-cities) are stand-ins, not confirmed photos of those properties.
  - Recommendation: ask KemperSports for approved results-led client testimonials and replace these pairings.
  - Backup options not used: Modesto (2025 record net income, from city minutes, needs manual check), The Governors Club, Chambers Bay, Sand Creek Station.
- 2026-11-19: proof stat dividers optically centred. The list no longer uses `justify-content: space-between` (which put the spare height below each rule), and paddings are set per item (30 / 34+34 / 34) so there is 36px of clear space from text ink to each rule on both sides. Pixel-measured at 1440 (36/36, 36/36) and 1024 (36/36, 35/36). These values depend on the current stat copy (descenders in "Golfweek … public"), so re-measure if it changes.
- 2026-11-19: "Who we serve" chapters: removed the Proof line and the white keyline above it. Only the CTA remains under the copy, and the `proof` field in `chapters` is now unused. The scrim on both desktop and mobile is now a single bottom-up gradient that is clear by 50% of the image height (desktop 0.9 → 0.72 at 25% → 0 at 50%; mobile 0.92 → 0.75 at 30% → 0 at 50%).
  - **Accessibility:** on desktop the gold chapter label and the top of the headline now sit around 40% up, where the scrim is roughly 0.3. Contrast there depends on the photo and is likely below AA on bright skies or buildings. Re-measure; a soft text-shadow or a slightly higher fade point is the fallback.
- 2026-11-19: Results cards: eyebrow removed. The outcome now sits beside the number, with the period on its own line (break, not a middot). 24px more space above and below the quote. The image column is wider: the grid is now 6fr image to 5fr card, was 5fr to 7fr.
- 2026-11-19: Results section ground changed from #FAF8F4 to white, so it continues the range cards' section. Top padding is now 0, since the range section's 120px bottom padding already separates them; 120px bottom padding is kept. The `sec-pad` class is removed from it so the mobile 80px top rule doesn't apply.
- 2026-11-19: mega-menu refinements. Card captions now match the right-hand links: 16px/600 #1E2B22 with an orange chevron. The links lose their 18px inset, so text starts flush with the keylines. Hover and focus no longer tint the background; the text turns orange (#B4500F) and the chevron slides 8px right (0.25s).
- 2026-11-19: Results carousel rebuilt as a centred, looping slide track. Each slide is image plus card; the previous and next slides peek at either side at 50% opacity, and clicking a peeking slide moves to it. Slide width is `min(1100px, 78vw)` with a 48px gap (mobile: `100vw - 56px`, 16px gap). The heading and arrows now align to the active slide's edges, not the page gutter.
  - The loop renders the slide set three times and snaps back to the middle copy after each 0.7s move, the same pattern as the property carousel.
  - Inactive slides are `aria-hidden` and their links are `tabindex="-1"`. Under reduced motion the move and fade are instant.
  - Verified at 1440 and 390: next, previous, wrap past either end, active slide centred, no sideways page scroll.
- 2026-11-19: results carousel gap tripled (48 to 144px desktop, 16 to 48px mobile), and neighbouring slides are now at 30% opacity. At 1440 this leaves only about 26px of each neighbour showing at the screen edge; more shows on wider screens.
