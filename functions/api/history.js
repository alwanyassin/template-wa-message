export async function onRequestGet({ env }) {
  try {
    if (!env.DB) {
      return new Response(
        JSON.stringify({ error: 'Database D1 belum di-binding ke project Pages' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const { results } = await env.DB.prepare(
      'SELECT * FROM history_logs ORDER BY created_at DESC LIMIT 50'
    ).all();

    return new Response(JSON.stringify(results || []), {
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
    const id = body.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `hist_${Date.now()}`);
    const now = Date.now();

    await env.DB.prepare(`
      INSERT INTO history_logs (
        id, template_type, media_name, message_text, action, phone_number, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.template_type || 'promedia',
      body.media_name || 'Media',
      body.message_text || '',
      body.action || 'copy',
      body.phone_number || '',
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
    const clearAll = url.searchParams.get('clear_all');

    if (clearAll === 'true') {
      await env.DB.prepare('DELETE FROM history_logs').run();
      return new Response(JSON.stringify({ success: true, cleared: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!id) {
      return new Response(JSON.stringify({ error: 'Parameter id diperlukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare('DELETE FROM history_logs WHERE id = ?').bind(id).run();

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
