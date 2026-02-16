const STORAGE_KEY = 'placement_prep_history';
const LATEST_ID_KEY = 'placement_prep_latest_id';

import { normalizeAnalysisToEntry, migrateEntry } from './schema';

function getStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStored(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (_) {}
}

/**
 * @returns {{ entries: Array, skippedCount: number }}
 */
export function getHistory() {
  const raw = getStored();
  if (!Array.isArray(raw)) return { entries: [], skippedCount: 0 };
  const entries = [];
  let skippedCount = 0;
  for (const e of raw) {
    try {
      const migrated = migrateEntry(e);
      if (migrated) entries.push(migrated);
      else skippedCount += 1;
    } catch {
      skippedCount += 1;
    }
  }
  entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return { entries, skippedCount };
}

/**
 * @param {object} entry - runAnalysis result (will be normalized to standard schema)
 * @returns {string} id
 */
export function saveEntry(entry) {
  const normalized = normalizeAnalysisToEntry(entry);
  if (!normalized) return '';

  const id = `pp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = new Date().toISOString();
  const record = { id, createdAt, ...normalized };

  const raw = getStored();
  const list = Array.isArray(raw) ? raw : [];
  list.unshift(record);
  setStored(list);
  try {
    localStorage.setItem(LATEST_ID_KEY, id);
  } catch (_) {}
  return id;
}

/**
 * @param {string} id
 * @returns {object|undefined} Migrated entry or undefined if not found / corrupted
 */
export function getEntryById(id) {
  if (!id || typeof id !== 'string') return undefined;
  const raw = getStored();
  if (!Array.isArray(raw)) return undefined;
  const found = raw.find((e) => e && e.id === id);
  if (!found) return undefined;
  try {
    return migrateEntry(found) ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Update an existing history entry. Persists to localStorage.
 * Merges updates into the entry; use for skillConfidenceMap, finalScore, updatedAt.
 */
export function updateEntry(id, updates) {
  const raw = getStored();
  if (!Array.isArray(raw)) return;
  const index = raw.findIndex((e) => e && e.id === id);
  if (index === -1) return;
  const current = raw[index];
  const updated = { ...current, ...updates };
  raw[index] = updated;
  setStored(raw);
}

export function getLatestId() {
  try {
    return localStorage.getItem(LATEST_ID_KEY) || null;
  } catch {
    return null;
  }
}
