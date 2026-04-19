// ============================================================
//  api.js – COSTruct frontend API wrapper
//  Replaces supabase-client.js
//  Just change the URL below to your Apps Script Web App URL
// ============================================================

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTRWLvNIaM4UzfkNy-6cBBFHig3roMSSQdeArFuery04M5RRaFkWvDFiHJTIWrq34r/exec';
// Paste the URL from: Apps Script → Deploy → Manage deployments

// ── Session (stored in localStorage) ─────────────────────────
function getSession()       { try { return JSON.parse(localStorage.getItem('costruct_user')); } catch { return null; } }
function setSession(user)   { user ? localStorage.setItem('costruct_user', JSON.stringify(user)) : localStorage.removeItem('costruct_user'); }
export function getCurrentUser() { return getSession(); }
export function requireAuth(redirect = 'login.html') {
  const u = getSession();
  if (!u) location.href = redirect;
  return u;
}

// ── Core fetch ────────────────────────────────────────────────
export async function apiCall(action, data = {}) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method:   'POST',
    redirect: 'follow',
    headers:  { 'Content-Type': 'text/plain' }, // avoids CORS preflight
    body:     JSON.stringify({ action, data }),
  });
  return res.json();
}

// ── Auth helpers ──────────────────────────────────────────────
export async function loginUser(email, password, role) {
  const result = await apiCall('login', { email, password, role });
  if (result.error) return { error: result.error };
  setSession(result.user);
  return { user: result.user };
}

export async function registerUser({ name, email, password, role, contact, address,
                                     storeName, storeCategory, storeLocation }) {
  return apiCall('register', { name, email, password, role, contact, address,
                                storeName, storeCategory, storeLocation });
}

export async function logoutUser() {
  setSession(null);
  location.href = 'login.html';
}

// ── Suppliers ─────────────────────────────────────────────────
export async function getSuppliers()      { return (await apiCall('getSuppliers')).data || []; }
export async function insertSupplier(d)   { return apiCall('insertSupplier', d); }
export async function updateSupplier(d)   { return apiCall('updateSupplier', d); }
export async function deleteSupplier(id)  { return apiCall('deleteSupplier', { id }); }

// ── Catalog / Products ────────────────────────────────────────
export async function getCatalog()        { return (await apiCall('getCatalog')).data || []; }
export async function insertProduct(d)    { return apiCall('insertProduct', d); }
export async function updateProduct(d)    { return apiCall('updateProduct', d); }
export async function deleteProduct(id)   { return apiCall('deleteProduct', { id }); }

// ── Estimations ───────────────────────────────────────────────
export async function getEstimations()         { return (await apiCall('getEstimations')).data || []; }
export async function insertEstimation(d)      { return apiCall('insertEstimation', d); }
export async function deleteEstimation(id)     { return apiCall('deleteEstimation', { id }); }
