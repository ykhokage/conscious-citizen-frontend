const TOKEN_KEY = "cc_token";
const USER_KEY = "cc_user";
const AVATAR_PREFIX = "cc_avatar:";
const PENDING_AUTH_KEY = "cc_pending_auth";
const ADMIN_INCIDENT_META_KEY = "cc_admin_incident_meta";

export function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setPendingAuth(token, user) {
  localStorage.setItem(PENDING_AUTH_KEY, JSON.stringify({ token, user }));
}

export function getPendingAuth() {
  const raw = localStorage.getItem(PENDING_AUTH_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingAuth() {
  localStorage.removeItem(PENDING_AUTH_KEY);
}

export function avatarStorageKey(user) {
  const id = user?.id || user?.email || user?.login || "guest";
  return `${AVATAR_PREFIX}${id}`;
}

export function setAvatar(user, value) {
  localStorage.setItem(avatarStorageKey(user), value);
}

export function getAvatar(user) {
  return localStorage.getItem(avatarStorageKey(user)) || "";
}

export function clearAvatar(user) {
  localStorage.removeItem(avatarStorageKey(user));
}

function readAdminIncidentMeta() {
  const raw = localStorage.getItem(ADMIN_INCIDENT_META_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAdminIncidentMeta(value) {
  localStorage.setItem(ADMIN_INCIDENT_META_KEY, JSON.stringify(value));
}

export function getAllAdminIncidentMeta() {
  return readAdminIncidentMeta();
}

export function getAdminIncidentMeta(incidentId) {
  const store = readAdminIncidentMeta();
  return store[String(incidentId)] || { labels: [], stage: "" };
}

export function setAdminIncidentMeta(incidentId, payload) {
  const id = String(incidentId);
  const store = readAdminIncidentMeta();
  const current = store[id] || { labels: [], stage: "" };

  store[id] = {
    ...current,
    ...payload,
    labels: Array.isArray(payload?.labels)
      ? Array.from(new Set(payload.labels.map((item) => String(item || "").trim()).filter(Boolean)))
      : current.labels || [],
  };

  writeAdminIncidentMeta(store);
  return store[id];
}

export function clearAdminIncidentMeta(incidentId) {
  const id = String(incidentId);
  const store = readAdminIncidentMeta();

  if (store[id]) {
    delete store[id];
    writeAdminIncidentMeta(store);
  }
}
