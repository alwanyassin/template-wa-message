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
    let list = [];
    try {
      const local = localStorage.getItem(LOCAL_MEDIA_KEY);
      list = local ? JSON.parse(local) : [];
    } catch (e) {
      list = [];
    }

    // Deduplikasi local cache jika ada nama kembar
    const uniqueMap = new Map();
    for (const item of list) {
      const key = (item.media_name || '').trim().toLowerCase();
      if (!key) continue;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      } else {
        const prev = uniqueMap.get(key);
        uniqueMap.set(key, {
          ...prev,
          ...item,
          id: prev.id,
          cms_emails: Array.isArray(item.cms_emails) && item.cms_emails.length > 0 ? item.cms_emails : prev.cms_emails,
          cms_password: item.cms_password || prev.cms_password || '',
          cms_link: item.cms_link || prev.cms_link || '',
          ga4_link: item.ga4_link || prev.ga4_link || '',
          gds_link: item.gds_link || prev.gds_link || '',
          google_email: item.google_email || prev.google_email || '',
          traktir_kopi_username: item.traktir_kopi_username || prev.traktir_kopi_username || '',
          traktir_kopi_password: item.traktir_kopi_password || prev.traktir_kopi_password || '',
          traktir_kopi_link: item.traktir_kopi_link || prev.traktir_kopi_link || '',
        });
      }
    }
    const deduplicated = Array.from(uniqueMap.values());

    return {
      data: deduplicated,
      isCloud: false,
      error: err.message,
    };
  }
}

export async function saveMediaProfile(profile) {
  const cleanMediaName = (profile.media_name || '').trim();
  const now = Date.now();

  let localList = [];
  try {
    const local = localStorage.getItem(LOCAL_MEDIA_KEY);
    localList = local ? JSON.parse(local) : [];
  } catch (e) {
    localList = [];
  }

  // Cek apakah media dengan ID sama ATAU Nama Media sama (case-insensitive) sudah ada
  const existingIndex = localList.findIndex((m) => {
    if (profile.id && m.id === profile.id) return true;
    if (cleanMediaName && (m.media_name || '').trim().toLowerCase() === cleanMediaName.toLowerCase()) return true;
    return false;
  });

  const existing = existingIndex >= 0 ? localList[existingIndex] : null;
  const finalId = existing ? existing.id : (profile.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `media_${now}`));

  // Merge CMS emails
  let mergedEmails = existing ? (Array.isArray(existing.cms_emails) ? existing.cms_emails : []) : [];
  if (Array.isArray(profile.cms_emails) && profile.cms_emails.length > 0) {
    mergedEmails = profile.cms_emails;
  }

  const mergedProfile = {
    ...existing,
    ...profile,
    id: finalId,
    media_name: cleanMediaName,
    cms_emails: mergedEmails,
    cms_password: profile.cms_password || (existing ? existing.cms_password : '') || '',
    cms_link: profile.cms_link || (existing ? existing.cms_link : '') || '',
    ga4_link: profile.ga4_link || (existing ? existing.ga4_link : '') || '',
    gds_link: profile.gds_link || (existing ? existing.gds_link : '') || '',
    google_email: profile.google_email || (existing ? existing.google_email : '') || '',
    traktir_kopi_username: profile.traktir_kopi_username || (existing ? existing.traktir_kopi_username : '') || '',
    traktir_kopi_password: profile.traktir_kopi_password || (existing ? existing.traktir_kopi_password : '') || '',
    traktir_kopi_link: profile.traktir_kopi_link || (existing ? existing.traktir_kopi_link : '') || '',
    pic_name: profile.pic_name || (existing ? existing.pic_name : '') || '',
    pic_phone: profile.pic_phone || (existing ? existing.pic_phone : '') || '',
    notes: profile.notes || (existing ? existing.notes : '') || '',
    created_at: existing ? existing.created_at : now,
    updated_at: now,
  };

  // Hapus semua duplikat dengan ID atau nama sama, lalu masukkan profil yang sudah disatukan
  localList = localList.filter((m) => {
    if (m.id === finalId) return false;
    if (cleanMediaName && (m.media_name || '').trim().toLowerCase() === cleanMediaName.toLowerCase()) return false;
    return true;
  });
  localList.unshift(mergedProfile);

  try {
    localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(localList));
  } catch (e) {
    console.error('Error updating local cache:', e);
  }

  // Kirim ke Cloudflare D1
  try {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mergedProfile),
    });
    const result = await handleResponse(res);
    return { success: true, id: result.id || finalId, isCloud: true, merged: result.merged || !!existing };
  } catch (err) {
    console.warn('[D1 Service] Tersimpan di local cache (D1 fallback):', err.message);
    return { success: true, id: finalId, isCloud: false, merged: !!existing };
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
