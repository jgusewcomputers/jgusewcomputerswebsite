/**
 * Cloudflare Pages Function — subdomain routing middleware
 *
 * community.jgusewcomputers.com   →  serves /community  (community.html)
 * professional.jgusewcomputers.com →  serves /professional (professional.html)
 * jgusewcomputers.com             →  three-panel landing (index.html)
 *
 * env.ASSETS.fetch must be called with the PRIMARY domain URL so Pages
 * can resolve the file path from its own asset manifest.
 */
export async function onRequest({ request, next, env }) {
  const url  = new URL(request.url);
  const host = url.hostname;

  if (host === 'community.jgusewcomputers.com') {
    // Rewrite root → /community; pass through any other path unchanged
    const path = url.pathname === '/' ? '/community' : url.pathname;
    const assetUrl = new URL(path + url.search, 'https://jgusewcomputers.com');
    try {
      return await env.ASSETS.fetch(new Request(assetUrl, request));
    } catch {
      // ASSETS binding unavailable — fall back to visible redirect
      return Response.redirect(new URL('/community', url).href, 302);
    }
  }

  if (host === 'professional.jgusewcomputers.com') {
    const path = url.pathname === '/' ? '/professional' : url.pathname;
    const assetUrl = new URL(path + url.search, 'https://jgusewcomputers.com');
    try {
      return await env.ASSETS.fetch(new Request(assetUrl, request));
    } catch {
      return Response.redirect(new URL('/professional', url).href, 302);
    }
  }

  if (host === 'admin.jgusewcomputers.com') {
    // Serve the admin dashboard.
    // Cloudflare Access (Zero Trust) handles Google auth before this runs.
    const assetUrl = new URL('/admin' + url.search, 'https://jgusewcomputers.com');
    try {
      return await env.ASSETS.fetch(new Request(assetUrl, request));
    } catch {
      return Response.redirect(new URL('/admin', url).href, 302);
    }
  }

  return next();
}
