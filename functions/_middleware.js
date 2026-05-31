/**
 * Cloudflare Pages Function — subdomain routing middleware
 *
 * Routes:
 *   community.jgusewcomputers.com  →  serves /community  (community.html)
 *   professional.jgusewcomputers.com  →  serves /professional  (professional.html)
 *   jgusewcomputers.com  →  serves normally (three-panel landing at index.html)
 *
 * Uses env.ASSETS to rewrite URLs server-side so the browser URL stays clean
 * (no visible redirect to /community or /professional).
 */
export async function onRequest({ request, next, env }) {
  const url  = new URL(request.url);
  const host = url.hostname;

  if (host === 'community.jgusewcomputers.com') {
    // Serve /community at the root of the community subdomain
    const assetPath = url.pathname === '/' ? '/community' : url.pathname;
    return env.ASSETS.fetch(new Request(new URL(assetPath, url), request));
  }

  if (host === 'professional.jgusewcomputers.com') {
    // Serve /professional at the root of the professional subdomain
    const assetPath = url.pathname === '/' ? '/professional' : url.pathname;
    return env.ASSETS.fetch(new Request(new URL(assetPath, url), request));
  }

  // Root domain and everything else: serve normally
  return next();
}
