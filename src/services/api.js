// Service API untuk Cloudflare D1 Database dengan Smart Fallback ke localStorage
const LOCAL_MEDIA_KEY = 'wa_d1_media_directory';
const LOCAL_HISTORY_KEY = 'wa_d1_history_logs';

// Helper untuk mengecek apakah respons valid JSON
async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }
  return await res.json();
}

// ---------------------------
// 1. Media Directory (Buku Profil Media)
// ---------------------------
export async function fetchMediaDirectory() {
  try {
    const res = await fetch('/api/media');
    const data = await handleResponse(res);
    // Simpan sinkronisasi ke local cache
    localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(data));
    return { data, isCloud: true };
  } catch (err) {
    console.warn('[D1 Service] Menggunakan fallback localStorage untuk media directory:', err.message);
    const local = localStorage.getItem(LOCAL_MEDIA_KEY);
    return {
      data: local ? JSON.parse(local) : [],
      isCloud: false,
      error: err.message,
    };
  }
}

export async function saveMediaProfile(profile) {
  const profileWithId = {
    ...profile,
    id: profile.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `media_${Date.now()}`),
    updated_at: Date.now(),
  };

  // Update local cache terlebih dahulu agar instan
  try {
    const local = localStorage.getItem(LOCAL_MEDIA_KEY);
    const list = local ? JSON.parse(local) : [];
    const index = list.findIndex((m) => m.id === profileWithId.id);
    if (index >= 0) {
      list[index] = profileWithId;
    } else {
      list.unshift(profileWithId);
    }
    localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error updating local cache:', e);
  }

  // Kirim ke Cloudflare D1
  try {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileWithId),
    });
    const result = await handleResponse(res);
    return { success: true, id: result.id || profileWithId.id, isCloud: true };
  } catch (err) {
    console.warn('[D1 Service] Tersimpan di local cache (D1 fallback):', err.message);
    return { success: true, id: profileWithId.id, isCloud: false };
  }
}

export async function deleteMediaProfile(id) {
  // Hapus dari local cache
  try {
    const local = localStorage.getItem(LOCAL_MEDIA_KEY);
    if (local) {
      const list = JSON.parse(local).filter((m) => m.id !== id);
      localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error('Error removing from local cache:', e);
  }

  // Kirim ke Cloudflare D1
  try {
    const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    await handleResponse(res);
    return { success: true, isCloud: true };
  } catch (err) {
    console.warn('[D1 Service] Terhapus dari local cache:', err.message);
    return { success: true, isCloud: false };
  }
}

// ---------------------------
// 2. History Logs (Riwayat Pesan)
// ---------------------------
export async function fetchHistoryLogs() {
  try {
    const res = await fetch('/api/history');
    const data = await handleResponse(res);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(data));
    return { data, isCloud: true };
  } catch (err) {
    console.warn('[D1 Service] Menggunakan fallback localStorage untuk history:', err.message);
    const local = localStorage.getItem(LOCAL_HISTORY_KEY);
    return {
      data: local ? JSON.parse(local) : [],
      isCloud: false,
      error: err.message,
    };
  }
}

export async function logHistoryEntry(entry) {
  const newEntry = {
    ...entry,
    id: entry.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `hist_${Date.now()}`),
    created_at: Date.now(),
  };

  // Simpan ke local cache (maksimal 50)
  try {
    const local = localStorage.getItem(LOCAL_HISTORY_KEY);
    let list = local ? JSON.parse(local) : [];
    list = [newEntry, ...list].slice(0, 50);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error updating local history cache:', e);
  }

  // Kirim ke Cloudflare D1
  try {
    const res = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    });
    await handleResponse(res);
    return { success: true, isCloud: true };
  } catch (err) {
    console.warn('[D1 Service] Riwayat tersimpan di local cache:', err.message);
    return { success: true, isCloud: false };
  }
}

export async function deleteHistoryEntry(id) {
  try {
    const local = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (local) {
      const list = JSON.parse(local).filter((h) => h.id !== id);
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.error('Error updating local history cache:', e);
  }

  try {
    const res = await fetch(`/api/history?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    await handleResponse(res);
    return { success: true, isCloud: true };
  } catch (err) {
    return { success: true, isCloud: false };
  }
}

export async function clearAllHistoryLogs() {
  localStorage.removeItem(LOCAL_HISTORY_KEY);
  try {
    const res = await fetch('/api/history?clear_all=true', {
      method: 'DELETE',
    });
    await handleResponse(res);
    return { success: true, isCloud: true };
  } catch (err) {
    return { success: true, isCloud: false };
  }
}

// ---------------------------
// 3. Auto-save Form Drafts
// ---------------------------
export function getSavedDraft(key, fallbackValue) {
  try {
    const saved = localStorage.getItem(`wa_draft_${key}`);
    return saved ? JSON.parse(saved) : fallbackValue;
  } catch (e) {
    return fallbackValue;
  }
}

export function saveDraft(key, value) {
  try {
    localStorage.setItem(`wa_draft_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save draft:', e);
  }
}

export function removeDraft(key) {
  try {
    localStorage.removeItem(`wa_draft_${key}`);
  } catch (e) {
    console.error('Failed to remove draft:', e);
  }
}
