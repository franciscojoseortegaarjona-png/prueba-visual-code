"""Optimiza las imagenes que se suben desde el gestor de contenido.

Redimensiona a un maximo de 1600 px de ancho y recomprime las que pesan
demasiado, conservando el nombre y el formato para que los enlaces no cambien.
"""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
CARPETAS = ["images/novedades", "images/calendario"]
ANCHO_MAX = 1600
PESO_MAX = 300 * 1024


def optimizar(ruta: Path) -> bool:
    ext = ruta.suffix.lower()
    if ext not in {".jpg", ".jpeg", ".png", ".webp"}:
        return False
    with Image.open(ruta) as original:
        imagen = ImageOps.exif_transpose(original)
        imagen.load()
    if imagen.width <= ANCHO_MAX and ruta.stat().st_size <= PESO_MAX:
        return False
    redimensionada = imagen.width > ANCHO_MAX
    if redimensionada:
        imagen.thumbnail((ANCHO_MAX, ANCHO_MAX * 4), Image.LANCZOS)
    antes = ruta.stat().st_size
    temporal = ruta.with_name(ruta.name + ".tmp")
    if ext in {".jpg", ".jpeg"}:
        imagen.convert("RGB").save(temporal, "JPEG", quality=85, optimize=True, progressive=True)
    elif ext == ".webp":
        imagen.save(temporal, "WEBP", quality=90, method=6)
    else:
        imagen.save(temporal, "PNG", optimize=True)
    if redimensionada or temporal.stat().st_size < antes:
        temporal.replace(ruta)
        print(f"{ruta.relative_to(ROOT)}: {antes // 1024} KB -> {ruta.stat().st_size // 1024} KB")
        return True
    temporal.unlink()
    return False


def main() -> None:
    cambios = 0
    for carpeta in CARPETAS:
        for ruta in sorted((ROOT / carpeta).rglob("*")):
            if ruta.is_file() and optimizar(ruta):
                cambios += 1
    print(f"Imagenes optimizadas: {cambios}")


if __name__ == "__main__":
    main()
