/**
 * Lorax name submissions → Google Sheet
 *
 * Paste this into Extensions → Apps Script on the spreadsheet,
 * then Deploy → New deployment → Web app (see docs/SETUP.md).
 */

const SHEET_NAME = 'Submissions';
const HEADERS = [
  'Timestamp', 'First name', 'Last name', 'Suggested Lorax name', 'Reasons',
  'No copyright infringement', 'Not a registered entity'
];

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Spam trap: bots fill the hidden field. Pretend success, save nothing.
  if (p.website) return json({ ok: true });

  const required = ['firstName', 'lastName', 'loraxName', 'reasons'];
  for (const key of required) {
    if (!p[key] || !String(p[key]).trim()) return json({ ok: false, error: 'Missing ' + key });
  }
  if (p.noCopyright !== 'yes' || p.notRegistered !== 'yes') {
    return json({ ok: false, error: 'Both confirmations are required' });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    sheet.appendRow([
      new Date(),
      clean(p.firstName, 100),
      clean(p.lastName, 100),
      clean(p.loraxName, 120),
      clean(p.reasons, 3000),
      'Yes',
      'Yes'
    ]);
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

// Trim, cap length, and stop a leading = + - @ being run as a spreadsheet formula.
function clean(value, max) {
  let s = String(value || '').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
