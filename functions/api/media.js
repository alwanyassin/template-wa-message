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

    const formatted = (results || []).map((row) => ({
      ...row,
      cms_emails: row.cms_emails ? JSON.parse(row.cms_emails) : [],
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
    const id = body.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `media_${Date.now()}`);
    const now = Date.now();
    const cmsEmails = Array.isArray(body.cms_emails)
      ? JSON.stringify(body.cms_emails)
      : (typeof body.cms_emails === 'string' ? body.cms_emails : '[]');

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
      id,
      body.media_name || '',
      cmsEmails,
      body.cms_password || '',
      body.cms_link || '',
      body.ga4_link || '',
      body.gds_link || '',
      body.google_email || '',
      body.traktir_kopi_username || '',
      body.traktir_kopi_password || '',
      body.traktir_kopi_link || '',
      body.pic_name || '',
      body.pic_phone || '',
      body.notes || '',
      body.created_at || now,
      now
    ).run();

    return new Response(JSON.stringify({ success: true, id }), {
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
