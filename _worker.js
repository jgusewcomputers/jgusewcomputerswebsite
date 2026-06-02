/**
 * JGusew Computers — Cloudflare Pages Worker
 *
 * Handles all dynamic routing for the Pages project.
 * When _worker.js is present, the functions/ directory is ignored by Cloudflare.
 *
 * Routes:
 *   GET /api/createsecret-metrics  →  server-side proxy (token never reaches browser)
 *   community.jgusewcomputers.com  →  community.html
 *   professional.jgusewcomputers.com → professional.html
 *   admin.jgusewcomputers.com      →  admin.html
 *   everything else                →  static asset from Pages (env.ASSETS)
 */

export default {
  async fetch(request, env) {
    const url  = new URL(request.url);
    const host = url.hostname;
    const path = url.pathname;

    // ── API: CreateSecret metrics ─────────────────────────────────────────
    if (path === '/api/createsecret-metrics') {
      return handleMetrics(request, env);
    }

    // ── Subdomain routing ─────────────────────────────────────────────────
    if (host === 'community.jgusewcomputers.com' && path === '/') {
      return serveAsset('/community.html', request, env);
    }
    if (host === 'professional.jgusewcomputers.com' && path === '/') {
      return serveAsset('/professional.html', request, env);
    }
    if (host === 'admin.jgusewcomputers.com' && path === '/') {
      return serveAsset('/admin.html', request, env);
    }

    // ── Static assets (Pages handles everything else) ─────────────────────
    return env.ASSETS.fetch(request);
  },
};

// ── Serve a specific static file from the Pages asset manifest ──────────────
async function serveAsset(filename, request, env) {
  const assetUrl = new URL(filename, 'https://jgusewcomputers.com');
  try {
    return await env.ASSETS.fetch(new Request(assetUrl, request));
  } catch {
    // Fallback: visible redirect (url bar changes but content is correct)
    return Response.redirect(new URL(filename, request.url).href, 302);
  }
}

// ── CreateSecret metrics proxy ───────────────────────────────────────────────
async function handleMetrics(request, env) {
  const h = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405, headers: h });
  }

  const token = env.CREATESECRET_METRICS_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'CREATESECRET_METRICS_TOKEN is not set in environment secrets.' }),
      { status: 500, headers: h }
    );
  }

  let upstream;
  try {
    upstream = await fetch('https://api.createsecret.com/api/admin/metrics', {
      method:  'GET',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `CreateSecret API unreachable: ${err.message}` }),
      { status: 503, headers: h }
    );
  }

  if (upstream.status === 401 || upstream.status === 403) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized — CREATESECRET_METRICS_TOKEN may be invalid.' }),
      { status: 401, headers: h }
    );
  }
  if (!upstream.ok) {
    return new Response(
      JSON.stringify({ error: `CreateSecret API returned HTTP ${upstream.status}.` }),
      { status: 502, headers: h }
    );
  }

  let data;
  try {
    data = await upstream.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'CreateSecret API returned non-JSON response.' }),
      { status: 502, headers: h }
    );
  }

  return new Response(JSON.stringify(data), { status: 200, headers: h });
}
