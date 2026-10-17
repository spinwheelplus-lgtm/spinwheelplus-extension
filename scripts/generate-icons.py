from pathlib import Path
import shutil

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
NEXT_LOGO = Path(r"D:\NextJs\spinwheelplus\public\img\logo512.webp")
LOCAL_LOGO = ROOT / "public" / "img" / "logo512.webp"
ICON_DIR = ROOT / "public" / "icons"
IMG_DIR = ROOT / "public" / "img"
ICON_SIZES = (16, 32, 48, 128)


def resolve_source() -> Path:
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    if NEXT_LOGO.is_file():
        shutil.copyfile(NEXT_LOGO, LOCAL_LOGO)
        return LOCAL_LOGO
    if LOCAL_LOGO.is_file():
        return LOCAL_LOGO
    raise FileNotFoundError(
        f"Logo not found at {NEXT_LOGO} or {LOCAL_LOGO}",
    )


def save_png(image: Image.Image, size: int, dest: Path) -> None:
    resized = image.resize((size, size), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    resized.save(dest, format="PNG", optimize=True)


def main() -> None:
    source = resolve_source()
    logo = Image.open(source).convert("RGBA")
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    for size in ICON_SIZES:
        save_png(logo, size, ICON_DIR / f"icon{size}.png")
    save_png(logo, 64, IMG_DIR / "logo64.png")
    print(f"Wrote icons from {source} to {ICON_DIR}")
    print(f"Wrote UI logo {IMG_DIR / 'logo64.png'}")


if __name__ == "__main__":
    main()
