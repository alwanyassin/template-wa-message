// Helper untuk menggabungkan (merge) data duplikat berdasarkan nama media
function mergeMediaRecords(records) {
  if (!records || records.length === 0) return [];
  const map = new Map();

  for (const row of records) {
    const key = (row.media_name || '').trim().toLowerCase();
    if (!key) continue;

    if (!map.has(key)) {
      map.set(key, { ...row });
    } else {
      const existing = map.get(key);

      // Gabungkan daftar email tanpa duplikat
      let existingEmails = [];
      try {
        existingEmails = existing.cms_emails
          ? (typeof existing.cms_emails === 'string' ? JSON.parse(existing.cms_emails) : existing.cms_emails)
          : [];
      } catch (e) {}

      let rowEmails = [];
      try {
        rowEmails = row.cms_emails
          ? (typeof row.cms_emails === 'string' ? JSON.parse(row.cms_emails) : row.cms_emails)
          : [];
      } catch (e) {}

      const mergedEmails = Array.from(new Set([...existingEmails, ...rowEmails]));

      map.set(key, {
        id: existing.id,
        media_name: existing.media_name || row.media_name,
        cms_emails: JSON.stringify(mergedEmails),
        cms_password: row.cms_password || existing.cms_password || '',
        cms_link: row.cms_link || existing.cms_link || '',
        ga4_link: row.ga4_link || existing.ga4_link || '',
        gds_link: row.gds_link || existing.gds_link || '',
        google_email: row.google_email || existing.google_email || '',
        traktir_kopi_username: row.traktir_kopi_username || existing.traktir_kopi_username || '',
        traktir_kopi_password: row.traktir_kopi_password || existing.traktir_kopi_password || '',
        traktir_kopi_link: row.traktir_kopi_link || existing.traktir_kopi_link || '',
        pic_name: row.pic_name || existing.pic_name || '',
        pic_phone: row.pic_phone || existing.pic_phone || '',
        notes: row.notes || existing.notes || '',
        created_at: Math.min(existing.created_at || Date.now(), row.created_at || Date.now()),
        updated_at: Math.max(existing.updated_at || 0, row.updated_at || 0),
      });
    }
  }

  return Array.from(map.values());
}

