<<<<<<< HEAD
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/github/release/emacs-grammarly/unofficial-grammarly-language-server.svg?logo=github)](https://github.com/emacs-grammarly/unofficial-grammarly-language-server/releases/latest)
[![npm](https://img.shields.io/npm/v/@emacs-grammarly/unofficial-grammarly-language-server?logo=npm&color=green)](https://www.npmjs.com/package/@emacs-grammarly/unofficial-grammarly-language-server)
[![npm-dm](https://img.shields.io/npm/dm/@emacs-grammarly/unofficial-grammarly-language-server.svg)](https://npmcharts.com/compare/@emacs-grammarly/unofficial-grammarly-language-server?minimal=true)

# Grammarly

[![CI/CD](https://github.com/emacs-grammarly/unofficial-grammarly-language-server/actions/workflows/ci.yaml/badge.svg)](https://github.com/emacs-grammarly/unofficial-grammarly-language-server/actions/workflows/ci.yaml)
[![dependencies Status](https://status.david-dm.org/gh/emacs-grammarly/unofficial-grammarly-language-server.svg)](https://david-dm.org/emacs-grammarly/unofficial-grammarly-language-server)

> Update: Grammarly API is released, so this project will switch to official API. See https://github.com/znck/grammarly/issues/206
=======
# Grammarly for VS Code

A language server implementation on top of Grammarly's SDK.
>>>>>>> bceea86b77903eb5f301a01b01c7c6b7ab081c14

## Development Setup

This project uses [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm run build
```

## Adding support for new language

1. Add `"onLanguage:<language name>"` to `activationEvents` in [extension/package.json](./extension/package.json)
2. Add [tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar
   1. Install tree-sitter grammar package (generally package are named as `tree-sitter-<language name>`)
   2. Add package to wasm build script: [scripts/build-wasm.mjs](./scripts/build-wasm.mjs)
3. Add language transformer in [packages/grammarly-languageserver/src/languages/](./packages/grammarly-languageserver/src/languages/) directory
   1. Create `Language<LanguageName>.ts`
   2. For reference, check [`LanguageHTML.ts`](./packages/grammarly-languageserver/src/languages/LanguageHTML.ts)

## How to get help

Have a question, or want to provide feedback? Use [repository discussions](https://github.com/znck/grammarly/discussions) to ask questions, share bugs or feedback, or chat with other users.

## Older Packages

`unofficial-grammarly-api`, `unofficial-grammarly-language-client` and `unofficial-grammarly-language-server` are deprecated and archided: https://github.com/znck/grammarly/tree/v0

## Support

This extension is maintained by [Rahul Kadyan](https://github.com/znck). You can [💖 sponsor him](https://github.com/sponsors/znck) for the continued development of this extension.

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/znck/sponsors@main/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/znck/sponsors@main/sponsors.png'/>
  </a>
</p>

<br>
<br>
<br>
