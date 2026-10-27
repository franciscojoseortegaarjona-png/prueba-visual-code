# GEENIUS

Sitio web de la Asociación de Estudiantes de Energía de la ETSI Sevilla: https://asociaciongeenius.es

- **Gestor de contenido:** `/admin/` (actividades y calendario). Guía en [docs/CMS_SETUP.md](docs/CMS_SETUP.md).
- **Actualidad:** el workflow `GEENIUS - Actualidad de la Energía` consulta cada día los RSS del sector a las 06:00 UTC y actualiza `data/noticias.json`. Ejecución manual: GitHub → Actions → Run workflow.
- **Imágenes:** se optimizan solas al subirlas. Estructura completa en [docs/ESTRUCTURA.md](docs/ESTRUCTURA.md).
