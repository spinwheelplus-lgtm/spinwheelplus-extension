# SpinWheelPlus browser extension

One UI. Three store packs (Manifest V3). The wheel runs inside the extension. It does not iframe spinwheelplus.com.

| Store | Install |
| --- | --- |
| Chrome | https://chromewebstore.google.com/detail/spinwheelplus/dhenelblilfpogangiapipnoipojplgi |
| Edge | https://microsoftedge.microsoft.com/addons/detail/spinwheelplus/ejgmajnbanlenfeeaoncnjmafkcopojf |
| Firefox | https://addons.mozilla.org/en-US/firefox/addon/spinwheelplus/ |

Chrome and Edge open a side panel. Firefox opens a sidebar. Each store gets its own zip. The Edge pack is built from `manifests/edge.json`.

## Download a packed build

Version 1.2.3 is in the [`zip`](zip) folder. No build step. Unzip the file, then load that folder.

| File | Browser |
| --- | --- |
| [spinwheelplus-chrome.zip](zip/spinwheelplus-chrome.zip) | Chrome |
| [spinwheelplus-edge.zip](zip/spinwheelplus-edge.zip) | Edge |
| [spinwheelplus-firefox.zip](zip/spinwheelplus-firefox.zip) | Firefox |

Load the unzipped folder:

- Chrome: `chrome://extensions` -> Developer mode -> Load unpacked
- Edge: `edge://extensions` -> Developer mode -> Load unpacked
- Firefox: `about:debugging` -> This Firefox -> Load Temporary Add-on -> `manifest.json` inside the unzipped folder

The store links above install without developer mode. All releases: https://github.com/spinwheelplus-lgtm/spinwheelplus-extension/releases

## Develop

Requires Node.js 22.23 or newer.

```bash
npm ci
npm run dev
```

Preview: http://localhost:5173/sidepanel.html

`npm run build` typechecks, builds with Vite, then applies the Chrome manifest to `dist/` for an unpacked load.

Load unpacked:

- Chrome: `chrome://extensions` -> `dist`
- Edge: `edge://extensions` -> `dist` after `npm run pack:edge`
- Firefox: `about:debugging` -> Load Temporary Add-on -> `dist/manifest.json` after `npm run pack:firefox`

Icons are already in `public/icons`. Run `npm run icons` only when you need new PNGs.

## Pack

Current source version is in `package.json`.

```bash
npm run pack:all
```

Writes three zips (the UI is built once):

| Zip | Store |
| --- | --- |
| `release/spinwheelplus-chrome.zip` | Chrome Web Store |
| `release/spinwheelplus-edge.zip` | Microsoft Edge Add-ons |
| `release/spinwheelplus-firefox.zip` | Firefox Add-ons |

Single target: `npm run pack:chrome`, `npm run pack:edge`, or `npm run pack:firefox`.

`manifest.json` sits at the zip root. Zip entry paths use `/`. Firefox Add-ons rejects a zip made with PowerShell `Compress-Archive` because those entries use backslashes.

Listing copy: `STORE_LISTING.md`, `STORE_LISTING-edge.md`, `STORE_LISTING-firefox.md`.

## Firefox source review

Mozilla reviews this source tree. The store zip is Vite-minified.

Build environment for the packed add-on:

- Node.js 22.23.0 (https://nodejs.org)
- npm 10.9.8

Mozilla's default reviewer image is Ubuntu 24.04 ARM64 with Node 24. If a rebuild does not match the uploaded zip, use Node 22.23.0.

```bash
npm ci
npm run pack:firefox
```

Compare `release/spinwheelplus-firefox.zip` with the store file. Unpacked output is `dist/` after the Firefox manifest is applied.

`npm run pack:source` writes `release/spinwheelplus-firefox-source.zip`. That file is the review tree. Upload `spinwheelplus-firefox.zip` to the store file field.

## Privacy

No user data collection. Draws use `crypto.getRandomValues()`. Chrome and Edge permissions are `sidePanel` and `storage`. Firefox permission is `storage` only (`sidebar_action` is in `manifests/firefox.json`).

Policy: https://spinwheelplus.com/privacy

Support: contact@spinwheelplus.com

## License

MIT. See [LICENSE](LICENSE).