export async function onRequestGet({ env }) {
  try {
    if (!env.DB) {
      return new Response(
        JSON.stringify({ error: 'Database D1 belum di-binding ke project Pages' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const { results } = await env.DB.prepare(
      'SELECT * FROM media_directory ORDER BY updated_at DESC'
    ).all();

    // Deduplikasi otomatis jika ada data lama yang tersimpan dobel
    const deduplicated = mergeMediaRecords(results || []);

    const formatted = deduplicated.map((row) => ({
      ...row,
      cms_emails: row.cms_emails
        ? (typeof row.cms_emails === 'string' ? JSON.parse(row.cms_emails) : row.cms_emails)
        : [],
    }));

    return new Response(JSON.stringify(formatted), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) {
      return new Response(
        JSON.stringify({ error: 'Database D1 belum di-binding ke project Pages' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const body = await request.json();
    const cleanMediaName = (body.media_name || '').trim();
    if (!cleanMediaName) {
      return new Response(JSON.stringify({ error: 'Nama media wajib diisi' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cari apakah media dengan ID sama ATAU nama media sama sudah ada sebelumnya di D1
    const { results: existingList } = await env.DB.prepare(
      'SELECT * FROM media_directory WHERE id = ? OR LOWER(TRIM(media_name)) = LOWER(TRIM(?)) ORDER BY updated_at DESC'
    ).bind(body.id || '', cleanMediaName).all();

    const existing = existingList && existingList.length > 0 ? existingList[0] : null;
    const now = Date.now();
    const finalId = existing ? existing.id : (body.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `media_${now}`));

    // Parsing email yang dikirim
    let incomingEmails = [];
    if (Array.isArray(body.cms_emails)) {
      incomingEmails = body.cms_emails;
    } else if (typeof body.cms_emails === 'string' && body.cms_emails.trim()) {
      try {
        incomingEmails = JSON.parse(body.cms_emails);
      } catch (e) {
        incomingEmails = body.cms_emails.split(/[\n,]+/).map((e) => e.trim()).filter(Boolean);
      }
    }

    // Parsing email yang sudah ada di database
    let existingEmails = [];
    if (existing && existing.cms_emails) {
      try {
        existingEmails = typeof existing.cms_emails === 'string' ? JSON.parse(existing.cms_emails) : existing.cms_emails;
      } catch (e) {
        existingEmails = [];
      }
    }

    // Gabungkan email jika ada yang baru, atau pertahankan email lama
    const combinedEmails = incomingEmails.length > 0 ? incomingEmails : existingEmails;
    const cmsEmailsJson = JSON.stringify(combinedEmails);

    // Merge field: gunakan data baru jika diisi, jika kosong pertahankan data yang sudah tersimpan
    const cmsPassword = (body.cms_password && body.cms_password.trim()) || (existing ? existing.cms_password : '') || '';
    const cmsLink = (body.cms_link && body.cms_link.trim()) || (existing ? existing.cms_link : '') || '';

    const ga4Link = (body.ga4_link && body.ga4_link.trim()) || (existing ? existing.ga4_link : '') || '';
    const gdsLink = (body.gds_link && body.gds_link.trim()) || (existing ? existing.gds_link : '') || '';
    const googleEmail = (body.google_email && body.google_email.trim()) || (existing ? existing.google_email : '') || '';

    const traktirKopiUsername = (body.traktir_kopi_username && body.traktir_kopi_username.trim()) || (existing ? existing.traktir_kopi_username : '') || googleEmail;
    const traktirKopiPassword = (body.traktir_kopi_password && body.traktir_kopi_password.trim()) || (existing ? existing.traktir_kopi_password : '') || '';
    const traktirKopiLink = (body.traktir_kopi_link && body.traktir_kopi_link.trim()) || (existing ? existing.traktir_kopi_link : '') || 'https://traktir-kopi.promediateknologi.id/';

    const picName = (body.pic_name && body.pic_name.trim()) || (existing ? existing.pic_name : '') || '';
    const picPhone = (body.pic_phone && body.pic_phone.trim()) || (existing ? existing.pic_phone : '') || '';
    const notes = (body.notes && body.notes.trim()) || (existing ? existing.notes : '') || '';
    const createdAt = existing ? existing.created_at : now;

    // Bersihkan entri duplikat lama jika sebelumnya sempat tersimpan lebih dari 1 baris
    if (existingList && existingList.length > 1) {
      const duplicateIdsToDelete = existingList.slice(1).map((r) => r.id);
      for (const dupId of duplicateIdsToDelete) {
        await env.DB.prepare('DELETE FROM media_directory WHERE id = ?').bind(dupId).run();
      }
    }

    // Simpan atau update record tunggal yang sudah disatukan
    await env.DB.prepare(`
      INSERT INTO media_directory (
        id, media_name, cms_emails, cms_password, cms_link,
        ga4_link, gds_link, google_email, traktir_kopi_username,
        traktir_kopi_password, traktir_kopi_link, pic_name, pic_phone,
        notes, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?
      )
      ON CONFLICT(id) DO UPDATE SET
        media_name = excluded.media_name,
        cms_emails = excluded.cms_emails,
        cms_password = excluded.cms_password,
        cms_link = excluded.cms_link,
        ga4_link = excluded.ga4_link,
        gds_link = excluded.gds_link,
        google_email = excluded.google_email,
        traktir_kopi_username = excluded.traktir_kopi_username,
        traktir_kopi_password = excluded.traktir_kopi_password,
        traktir_kopi_link = excluded.traktir_kopi_link,
        pic_name = excluded.pic_name,
        pic_phone = excluded.pic_phone,
        notes = excluded.notes,
        updated_at = excluded.updated_at
    `).bind(
      finalId,
      cleanMediaName,
      cmsEmailsJson,
      cmsPassword,
      cmsLink,
      ga4Link,
      gdsLink,
      googleEmail,
      traktirKopiUsername,
      traktirKopiPassword,
      traktirKopiLink,
      picName,
      picPhone,
      notes,
      createdAt,
      now
    ).run();

    return new Response(JSON.stringify({ success: true, id: finalId, merged: !!existing }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    if (!env.DB) {
      return new Response(
        JSON.stringify({ error: 'Database D1 belum di-binding ke project Pages' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Parameter id diperlukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare('DELETE FROM media_directory WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
