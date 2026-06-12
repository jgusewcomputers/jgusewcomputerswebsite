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

    // ── www → apex (Workers static assets _redirects can't use absolute URLs)
    if (host === 'www.jgusewcomputers.com') {
      url.hostname = 'jgusewcomputers.com';
      return Response.redirect(url.href, 301);
    }

    // ── API: CreateSecret metrics ─────────────────────────────────────────
    // Only answered on the admin subdomain. NOTE: this is obscurity, not
    // auth — put a Cloudflare Access policy on admin.jgusewcomputers.com
    // before setting CREATESECRET_METRICS_TOKEN in production.
    if (path === '/api/createsecret-metrics') {
      if (host !== 'admin.jgusewcomputers.com') {
        return notFound(request, env);
      }
      return handleMetrics(request, env);
    }

    // ── Subdomain routing ─────────────────────────────────────────────────
    // Extensionless paths: asking ASSETS for "/community.html" gets a 307
    // to "/community" (html_handling), which leaks into the address bar.
    if (host === 'community.jgusewcomputers.com' && path === '/') {
      return serveAsset('/community', request, env);
    }
    if (host === 'professional.jgusewcomputers.com' && path === '/') {
      return serveAsset('/professional', request, env);
    }
    if (host === 'admin.jgusewcomputers.com' && path === '/') {
      return serveAsset('/admin', request, env);
    }

    // ── Static assets (Pages handles everything else) ─────────────────────
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404) return notFound(request, env);
      return response;
    } catch {
      return notFound(request, env);
    }
  },
};

// ── Branded 404 (env.ASSETS throws or 404s on unknown paths; without this
//    visitors get a raw Cloudflare "error code: 1101" page) ─────────────────
async function notFound(request, env) {
  try {
    const homeUrl = new URL('/index.html', request.url);
    const home = await env.ASSETS.fetch(new Request(homeUrl, { headers: { Accept: 'text/html' } }));
    if (home.ok) {
      return new Response(home.body, {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }
  } catch {}
  return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
}

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
      JSON.stringify({ error: 'Metrics are not configured.' }),
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
      JSON.stringify({ error: 'Upstream metrics service unreachable.' }),
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
