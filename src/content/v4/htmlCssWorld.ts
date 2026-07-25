import type { CurriculumWorldSpec } from "../_shared/defineLesson";
import { structureBonus, structureTask } from "./lessonTools";

export const htmlCssV4World: CurriculumWorldSpec = {
  id: "interface-reactor",
  title: "Interface Reactor",
  subtitle: "Engineer adaptive, token-driven, motion-safe interfaces",
  description:
    "Turn individual layouts into a coherent design system with semantic forms, container-aware components, controlled motion, and a complete responsive command surface.",
  landmark: "The Adaptive Prism",
  accent: "lime",
  lessons: [
    {
      id: "html-css-design-tokens",
      title: "Token Spectrum",
      subtitle: "Centralize interface decisions with custom properties",
      objectives: [
        "Define semantic CSS custom properties",
        "Compose tokens with color-mix and fallbacks",
        "Switch themes without rewriting component rules",
      ],
      conceptHeading: "Design tokens separate visual decisions from component structure",
      explanation: [
        "CSS custom properties store reusable values in the cascade. Semantic names such as --surface-panel and --text-muted explain purpose more clearly than names tied to one literal color.",
        "A theme overrides tokens at a high-level selector while component rules continue consuming the same contract. Fallback values make isolated components resilient.",
      ],
      bullets: [
        "Define global defaults on :root.",
        "Name tokens by role rather than raw color.",
        "Override a small semantic set for alternate themes.",
      ],
      syntax:
        ":root { --surface-panel: #10231d; }\n.card { background: var(--surface-panel, #111); }",
      example: {
        title: "One component, two field modes",
        description:
          "The component reads semantic tokens rather than theme-specific colors.",
        code: '<style>\n:root { --panel: #10231d; --ink: #eff8ee; }\n[data-theme="light"] { --panel: #f2efe4; --ink: #183027; }\n.card { background: var(--panel); color: var(--ink); padding: 1rem; }\n</style>\n<article class="card">Signal online</article>',
      },
      fieldNote:
        "Tokens do not replace the cascade; they make its decisions legible. Keep override scope deliberate and inspect computed values.",
      mistakes: [
        "Naming a semantic token --green even when themes change its hue.",
        "Defining every one-off measurement as a global token.",
        "Using a custom property without a fallback in portable components.",
      ],
      tasks: [
        structureTask(
          {
            id: "html-css-tokens-core",
            title: "Build a semantic token contract",
            description:
              "Define surface, text, accent, and spacing tokens on :root and consume all four in .signal-card.",
            expectedBehavior: "The preview renders a token-driven signal card.",
            starterCode:
              '<style>\n:root {\n  /* Define semantic tokens */\n}\n.signal-card {\n  /* Consume the token contract */\n}\n</style>\n<article class="signal-card">NEXUS / ONLINE</article>',
            hints: [
              "Use declarations beginning with -- inside :root.",
              "Consume values through var(--token-name).",
            ],
          },
          ":root\\s*\\{[\\s\\S]*--surface[\\w-]*\\s*:[\\s\\S]*--text[\\w-]*\\s*:[\\s\\S]*--accent[\\w-]*\\s*:[\\s\\S]*--space[\\w-]*\\s*:[\\s\\S]*\\.signal-card\\s*\\{[\\s\\S]*var\\s*\\(\\s*--surface[\\w-]*\\s*\\)[\\s\\S]*var\\s*\\(\\s*--text[\\w-]*\\s*\\)[\\s\\S]*var\\s*\\(\\s*--accent[\\w-]*\\s*\\)[\\s\\S]*var\\s*\\(\\s*--space[\\w-]*\\s*\\)",
        ),
        structureTask(
          {
            id: "html-css-tokens-theme",
            title: "Add a field-mode override",
            description:
              "Create [data-theme='light'] overrides and give the component a token fallback.",
            expectedBehavior:
              "The same card can switch themes without changing its component selector.",
            starterCode:
              '<main data-theme="light">\n  <article class="module">Adaptive module</article>\n</main>\n<style>\n:root {\n  --module-bg: #07110f;\n  --module-ink: #f1f6eb;\n}\n/* Add light overrides */\n.module {\n  background: var(--module-bg);\n  color: var(--module-ink);\n}\n</style>',
            hints: [
              "Target [data-theme='light'] in CSS.",
              "Fallback syntax is var(--name, fallback).",
            ],
          },
          "\\[data-theme\\s*=\\s*[\"']light[\"']\\]\\s*\\{[\\s\\S]*--module-bg\\s*:[\\s\\S]*--module-ink\\s*:[\\s\\S]*\\.module\\s*\\{[\\s\\S]*var\\s*\\(\\s*--module-bg\\s*,[^)]*\\)",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "html-css-tokens-bonus",
          title: "Derive a signal border",
          description:
            "Use color-mix with the accent token to create a restrained border color.",
          expectedBehavior: "The card border is derived from the active theme accent.",
          starterCode:
            '<style>\n:root { --accent: #b7f36b; --panel: #10231d; }\n.relic {\n  background: var(--panel);\n  /* Derive a translucent accent border */\n}\n</style>\n<article class="relic">Recovered relic</article>',
          hints: [
            "Use color-mix(in srgb, var(--accent) ..., transparent).",
            "Apply the mixed color to border.",
          ],
        },
        "\\.relic\\s*\\{[\\s\\S]*border\\s*:[^;]*color-mix\\s*\\(\\s*in\\s+srgb\\s*,\\s*var\\s*\\(\\s*--accent\\s*\\)",
        "The Token Spectrum derives a new visual state without adding another hard-coded color.",
      ),
      durationMinutes: 30,
    },
    {
      id: "html-css-container-queries",
      title: "Local Horizons",
      subtitle: "Make components respond to their own space",
      objectives: [
        "Declare an inline-size query container",
        "Write a component-scoped @container rule",
        "Combine fluid sizing with local breakpoints",
      ],
      conceptHeading: "Container queries adapt a component to where it is placed",
      explanation: [
        "Viewport media queries answer how large the browser is. Container queries answer how much space a particular component has inside its current layout.",
        "Declare container-type on a parent, then place component changes inside @container. This makes a card portable between a sidebar, grid, and full-width panel.",
      ],
      bullets: [
        "Use container-type: inline-size for width queries.",
        "Query the nearest eligible ancestor.",
        "Keep the narrow layout as the resilient default.",
      ],
      syntax:
        ".card-shell { container-type: inline-size; }\n@container (min-width: 32rem) { .card { grid-template-columns: auto 1fr; } }",
      example: {
        title: "Portable expedition card",
        description: "The card changes layout when its host becomes wide enough.",
        code: '<style>\n.host { container-type: inline-size; }\n.card { display: grid; gap: 1rem; }\n@container (min-width: 30rem) {\n  .card { grid-template-columns: 5rem 1fr; }\n}\n</style>\n<div class="host"><article class="card"><b>PY</b><p>Graph Nexus</p></article></div>',
      },
      fieldNote:
        "A container cannot normally size itself from the contents it is querying. Put container-type on a stable wrapper.",
      mistakes: [
        "Declaring container-type on the component that needs to query itself.",
        "Using @media when reusability depends on host width.",
        "Removing a functional narrow default.",
      ],
      tasks: [
        structureTask(
          {
            id: "html-css-container-card",
            title: "Build a locally adaptive card",
            description:
              "Make .card-host a query container and switch .track-card to two columns above 32rem.",
            expectedBehavior: "The card stacks in narrow hosts and splits in wide hosts.",
            starterCode:
              '<style>\n.card-host {\n  /* Establish a query container */\n}\n.track-card {\n  display: grid;\n  gap: 1rem;\n  padding: 1rem;\n  border: 1px solid #69d6cf;\n}\n/* Add the local breakpoint */\n</style>\n<div class="card-host">\n  <article class="track-card"><strong>JS</strong><p>Temporal Relay</p></article>\n</div>',
            hints: [
              "Set container-type: inline-size on .card-host.",
              "Use @container (min-width: 32rem).",
            ],
          },
          "\\.card-host\\s*\\{[\\s\\S]*container-type\\s*:\\s*inline-size[\\s\\S]*@container\\s*\\(\\s*min-width\\s*:\\s*32rem\\s*\\)[\\s\\S]*\\.track-card\\s*\\{[\\s\\S]*grid-template-columns\\s*:",
        ),
        structureTask(
          {
            id: "html-css-container-fluid",
            title: "Combine local and fluid scale",
            description:
              "Give the title a clamp-based size, then increase its maximum inside a named wide container.",
            expectedBehavior:
              "Typography scales fluidly and responds to the component's named host.",
            starterCode:
              '<style>\n.instrument {\n  container-type: inline-size;\n  /* Name this container field */\n}\n.instrument h2 {\n  /* Add a fluid clamp size */\n}\n/* Query the named container above 40rem */\n</style>\n<section class="instrument"><h2>Adaptive Prism</h2></section>',
            hints: [
              "Use container-name: field.",
              "Named query syntax begins @container field (...).",
            ],
          },
          "\\.instrument\\s*\\{[\\s\\S]*container-(?:name|type)[\\s\\S]*container-(?:name|type)[\\s\\S]*\\.instrument\\s+h2\\s*\\{[\\s\\S]*font-size\\s*:\\s*clamp\\s*\\([\\s\\S]*@container\\s+field\\s*\\(\\s*min-width\\s*:\\s*40rem\\s*\\)",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "html-css-container-bonus",
          title: "Container query units",
          description:
            "Use cqi units inside a clamp to size the card title relative to its host.",
          expectedBehavior:
            "The title responds to the query container rather than the viewport.",
          starterCode:
            '<style>\n.host { container-type: inline-size; }\n.host h2 {\n  /* Use a container-relative middle value */\n}\n</style>\n<div class="host"><h2>Local signal</h2></div>',
          hints: [
            "cqi is one percent of the container's inline size.",
            "Use it as the preferred value inside clamp().",
          ],
        },
        "font-size\\s*:\\s*clamp\\s*\\([^,]+,\\s*[^,]*cqi\\s*,",
        "The Local Horizon now scales from its immediate spatial context.",
      ),
      durationMinutes: 32,
    },
    {
      id: "html-css-accessible-forms",
      title: "Input Protocol",
      subtitle: "Design forms with visible and machine-readable contracts",
      objectives: [
        "Associate every control with a label",
        "Connect descriptions and errors with ARIA",
        "Group related choices semantically",
      ],
      conceptHeading: "An accessible form explains purpose, state, and recovery",
      explanation: [
        "A visible label gives a control its accessible name and a larger click target. Helper text and validation messages provide extra context when referenced by aria-describedby.",
        "Use fieldset and legend for related choices. Native required and input types provide useful semantics before custom validation is added.",
      ],
      bullets: [
        "Keep placeholder text supplementary, not the only label.",
        "Reference persistent help and active errors by id.",
        "Move focus to a useful recovery point after failed submission.",
      ],
      syntax:
        '<label for="callsign">Call sign</label>\n<input id="callsign" aria-describedby="callsign-help" required>\n<small id="callsign-help">3–20 characters</small>',
      example: {
        title: "Labeled coordinate input",
        description: "Name, requirement, and supporting instruction are all connected.",
        code: '<label for="sector">Sector code</label>\n<input id="sector" name="sector" required aria-describedby="sector-help">\n<small id="sector-help">Use the NX-00 format.</small>',
      },
      fieldNote:
        "aria-invalid communicates a state but does not explain the error. Pair it with visible, referenced recovery text.",
      mistakes: [
        "Using placeholder as the only accessible name.",
        "Adding aria-label that conflicts with the visible label.",
        "Showing color-only error states.",
      ],
      tasks: [
        structureTask(
          {
            id: "html-css-form-contract",
            title: "Connect a complete field contract",
            description:
              "Add a label, required email input, helper text, and aria-describedby connection.",
            expectedBehavior:
              "The field has a visible name, native email semantics, and announced help.",
            starterCode:
              '<form>\n  <!-- Build the operator email field -->\n  <button type="submit">Join expedition</button>\n</form>',
            hints: [
              "The label for value must equal the input id.",
              "aria-describedby must reference the helper element id.",
            ],
          },
          "<label\\s+[^>]*for\\s*=\\s*[\"']operator-email[\"'][^>]*>[\\s\\S]*<input\\s+[^>]*id\\s*=\\s*[\"']operator-email[\"'][^>]*type\\s*=\\s*[\"']email[\"'][^>]*required[^>]*aria-describedby\\s*=\\s*[\"']email-help[\"'][^>]*>[\\s\\S]*id\\s*=\\s*[\"']email-help[\"']",
        ),
        structureTask(
          {
            id: "html-css-form-errors",
            title: "Expose a recoverable error",
            description:
              "Mark the field invalid and connect both help and error text through aria-describedby.",
            expectedBehavior:
              "Assistive technology can discover the invalid state and its recovery message.",
            starterCode:
              '<label for="coordinate">Coordinate</label>\n<input id="coordinate" value="3" />\n<small id="coordinate-help">Format: NX-00</small>\n<!-- Add a visible error and connect both descriptions -->',
            hints: [
              "Set aria-invalid='true' on the input.",
              "aria-describedby accepts a space-separated id list.",
            ],
          },
          "<input\\s+[^>]*id\\s*=\\s*[\"']coordinate[\"'][^>]*aria-invalid\\s*=\\s*[\"']true[\"'][^>]*aria-describedby\\s*=\\s*[\"'][^\"']*coordinate-help[^\"']*coordinate-error[^\"']*[\"'][^>]*>[\\s\\S]*id\\s*=\\s*[\"']coordinate-error[\"'][^>]*>",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "html-css-form-bonus",
          title: "Group expedition choices",
          description: "Create a fieldset with legend and three same-name radio choices.",
          expectedBehavior: "The language choices form one named, keyboard-native group.",
          starterCode:
            "<form>\n  <!-- Group Python, JavaScript, and Web choices -->\n</form>",
          hints: [
            "Use fieldset and legend.",
            "Every radio input shares name='track' and has a label.",
          ],
        },
        "<fieldset[^>]*>[\\s\\S]*<legend[^>]*>[\\s\\S]*(?:type\\s*=\\s*[\"']radio[\"'][^>]*name\\s*=\\s*[\"']track[\"'][\\s\\S]*){3}[\\s\\S]*</fieldset>",
        "The Input Protocol exposes a complete, keyboard-native expedition choice matrix.",
      ),
      durationMinutes: 30,
    },
    {
      id: "html-css-motion-systems",
      title: "Motion Physics",
      subtitle: "Animate state without compromising access or performance",
      objectives: [
        "Animate transform and opacity",
        "Use motion to explain state",
        "Provide a reduced-motion path",
      ],
      conceptHeading: "Interface motion should communicate causality and remain optional",
      explanation: [
        "Transform and opacity usually animate without forcing layout recalculation. Motion can connect an action to its result, reveal hierarchy, or preserve spatial context.",
        "prefers-reduced-motion lets the interface remove non-essential movement. A reduced path should preserve every state change and interaction.",
      ],
      bullets: [
        "Animate compositor-friendly properties.",
        "Avoid infinite motion around reading and editing surfaces.",
        "Disable smooth scrolling and decorative animation when requested.",
      ],
      syntax:
        "@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { animation-duration: 0.01ms; }\n}",
      example: {
        title: "State transition with a safe fallback",
        description:
          "The signal enters with transform and becomes immediate when reduced.",
        code: '<style>\n.signal { animation: enter 500ms ease-out both; }\n@keyframes enter { from { opacity: 0; transform: translateY(1rem); } }\n@media (prefers-reduced-motion: reduce) { .signal { animation: none; } }\n</style>\n<p class="signal">Recovered</p>',
      },
      fieldNote:
        "Reduced motion is a functional preference. Avoid replacing a long animation with another long animation of a different property.",
      mistakes: [
        "Animating width or top for purely visual movement.",
        "Using motion as the only indication of changed state.",
        "Leaving parallax or smooth scrolling active under reduced motion.",
      ],
      tasks: [
        structureTask(
          {
            id: "html-css-motion-entry",
            title: "Animate a stable entry",
            description:
              "Create a named keyframe that animates only opacity and transform, then apply it with both fill mode.",
            expectedBehavior:
              "The module enters smoothly without animating layout dimensions.",
            starterCode:
              '<style>\n.module {\n  /* Apply the entry animation */\n}\n/* Define the animation */\n</style>\n<article class="module">Signal stabilized</article>',
            hints: [
              "Use @keyframes and animation.",
              "The from frame can combine opacity and translateY.",
            ],
          },
          "\\.module\\s*\\{[\\s\\S]*animation\\s*:[^;]*both[\\s\\S]*@keyframes\\s+[\\w-]+\\s*\\{[\\s\\S]*opacity\\s*:[\\s\\S]*transform\\s*:",
        ),
        structureTask(
          {
            id: "html-css-motion-reduced",
            title: "Add the reduced-motion circuit",
            description:
              "Disable the orbit animation and smooth scrolling when reduced motion is requested.",
            expectedBehavior:
              "The same content remains available with immediate state changes.",
            starterCode:
              '<style>\nhtml { scroll-behavior: smooth; }\n.orbit { animation: spin 8s linear infinite; }\n@keyframes spin { to { transform: rotate(1turn); } }\n/* Add the reduced-motion override */\n</style>\n<div class="orbit">NX</div>',
            hints: [
              "Use @media (prefers-reduced-motion: reduce).",
              "Set scroll-behavior: auto and animation: none.",
            ],
          },
          "@media\\s*\\(\\s*prefers-reduced-motion\\s*:\\s*reduce\\s*\\)[\\s\\S]*html\\s*\\{[\\s\\S]*scroll-behavior\\s*:\\s*auto[\\s\\S]*\\.orbit\\s*\\{[\\s\\S]*animation\\s*:\\s*none",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "html-css-motion-bonus",
          title: "Motion-safe 3D card",
          description:
            "Add a hover perspective transform only for users who have not requested reduced motion.",
          expectedBehavior:
            "Pointer users receive a restrained depth cue while reduced-motion users do not.",
          starterCode:
            '<style>\n.card { transition: transform 200ms ease; }\n/* Add an allowed-motion hover enhancement */\n</style>\n<article class="card">3D coordinate</article>',
          hints: [
            "Use @media (prefers-reduced-motion: no-preference).",
            "Apply perspective(...) rotateX(...) to .card:hover.",
          ],
        },
        "@media\\s*\\(\\s*prefers-reduced-motion\\s*:\\s*no-preference\\s*\\)[\\s\\S]*\\.card:hover\\s*\\{[\\s\\S]*transform\\s*:[^;]*perspective\\s*\\([^)]*\\)[^;]*rotate[XY]",
        "The Motion Physics chamber grants depth only when the operator has allowed it.",
      ),
      durationMinutes: 30,
    },
    {
      id: "html-css-interface-capstone",
      title: "Adaptive Prism",
      subtitle: "Assemble a production-grade command surface",
      objectives: [
        "Compose semantic landmarks and reusable components",
        "Combine Grid, container queries, and tokens",
        "Verify focus, motion, and responsive contracts",
      ],
      conceptHeading: "A design system becomes real when its contracts cooperate",
      explanation: [
        "The capstone combines semantic structure, reusable token-driven panels, locally adaptive cards, and accessible interaction states. Each technique should solve one clear responsibility.",
        "A production interface also needs visible focus, resilient narrow layouts, reduced motion, and meaningful empty or error states—not only a polished wide-screen screenshot.",
      ],
      bullets: [
        "Start with landmarks and reading order.",
        "Use tokens for shared decisions and containers for local adaptation.",
        "Test keyboard focus at 320 px before adding visual depth.",
      ],
      syntax:
        '<header>…</header>\n<main><section aria-labelledby="status-title">…</section></main>\n<footer>…</footer>',
      example: {
        title: "Semantic command skeleton",
        description: "Landmarks and labeled sections establish the document contract.",
        code: '<header><nav aria-label="Primary">…</nav></header>\n<main>\n  <section aria-labelledby="missions-title">\n    <h1 id="missions-title">Mission control</h1>\n  </section>\n</main>\n<footer>Local progress</footer>',
      },
      fieldNote:
        "Visual novelty is strongest when it rides on a conventional interaction contract. Users should never need to decode how a button or form works.",
      mistakes: [
        "Reordering visual cards in a way that breaks logical focus order.",
        "Adding a desktop breakpoint before the narrow layout works.",
        "Using animation and color as the only status indicators.",
      ],
      tasks: [
        structureTask(
          {
            id: "html-css-capstone-structure",
            title: "Assemble the command skeleton",
            description:
              "Create header/nav, main with two labeled sections, and footer; include a skip link to main.",
            expectedBehavior:
              "The preview has navigable landmarks and a keyboard skip target.",
            starterCode:
              "<!-- Build the semantic command surface -->\n<style>\n/* Add a visible-on-focus skip link */\n</style>",
            hints: [
              "The skip link href must reference the main id.",
              "Give each section an accessible heading relationship.",
            ],
          },
          "<a\\s+[^>]*href\\s*=\\s*[\"']#main-content[\"'][^>]*>[\\s\\S]*<header[^>]*>[\\s\\S]*<nav\\s+[^>]*aria-label[\\s\\S]*<main\\s+[^>]*id\\s*=\\s*[\"']main-content[\"'][\\s\\S]*(?:<section\\s+[^>]*aria-labelledby[^>]*>[\\s\\S]*){2}[\\s\\S]*<footer[^>]*>",
        ),
        structureTask(
          {
            id: "html-css-capstone-system",
            title: "Activate the responsive system",
            description:
              "Add root tokens, a Grid dashboard, a card query container, and a visible focus rule.",
            expectedBehavior:
              "The command surface is themed, adaptive, and keyboard-legible.",
            starterCode:
              '<style>\n:root {\n  /* Core tokens */\n}\n.dashboard {\n  /* Responsive grid */\n}\n.card-host {\n  /* Local query container */\n}\n/* Local card breakpoint and focus treatment */\n</style>\n<main class="dashboard">\n  <div class="card-host"><a class="card" href="#python">Python</a></div>\n  <div class="card-host"><a class="card" href="#web">Web</a></div>\n</main>',
            hints: [
              "Use repeat(auto-fit, minmax(...)) for the dashboard.",
              "Use :focus-visible with an outline.",
            ],
          },
          ":root\\s*\\{[\\s\\S]*--[\\w-]+\\s*:[\\s\\S]*\\.dashboard\\s*\\{[\\s\\S]*display\\s*:\\s*grid[\\s\\S]*repeat\\s*\\(\\s*auto-fit[\\s\\S]*\\.card-host\\s*\\{[\\s\\S]*container-type\\s*:\\s*inline-size[\\s\\S]*@container[\\s\\S]*:focus-visible\\s*\\{[\\s\\S]*outline\\s*:",
        ),
      ],
      bonusTask: structureBonus(
        {
          id: "html-css-capstone-bonus",
          title: "Complete the production prism",
          description:
            "Add light/dark token overrides, motion-safe depth, and a 320px-safe layout in one preview.",
          expectedBehavior:
            "The capstone demonstrates theme, responsiveness, depth, and accessibility contracts.",
          starterCode:
            '<main data-theme="night" class="prism">\n  <article class="prism-card" tabindex="0">NEXUS CORE</article>\n</main>\n<style>\n:root { --surface: #f2efe4; --ink: #143128; }\n/* Add night tokens, card layout, allowed-motion depth, and a narrow query */\n</style>',
          hints: [
            "Override tokens with [data-theme='night'].",
            "Use no-preference for 3D motion and max-width: 320px for the narrow contract.",
          ],
        },
        "\\[data-theme\\s*=\\s*[\"']night[\"']\\][\\s\\S]*@media\\s*\\(\\s*prefers-reduced-motion\\s*:\\s*no-preference\\s*\\)[\\s\\S]*perspective\\s*\\([\\s\\S]*@media\\s*\\(\\s*max-width\\s*:\\s*320px\\s*\\)",
        "The Adaptive Prism now survives theme, input, motion, and viewport changes as one coherent system.",
      ),
      durationMinutes: 48,
    },
  ],
};
