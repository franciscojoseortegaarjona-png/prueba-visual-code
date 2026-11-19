# Gestor de Novedades GEENIUS

El panel de edición estará en `https://asociaciongeenius.es/admin/`. Permite iniciar sesión con GitHub, editar las actividades y subir fotografías. Al guardar, Decap CMS crea un commit en este repositorio y GitHub Pages publica los cambios automáticamente.

## Preparación de OAuth

El OAuth Worker ya está creado en Cloudflare en `https://geenius-cms-oauth.cuentageenius.workers.dev`. No publiques el secreto de GitHub ni lo pongas en `admin/config.yml`.

1. En GitHub, crea una OAuth App en **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - **Application name:** `GEENIUS CMS`
   - **Homepage URL:** `https://geenius-cms-oauth.cuentageenius.workers.dev`
   - **Authorization callback URL:** `https://geenius-cms-oauth.cuentageenius.workers.dev/callback?provider=github`
2. En el Worker, añade `GITHUB_CLIENT_ID` como variable y `GITHUB_CLIENT_SECRET` como **secret**. No guardes el secreto en el repositorio.
3. Publica los cambios del panel en `main`, incluyendo `admin/config.yml` con la URL del Worker.
4. Abre `https://asociaciongeenius.es/admin/`, inicia sesión con la cuenta de GitHub que tiene permiso de escritura en el repositorio y autoriza la aplicación.

La OAuth App utiliza el permiso `public_repo` para escribir en el repositorio público. Autorízala solo desde la cuenta que debe editar el sitio. El Worker valida el origen de la web y el estado OAuth antes de entregar el token.

## Publicar novedades

En el panel, abre **Actividades → Novedades**. Añade el título, fecha, tipo y texto; completa lugar, objetivos, aprendizajes y experiencia solo cuando haya información disponible. Para adjuntar varias fotos, usa el campo **Fotografías** y agrega un texto alternativo descriptivo si es posible. También puedes definir el texto alternativo de la fotografía principal. Las galerías aceptan una foto principal y tantas adicionales como necesite la actividad; con una sola foto no se muestran controles vacíos. Guarda la entrada para publicarla. Las fotos quedan en `images/novedades/` y el contenido en `data/novedades.json`. El CMS mantiene el flujo actual: guarda los cambios en `main` y GitHub Pages publica al terminar el despliegue.

Las áreas se actualizan en `data/areas.json`: edita su texto o añade rutas a imágenes reales dentro de `imagenes`, con un `alt` para cada una. La formación práctica conserva la foto disponible; las otras áreas muestran su icono hasta que se agreguen fotografías.
# Gestor de Novedades GEENIUS

El panel de edición estará en `https://asociaciongeenius.es/admin/`. Permite iniciar sesión con GitHub, editar las actividades y subir fotografías. Al guardar, Decap CMS crea un commit en este repositorio y GitHub Pages publica los cambios automáticamente.

## Preparación de OAuth

El acceso se protege con un Cloudflare Worker. No publiques el secreto de GitHub ni lo pongas en `admin/config.yml`.

1. En Cloudflare, crea un Worker llamado `geenius-cms-oauth` y publica el contenido de `cloudflare-worker/worker.js`.
2. Anota la URL `https://geenius-cms-oauth.<tu-cuenta>.workers.dev` que muestra Cloudflare.
3. En GitHub, crea una OAuth App en **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - **Application name:** `GEENIUS CMS`
   - **Homepage URL:** la URL del Worker.
   - **Authorization callback URL:** la URL del Worker seguida de `/callback?provider=github`.
4. En el Worker, añade `GITHUB_CLIENT_ID` como variable y `GITHUB_CLIENT_SECRET` como **secret**. No guardes el secreto en el repositorio.
5. Cambia `backend.base_url` en `admin/config.yml` por la URL real del Worker y publica ese cambio en `main`.
6. Abre `https://asociaciongeenius.es/admin/`, inicia sesión con la cuenta de GitHub que tiene permiso de escritura en el repositorio y autoriza la aplicación.

La OAuth App se configura con permiso `public_repo` para escribir en repositorios públicos. Por tanto, autorízala solo desde la cuenta que debe editar el sitio. El Worker valida el origen de la web y el estado OAuth antes de entregar el token.

## Publicar novedades

En el panel, abre **Actividades → Novedades**. Añade el título, fecha, tipo y texto; completa lugar, objetivos, aprendizajes y experiencia solo cuando haya información disponible. Para adjuntar varias fotos, usa el campo **Fotografías** y agrega un texto alternativo descriptivo si es posible. También puedes definir el texto alternativo de la fotografía principal. Las galerías aceptan una foto principal y tantas adicionales como necesite la actividad; con una sola foto no se muestran controles vacíos. Guarda la entrada para publicarla. Las fotos quedan en `images/novedades/` y el contenido en `data/novedades.json`. El CMS mantiene el flujo actual: guarda los cambios en `main` y GitHub Pages publica al terminar el despliegue.

Las áreas se actualizan en `data/areas.json`: edita su texto o añade rutas a imágenes reales dentro de `imagenes`, con un `alt` para cada una. La formación práctica conserva la foto disponible; las otras áreas muestran su icono hasta que se agreguen fotografías.
