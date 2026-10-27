# Estructura del proyecto

```
index.html                 La web (una sola página)
CNAME                      Dominio asociaciongeenius.es
README.md                  Resumen del proyecto
admin/                     Gestor de contenido (Decap CMS) en /admin/
data/
  novedades.json           Actividades de "Novedades" (se edita desde el gestor)
  calendario.json          Diapositivas del calendario (se edita desde el gestor)
  noticias.json            Actualidad del sector (se actualiza sola cada día)
images/
  calendario/              Imágenes del calendario (01.webp ...) y miniaturas/
  novedades/               Fotos subidas desde el gestor
  secciones/               Fotos fijas de la web (800 y 1600 px)
  logos/                   Logos y favicon
scripts/
  update_renewable_news.py Descarga las noticias del sector
  optimize_images.py       Reduce el peso de las imágenes subidas
cloudflare-worker/         Acceso OAuth del gestor
.github/workflows/         Tareas automáticas (noticias diarias, optimizar imágenes)
docs/                      Documentación
```

## Imágenes

- Formato WebP (mismo aspecto con menos peso). Los logos están en WebP sin pérdida.
- Las imágenes que se suban desde el gestor se redimensionan a 1600 px de ancho como máximo y se recomprimen solas (tarea "Optimizar imágenes").
- Calendario: sube imágenes horizontales 16:9 (por ejemplo 1600x900) desde el gestor, en **Calendario**.
