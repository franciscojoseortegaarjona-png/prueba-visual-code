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

En el panel, abre **Actividades → Novedades**. Añade el título, fecha, tipo y texto. Para adjuntar varias fotos, usa el campo **Fotografías**: sube una y pulsa **Add fotografía** para agregar las demás. Guarda la entrada para publicarla. Las fotos quedan en `images/novedades/` y el contenido en `data/novedades.json`; la web se actualiza cuando termina el despliegue de GitHub Pages.
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

En el panel, abre **Actividades → Novedades**. Añade el título, fecha, tipo y texto. Para adjuntar varias fotos, usa el campo **Fotografías**: sube una y pulsa **Add fotografía** para agregar las demás. Guarda la entrada para publicarla. Las fotos quedan en `images/novedades/` y el contenido en `data/novedades.json`; la web se actualiza cuando termina el despliegue de GitHub Pages.
