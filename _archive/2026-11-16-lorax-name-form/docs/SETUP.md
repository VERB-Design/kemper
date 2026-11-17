# Connecting the form to your spreadsheet

About five minutes. The spreadsheet stays private to you; the form can only add rows to it, never read it.

1. **Create the sheet.** Go to sheets.new (signed in as you). Name it, e.g. *Lorax name submissions*. Don't share it.
2. **Add the script.** In the sheet: **Extensions → Apps Script**. Delete what's there, paste in the whole of `apps-script/Code.gs`, and save.
3. **Deploy it.** **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, then **Authorize access** and approve with your Google account. (Google will warn that the app is unverified, because it's your own script. Choose *Advanced → Go to project*.)
4. **Copy the Web app URL** (ends in `/exec`).
5. **Paste it into the form.** In `index.html`, find `const SCRIPT_URL = "";` and put the URL between the quotes.
6. **Test.** Submit once. A *Submissions* tab appears in the sheet with headers and your row.

## What "Anyone" means here

"Anyone" lets the public form *post* to your script. It does not share the spreadsheet: the script runs as you, and it only appends rows. Nobody gets a link to the sheet or can read what others submitted.

## If you edit `Code.gs` later

Use **Deploy → Manage deployments → edit (pencil) → Version: New version**. That keeps the same URL. A *New deployment* creates a new URL and you'd have to update `index.html`.

## Hosting

`index.html` is one self-contained file. Put it anywhere that serves static pages (Netlify drop, GitHub Pages, your own site) or embed it in an existing page.
