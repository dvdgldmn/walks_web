import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT.parent / "rules"

FILES = {
    "en": "Dosty_Walks_Leaderboard_SeasonPass_Rules_EN.docx",
    "az": "Dosty_Walks_Leaderboard_SeasonPass_Rules_AZ.docx",
}


def extract_lines(docx_path: Path):
    with zipfile.ZipFile(docx_path) as archive:
        xml = archive.read("word/document.xml")

    root = ET.fromstring(xml)
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    lines: list[str] = []

    for paragraph in root.findall(".//w:p", ns):
        texts = [node.text or "" for node in paragraph.findall(".//w:t", ns)]
        line = "".join(texts).strip()
        if line:
            lines.append(line)

    return lines


def main():
    for lang, file_name in FILES.items():
        lines = extract_lines(SOURCE / file_name)
        target = ROOT / f"tmp-rules-{lang}.txt"
        target.write_text("\n".join(lines) + "\n", encoding="utf-8")
        print(f"{lang}: {len(lines)} lines -> {target}")


if __name__ == "__main__":
    main()
