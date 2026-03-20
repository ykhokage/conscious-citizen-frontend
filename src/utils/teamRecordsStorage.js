const TEAM_RECORDS_KEY = "cc_team_record_overrides";

function readOverrides() {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(TEAM_RECORDS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeOverrides(value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TEAM_RECORDS_KEY, JSON.stringify(value));
}

export function getTeamRecordOverrides() {
  return readOverrides();
}

export function getMergedTeamRecords(records) {
  const overrides = readOverrides();

  return records.map((record) => ({
    ...record,
    ...(overrides[record.id] || {}),
  }));
}

export function saveTeamRecordOverride(id, patch) {
  const overrides = readOverrides();
  overrides[id] = {
    ...(overrides[id] || {}),
    ...patch,
  };
  writeOverrides(overrides);
  return overrides[id];
}

export function resetTeamRecordOverride(id) {
  const overrides = readOverrides();
  delete overrides[id];
  writeOverrides(overrides);
}
