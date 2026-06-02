/**
 * Cloudflare Pages Function — subdomain routing middleware
 *
 * community.jgusewcomputers.com    →  community.html
 * professional.jgusewcomputers.com →  professional.html
 * admin.jgusewcomputers.com        →  admin.html  (protected by Cloudflare Access)
 * jgusewcomputers.com              →  index.html (three-panel landing)
 *
 * env.ASSETS.fetch needs the literal filename (with .html extension) —
 * it does not resolve pretty-URL paths the way Pages routing does.
 */
export async function onRequest({ request, next, env }) {
  const url  = new URL(request.url);
  const host = url.hostname;

  const serveFile = async (filename, fallbackPath) => {
    const assetUrl = new URL(filename, 'https://jgusewcomputers.com');
    try {
      return await env.ASSETS.fetch(new Request(assetUrl, request));
    } catch {
      // ASSETS binding unavailable — visible redirect as fallback
      return Response.redirect(
        new URL(fallbackPath, `https://${host}`).href, 302
      );
    }
  };

  if (host === 'community.jgusewcomputers.com')    return serveFile('/community.html',    '/community');
  if (host === 'professional.jgusewcomputers.com') return serveFile('/professional.html', '/professional');
  if (host === 'admin.jgusewcomputers.com')        return serveFile('/admin.html',        '/admin');

  return next();
}
