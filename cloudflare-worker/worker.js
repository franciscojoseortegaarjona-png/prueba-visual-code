const SITE_ORIGIN = 'https://asociaciongeenius.es';
const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const STATE_COOKIE = 'geenius_oauth_state';

function response(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      ...headers,
    },
  });
}

function cookieValue(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookie = cookieHeader.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return cookie ? cookie.slice(name.length + 1) : '';
}

function validCmsRequest(request) {
  const referrer = request.headers.get('Referer');
  const origin = request.headers.get('Origin');

  try {
    return Boolean(referrer && new URL(referrer).origin === SITE_ORIGIN) &&
      (!origin || origin === SITE_ORIGIN);
  } catch {
    return false;
  }
}

function randomState() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function htmlResponse(script) {
  const nonce = randomState();
  const html = `<!doctype html>
<html lang="es">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Acceso al gestor GEENIUS</title>
<body><p>Conectando con el gestor de GEENIUS…</p>
<script nonce="${nonce}">${script}</script></body>
</html>`;

  return response(html, 200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'`,
    'X-Frame-Options': 'DENY',
  });
}

function sendToCms(status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)
    .replaceAll('<', '\\u003c')}`;
  return htmlResponse(
    `if (window.opener) { window.opener.postMessage("authorizing:github", ${JSON.stringify(SITE_ORIGIN)}); ` +
    `window.opener.postMessage(${JSON.stringify(message)}, ${JSON.stringify(SITE_ORIGIN)}); window.close(); }`
  );
}

function authError(message, status = 400) {
  return response(message, status, { 'Content-Type': 'text/plain; charset=utf-8' });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== 'GET') {
      return authError('Método no permitido.', 405);
    }

    if (url.pathname === '/auth') {
      if (url.searchParams.get('provider') !== 'github' || !validCmsRequest(request)) {
        return authError('Solicitud de acceso no válida.', 403);
      }
      if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
        return authError('El proveedor OAuth todavía no está configurado.', 503);
      }

      const state = randomState();
      const callback = `https://${url.host}/callback?provider=github`;
      const authorize = new URL(GITHUB_AUTHORIZE_URL);
      authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authorize.searchParams.set('redirect_uri', callback);
      authorize.searchParams.set('scope', 'public_repo');
      authorize.searchParams.set('state', state);

      return response(null, 302, {
        Location: authorize.toString(),
        'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      });
    }

    if (url.pathname === '/callback') {
      const state = url.searchParams.get('state') || '';
      const savedState = cookieValue(request, STATE_COOKIE);
      const code = url.searchParams.get('code');

      if (url.searchParams.get('provider') !== 'github' ||
          !state || !savedState || state !== savedState || !code) {
        return authError('No se pudo validar el acceso. Cierra la ventana y vuelve a intentarlo.');
      }
      if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
        return authError('El proveedor OAuth todavía no está configurado.', 503);
      }

      const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `https://${url.host}/callback?provider=github`,
          state,
        }),
      });

      if (!tokenResponse.ok) {
        return authError('GitHub no pudo completar la autenticación. Vuelve a intentarlo.', 502);
      }
      const tokenData = await tokenResponse.json();
      if (tokenData.error || typeof tokenData.access_token !== 'string') {
        return authError('GitHub no pudo completar la autenticación. Vuelve a intentarlo.', 502);
      }

      const callbackResponse = sendToCms('success', { token: tokenData.access_token });
      callbackResponse.headers.set(
        'Set-Cookie',
        `${STATE_COOKIE}=; Path=/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
      );
      return callbackResponse;
    }

    return authError('No encontrado.', 404);
  },
};
