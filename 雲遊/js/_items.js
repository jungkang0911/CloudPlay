/* _items.js — deprecated shim
 * All data has moved to _db.js (window.DB and window.YY).
 * This file exists only to avoid 404s from legacy references.
 * New pages should load _db.js directly.
 */
if (!window.DB) {
  console.error('[_items.js] _db.js must be loaded before _items.js');
}
// window.YY is already set by _db.js
