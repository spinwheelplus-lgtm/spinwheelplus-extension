# Firefox Add-ons (AMO) listing (English)

Live: https://addons.mozilla.org/en-US/firefox/addon/spinwheelplus/

Paste these fields on addons.mozilla.org. Do not ship em dashes or smart quotes.

## Name

SpinWheelPlus

## Summary (short)

Spin a wheel or pick names, numbers, dice, coin, yes/no, shuffle, and teams in Firefox's sidebar. Local and free.

## Version notes (1.2.0)

Local random tools in the sidebar, not an iframe of the website: Random Number, Random Name Picker, Dice Roller, Coin Flip, Yes or No, Shuffle List, and Team Generator. Wheel customize, slice photos, Zoom, and on-device storage stay as before. Draws still use crypto.getRandomValues.

## Description

SpinWheelPlus is a random picker that lives in the Firefox sidebar, so you can decide while you stay on Meet, Docs, or any other tab.

Spin a custom wheel with names, prizes, or choices. Switch between text and advanced entry views, add slice photos, shuffle or sort the list, and spin. Customize colors, spin length, sounds, winner effects, and the title.

The same sidebar also runs local tools: random numbers, a name picker, a 3D dice table, a 3D coin flip, yes or no, shuffle list, and a team generator. Nothing of this is an iframe of spinwheelplus.com.

Results use the browser Web Crypto API (crypto.getRandomValues). Everything stays on your device in extension storage. No account. No cloud save or share in this extension. For the full web editor, templates, and hosted wheels, open spinwheelplus.com from the panel footer.

Perfect for:

- Teachers picking students or splitting teams without leaving the lesson tab
- Meetings: who goes next, yes or no, or a number draw
- Giveaways and party decisions
- Everyday choices (where to eat, who pays)

Privacy:

- No account required
- No tracking
- Entries stay in storage on this browser
- The only permission is storage (the sidebar is declared as sidebar_action). Requires Firefox 140+ (data_collection_permissions). Sidebar is a desktop feature; uncheck Firefox for Android on AMO if the form allows it.

## Category

Productivity

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

## Notes for reviewers (private)

Version 1.2.0. Local spin-wheel UI in the Firefox sidebar plus local random tools (number, name, dice, coin, yes or no, shuffle list, team generator). Dice and coin use a packaged Three.js chunk and local textures. It does not iframe a website. It does not read the current tab. Permission is storage only. Random picks use crypto.getRandomValues in the packaged code. gecko.data_collection_permissions.required is none (no collection or transmission). gecko.strict_min_version is 140.0 and gecko_android.strict_min_version is 142.0 so the data_collection_permissions key is valid. Theme boot is public/appearance-boot.js (no inline script). innerHTML hits in sidepanel.js are React 18 and TipTap, not page-content injection. Gecko id: contact@spinwheelplus.com. Support: contact@spinwheelplus.com. Developer: spinwheelplus@gmail.com. Store file: spinwheelplus-firefox.zip. Source file: spinwheelplus-firefox-source.zip (unminified tree; README has npm ci && npm run pack:firefox). Do not upload the store zip as source.
