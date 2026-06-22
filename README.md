# Chat Clipper

A userscript that adds **per-message copy buttons**, **selective multi-message copy**, and a **full chat export** to Arousr, OnlyFans, and Fansly.

## Features

- **Copy button on every message** — click to copy any individual message to the clipboard
- **Checkbox selection** — select multiple messages with checkboxes; use ▲ / ▼ range buttons to select entire blocks at once
- **Full chat export** — header buttons to copy the entire conversation (or your selection) in two formats:
  - Named format: `[UserName]` / `[AI name]` / `[NARRATOR]`
  - Generic format: `[USER]` / `[AI]` / `[NARRATOR]` (ready for AI roleplay/persona templates)
- **Greeting shortcut** — one-click button to insert a configurable greeting into the message box
- **Media narration** — images, videos, and tips appear as readable `[NARRATOR]` lines in exports
- Works with SPA navigation and virtual-scroll re-renders via MutationObserver

## Supported platforms

| Platform | URL pattern |
|----------|-------------|
| Arousr | `https://chat.arousr.com/*` |
| OnlyFans | `https://onlyfans.com/my/chats/*` |
| Fansly | `https://fansly.com/messages/*` |

## Installation

1. Install a userscript manager: [Tampermonkey](https://www.tampermonkey.net/) (recommended) or [Violentmonkey](https://violentmonkey.github.io/)
2. Click **[Install script](https://raw.githubusercontent.com/damoscodehub/chat-clipper/main/chat-clipper.user.js)** — your manager will prompt you to confirm
3. Navigate to any supported platform and the buttons will appear automatically

## Configuration

Open the script in your userscript manager's editor and adjust the constants near the top of the file:

| Constant | Default | Description |
|----------|---------|-------------|
| `INCLUDE_DATETIME` | `false` | Append timestamps to each line in exports (Arousr only) |
| `GREETING_TEXT` | *(see script)* | Text inserted by the wave / greeting button |

## License

MIT — see [LICENSE](LICENSE)
