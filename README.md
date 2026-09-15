# Roblox Friends Page Keyboard Navigation

A lightweight Firefox extension that improves navigation on Roblox friends, followers, and following pages. Instead of using the mouse to click pagination buttons or tabs, you can use your keyboard.

## Features

- **Page navigation:** Use the left and right arrow keys to go to the previous or next page of the list.
- **Tab navigation:** Use Ctrl + left/right arrow to switch between the Friends, Followers, and Following tabs.
- **Input field detection:** The extension does not interfere if you are typing in a text field, so you can use it seamlessly while searching or writing on the page.
- **Shadow DOM support:** Roblox uses nested Shadow DOM. This extension includes a recursive search function to find buttons and links correctly.

## Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| Left Arrow | Previous page |
| Right Arrow | Next page |
| Ctrl + Left Arrow | Previous tab (Friends > Followers > Following) |
| Ctrl + Right Arrow | Next tab (Friends > Followers > Following) |

## Installation for Testing (Temporary)

If you want to test the extension before signing it, you can load it temporarily in Firefox:

1. Open Firefox and type `about:debugging` in the address bar.
2. In the sidebar, click on "This Firefox".
3. Click the "Load Temporary Add-on..." button.
4. Select the `manifest.json` file inside the extension folder.
5. The extension will be active until you close Firefox.

## Permanent Installation (Signed)

To install the extension permanently, you must sign it on the Mozilla Add-ons store:

1. Compress the `manifest.json` and `content.js` files into a `.zip` file (make sure they are at the root of the archive, without additional folders).
2. Change the file extension from `.zip` to `.xpi`.
3. Go to [addons.mozilla.org](https://addons.mozilla.org) and log in.
4. Upload the `.xpi` file as an "Unlisted" (Self-distributed) extension.
5. Mozilla will sign the extension and provide a signed `.xpi` file.
6. Open the signed file with Firefox to install it permanently.

## Project Structure

- `manifest.json`: Defines permissions, content scripts, and the pages where the extension runs.
- `content.js`: The script that listens for keyboard presses and performs navigation actions.

## How It Works

The `content.js` script is injected into Roblox friends pages (matching URLs like `/users/*/friends*`). Once loaded:

- It listens for keyboard events at the document level with `capture: true` to intercept keys before Roblox processes them.
- It uses `event.composedPath()` to detect if the user is typing in an input or textarea, even if they are inside a Shadow DOM.
- It uses a recursive `deepQuerySelector` function to traverse all levels of Shadow DOM and find pagination buttons (`li.pager-prev button` and `li.pager-next button`) and tabs (`a[href*="#!/friends"]`, etc.).
- It simulates a click on the found element to navigate.

## Limitations

This extension relies on specific CSS selectors from the Roblox page. If Roblox updates its interface and changes the classes or structure of the buttons, the extension may stop working. In that case, you would need to inspect the page again and update the selectors in `content.js`.