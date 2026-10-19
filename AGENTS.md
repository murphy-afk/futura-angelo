# AGENTS.md

Instructions for any AI agent or developer working in this repository.

Read ROADMAP.md first. It holds the project shape, the collected business data and the session
plan. This file holds the rules.

## Hard rules

These are absolute. A generated file that breaks any of them is rejected.

1. No emdashes. Use a comma, a colon, a period or parentheses instead. The character to avoid is
   the long dash used in place of punctuation. Hyphens inside compound words such as
   `point-of-sale` or `made-in-Italy` are fine.
2. No emojis. No pictographs, no symbol characters standing in for words, no decorative unicode.
   Plain text only.
3. No lines that contain only an angle bracket or a self closing tag. In JSX a tag and its closing
   part must stay on the same line as the content, or the element must be written across lines
   with real content on the inner lines. Never emit a line whose entire content is a lone angle
   bracket or a lone self closing tag.

These rules apply to source code, markup, CSS, SQL, Markdown, commit messages and comments.

## Language rules

The split is deliberate. Hold to it.

| Where | Language |
| --- | --- |
| Source code, identifiers, file names | English |
| Comments and docstrings | English |
| Commit messages | English |
| API responses and error strings | English |
| Environment variable names | English |
| SQL keywords, table names, column names | English |
| User facing page content | Italian |
| Meta titles and descriptions in `pages_meta` | Italian |
| Seed data for the shop, names and descriptions | Italian |
| Alt text on images | Italian |

So a component looks like this: an English file name, English props, English comments, and Italian
text between the tags. A log line is English. A JSON error key is English, its message is English.

## Copy rules

- The site language is Italian. All user facing strings are written in Italian.
- Use proper Italian typography: no space before a comma, period or colon.
- Write the shop name as `Futura` in headings and as `Futura di Lacalamita Angelo` when the full
  legal name is needed.
- Do not invent addresses, hours, phone numbers or product names. Take them from ROADMAP.md
  section 2. If a value is flagged as needing confirmation, do not ship it as final.
- No placeholder text. Never write lorem ipsum or sample words in a shipped component.
- The divorce bomboniera story from 1992 is the shop's only verified press coverage. Do not
  embellish it beyond what ROADMAP.md records.

## Code rules

- Stack is fixed: React with Vite, Express, MySQL 8 via `mysql2`, custom CSS.
- No CSS framework, no component library, no UI kit. Hand written CSS only.
- No utility class engine. Use semantic class names such as `.collection-grid` or `.site-footer`.
- Design tokens live in `client/src/styles/tokens.css` as CSS custom properties. Read colours,
  spacing and type sizes from tokens, never hardcode a hex value in a component.
- Keep the client and the server in separate folders with their own package.json.
- Server code uses CommonJS or ESM consistently, pick one at scaffold time and hold to it.
- SQL lives in numbered scripts under `db/sql`. The client runs them by hand in MySQL Workbench.
  Never edit a script that has already been run, write a new numbered script.
- Nothing in this repository creates, alters or drops tables. No ORM migrations, no schema
  creation from Node. The database schema is owned by the client in MySQL Workbench.
- All database access goes through `server/src/db`. No queries written inline in route handlers.
- Validate every request body with a schema before touching the database.
- The only public write endpoint is `POST /api/leads`. Treat it as hostile input.

## SEO rules

- Exactly one H1 per page.
- Every image has meaningful Italian alt text describing the actual object.
- Every route has a title and description from `pages_meta`. Do not hardcode meta tags in React
  components.
- Internal links use relative paths and real anchor text, never a bare URL as link text.
- Keep the HTML the crawler receives identical in meaning to what the user sees.

## Workflow rules

- Never commit without explicit permission. Ask first, then wait for a yes. If permission was
  given for one commit, it does not carry over to the next one.
- Never push, never force push, never merge, never create or delete branches, never tag a release
  without explicit permission for that specific action.
- Never `git add` or `git add -A` a path the client did not ask about. Check `git status` and read
  the diff before any staging.
- Prepare the change and report what is staged and what the commit message would be. The client
  decides whether it becomes a commit.
- Note that this repository may not even be a git repository yet. Do not run `git init` without
  asking.
- Follow the session order in ROADMAP.md. Do not start session 3 before session 0 assets arrive.
- One commit per logical change.
- Commit messages are minimal. One short line, lowercase, no trailing period, no body, no
  sign off, no emoji. Name the change and stop. Examples: `add collection grid`, `fix contact
  form validation`, `remove prettier`.
- Before finishing any task, run the linter and the build. Do not leave a broken build.
- When you change the database schema, update ROADMAP.md section 5 in the same change.
- When you add a page, add its row to `pages_meta` in the same change.

## Review checklist

Run this before declaring a task done.

- Search the changed files for the emdash character. Zero results expected.
- Search for emoji unicode ranges. Zero results expected.
- Scan JSX for lines whose entire content is an angle bracket or a self closing tag. Zero expected.
- Confirm no hardcoded hex colour outside `tokens.css`.
- Confirm no invented business data.
- Confirm the build passes.

## What not to do

- Do not add Next.js, SSR frameworks or state libraries unless the stack decision is formally
  changed in ROADMAP.md.
- Do not commit, push, merge or branch without being asked. Assume every commit needs fresh
  permission.
- Do not add a cart, prices or checkout. The shop sells only through authorised points of sale.
- Do not translate the site into English. Italian only, decided by the client.
- Do not add analytics or cookie banners without asking. If added later, keep them compliant with
  the GDPR and record the decision in ROADMAP.md.
- Do not delete or rewrite the collected business data in ROADMAP.md section 2 unless new data
  comes directly from the owner.
