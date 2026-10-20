// Opening hours come from the settings table as a JSON object keyed by the
// two letter Italian day abbreviation. These helpers keep the day order and
// the label spelling in one place.

export const DAY_LABELS = [
  ['lun', 'Lunedì'],
  ['mar', 'Martedì'],
  ['mer', 'Mercoledì'],
  ['gio', 'Giovedì'],
  ['ven', 'Venerdì'],
  ['sab', 'Sabato'],
  ['dom', 'Domenica'],
];

// Stored as "09:30-19:30", displayed as "09:30 - 19:30".
export function formatHours(value) {
  if (!value) return '';
  return value.replace('-', ' - ');
}
