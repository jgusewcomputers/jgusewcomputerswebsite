/**
 * GET /api/createsecret-metrics
 *
 * Server-side proxy for the CreateSecret admin metrics endpoint.
 * Reads CREATESECRET_METRICS_TOKEN from the Pages/Worker environment —
 * the token is never exposed to browser JavaScript.
 *
 * Returns the raw CreateSecret metrics JSON with Cache-Control: no-store.
 */
export async function onRequestGet({ env }) {
  const headers = {
    'Content-Type':  'application/json',
    'Cache-Control': 'no-store',
  };

  // ── Token check ──────────────────────────────────────────────────────────
  const token = env.CREATESECRET_METRICS_TOKEN;
  if (!token) {
    return new Response(
      JSON.stringify({ error: 'CREATESECRET_METRICS_TOKEN is not configured in environment secrets.' }),
      { status: 500, headers }
    );
  }

  // ── Upstream fetch ────────────────────────────────────────────────────────
  let upstream;
  try {
    upstream = await fetch('https://api.createsecret.com/api/admin/metrics', {
      method:  'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept':        'application/json',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `CreateSecret API unreachable: ${err.message}` }),
      { status: 503, headers }
    );
  }

  // ── Error responses ───────────────────────────────────────────────────────
  if (upstream.status === 401 || upstream.status === 403) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized — CREATESECRET_METRICS_TOKEN may be invalid or expired.' }),
      { status: 401, headers }
    );
  }
  if (!upstream.ok) {
    return new Response(
      JSON.stringify({ error: `CreateSecret API returned HTTP ${upstream.status}.` }),
      { status: 502, headers }
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  let data;
  try {
    data = await upstream.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'CreateSecret API returned non-JSON response.' }),
      { status: 502, headers }
    );
  }

  return new Response(JSON.stringify(data), { status: 200, headers });
}

// Block non-GET methods
export async function onRequest({ request, next }) {
  if (request.method === 'GET') return next();
  return new Response(
    JSON.stringify({ error: 'Method not allowed.' }),
    { status: 405, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
  );
}
