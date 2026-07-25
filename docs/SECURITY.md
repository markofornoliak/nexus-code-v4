# NEXUS security model

NEXUS is a static, client-only learning application. It has no backend, account
service, server actions, application secrets, or privileged network API. GitHub Pages
serves immutable build assets; progress and drafts remain in the learner's browser.

## Browser boundaries

- Python runs in a dedicated Web Worker. A timeout terminates runaway execution, and
  input, source, and output sizes are bounded.
- JavaScript runs in a fresh dedicated Worker with a four-second timeout and capped
  input/output.
- HTML/CSS renders in `iframe sandbox=""`. Scripts, same-origin privileges, forms,
  popups, downloads, and top-level navigation are not granted.
- Java and C++ are never evaluated. Their lessons perform local source-contract
  analysis.
- Learner output is rendered as text. The application does not pass it to
  `dangerouslySetInnerHTML`.

These controls protect application responsiveness and reduce accidental interaction
with the surrounding page. Client-side Workers are not equivalent to a hardened
multi-tenant server sandbox, so the application must never expose credentials to
learner code.

## Data boundaries

Progress import is size-limited, parsed as JSON, migrated sequentially, and validated
against a fixed schema. Imported data cannot add executable validators or curriculum
modules. Storage failures recover to a valid default state and show a visible notice.

## Dependency policy

Both CI and the GitHub Pages deployment run:

```bash
npm audit --omit=dev
```

The 2.0 release reported zero production dependency vulnerabilities on 25 July 2026.
The project uses a small internal hash router rather than a server-oriented routing
package, reducing bundle size and removing unused SSR/RSC attack surface.

## Reporting

Do not include private learner data in a public issue. Report a reproducible security
problem through the repository owner's private contact channel or GitHub private
vulnerability reporting when enabled.
