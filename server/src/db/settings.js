import { query } from './index.js';

// Shop identity, contact details, opening hours and structured data values.
// Returned as a flat object keyed by the settings key.

const HOURS_KEY = 'hours_json';

export async function getSettings() {
  const rows = await query('SELECT `key`, `value` FROM `settings` ORDER BY `key`');

  const settings = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }

  // hours_json is stored as a string so it can be edited by hand in Workbench.
  // The API hands the parsed object to the UI and to the SEO renderer.
  if (typeof settings[HOURS_KEY] === 'string') {
    try {
      settings.hours = JSON.parse(settings[HOURS_KEY]);
    } catch (error) {
      console.error('settings.hours_json is not valid JSON', error.message);
    }
  }

  return settings;
}
