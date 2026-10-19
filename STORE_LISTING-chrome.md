# Chrome Web Store listing (English)

Live: https://chromewebstore.google.com/detail/spinwheelplus/dhenelblilfpogangiapipnoipojplgi

Paste these fields in the developer dashboard. Do not ship em dashes or smart quotes.

## Name

SpinWheelPlus

## Short description (max 132 characters)

Spin a wheel or pick names, numbers, dice, coin, yes/no, shuffle, and teams in Chrome's side panel. Local and free.

## What's new (1.2.0)

Local random tools in the side panel, not an iframe of the website: Random Number, Random Name Picker, Dice Roller, Coin Flip, Yes or No, Shuffle List, and Team Generator. Wheel customize, slice photos, Zoom, and on-device storage stay as before. Draws still use crypto.getRandomValues.

## Detailed description

SpinWheelPlus is a random picker that lives in Chrome's side panel, so you can decide while you stay on Meet, Docs, or any other tab.

Spin a custom wheel with names, prizes, or choices. Switch between text and advanced entry views, add slice photos, shuffle or sort the list, and spin. Customize colors, spin length, sounds, winner effects, and the title.

The same panel also runs local tools: random numbers, a name picker, a 3D dice table, a 3D coin flip, yes or no, shuffle list, and a team generator. Nothing of this is an iframe of spinwheelplus.com.

Results use the browser Web Crypto API (crypto.getRandomValues). Everything stays on your device in Chrome storage. No account. No cloud save or share in this extension. For the full web editor, templates, and hosted wheels, open spinwheelplus.com from the panel footer.

Perfect for:

- Teachers picking students or splitting teams without leaving the lesson tab
- Meetings: who goes next, yes or no, or a number draw
- Giveaways and party decisions
- Everyday choices (where to eat, who pays)

Privacy:

- No account required
- No tracking
- Entries stay in chrome.storage on this browser
- The only extra permission is storage (plus the side panel)

## Category

Productivity (or Fun)

## Language

English

## Official URL

https://spinwheelplus.com

## Support URL

https://spinwheelplus.com/contact-us

## Support email

contact@spinwheelplus.com

## Developer email

spinwheelplus@gmail.com

## Privacy policy URL

https://spinwheelplus.com/legal/privacy-policy

## Privacy practices (dashboard tab: Phuong thuc bao ve quyen rieng tu)

Certify that data use follows the Chrome Web Store Developer Program Policies. Check the certification box.

Does this item collect or use user data? No.

Privacy policy URL: https://spinwheelplus.com/legal/privacy-policy

### Single purpose

A side panel for a local spin wheel and related random tools while browsing.

### Remote code

This item does not execute remotely hosted code. All JavaScript, CSS, and assets ship inside the uploaded package. Links to spinwheelplus.com open the website in a new tab and do not load remote scripts into the extension.

### Permission: sidePanel

The UI runs in Chrome's side panel so the user can spin or pick while staying on the current tab. The extension does not read the tab URL or page content.

### Permission: storage

chrome.storage.local saves the wheel, tool options, and history on this device so they persist between sessions. Data is not sent to a server.

## Single purpose (dashboard prompt)

A side panel for a local spin wheel and related random tools while browsing.

## Notes for reviewers (private)

Version 1.2.0. Local spin-wheel UI in the Chrome side panel (canvas + entries editor + customize drawer) plus local random tools (number, name, dice, coin, yes or no, shuffle list, team generator). Dice and coin use a packaged Three.js chunk and local textures. It does not iframe a website. It does not read the current tab. Permissions are sidePanel and storage only. Random picks use crypto.getRandomValues in the packaged code. Support: contact@spinwheelplus.com. Developer: spinwheelplus@gmail.com.
