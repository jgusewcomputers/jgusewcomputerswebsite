export async function onRequest({ request, next }) {
  const url  = new URL(request.url);
  const host = url.hostname;

  if (url.pathname !== '/') return next();

  if (host === 'community.jgusewcomputers.com')
    return Response.redirect(`https://community.jgusewcomputers.com/community.html`, 302);
  if (host === 'professional.jgusewcomputers.com')
    return Response.redirect(`https://professional.jgusewcomputers.com/professional.html`, 302);
  if (host === 'admin.jgusewcomputers.com')
    return Response.redirect(`https://admin.jgusewcomputers.com/admin.html`, 302);

  // Debug: attach host to response so we can see what the Function receives
  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set('X-Debug-Host', host);
  return out;
}
