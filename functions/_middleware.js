/**
 * Cloudflare Pages Function — subdomain routing
 *
 * community.jgusewcomputers.com    →  /community.html
 * professional.jgusewcomputers.com →  /professional.html
 * admin.jgusewcomputers.com        →  /admin.html  (Cloudflare Access handles auth)
 *
 * Strategy: only intercept the root path (/). Redirect to the .html file.
 * Pages' own pretty-URL handling then serves the file cleanly.
 * All non-root paths (assets, sub-pages) fall through to Pages normally.
 */
export async function onRequest({ request, next }) {
  const url  = new URL(request.url);
  const host = url.hostname;

  // Only rewrite the root — let Pages handle everything else
  if (url.pathname !== '/') return next();

  if (host === 'community.jgusewcomputers.com')
    return Response.redirect(`https://community.jgusewcomputers.com/community.html`, 302);

  if (host === 'professional.jgusewcomputers.com')
    return Response.redirect(`https://professional.jgusewcomputers.com/professional.html`, 302);

  if (host === 'admin.jgusewcomputers.com')
    return Response.redirect(`https://admin.jgusewcomputers.com/admin.html`, 302);

  return next();
}
