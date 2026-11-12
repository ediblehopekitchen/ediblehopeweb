#!/usr/bin/env python3
"""Copies every photo (and the job PDF) off Squarespace into this repo.

Right now the site loads photos straight from Squarespace's servers. Once the
Squarespace subscription is cancelled those links will break, so run this
once BEFORE cancelling:

    python3 scripts/localize_images.py

It downloads each file into assets/img/ (or assets/docs/), rewrites every
.html file to point at the local copy, then you commit and push.
Uses only the Python standard library.
"""
import os, re, glob, hashlib, urllib.request, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATTERN = re.compile(
    r'https://images\.squarespace-cdn\.com/content/v1/[^"\s]+'
    r'|https://www\.ediblehopekitchen\.org/s/[^"\s]+\.pdf'
)

def local_name(url):
    parsed = urllib.parse.urlparse(url)
    base = urllib.parse.unquote(os.path.basename(parsed.path)).replace(" ", "-")
    stem, ext = os.path.splitext(base)
    stem = re.sub(r"[^A-Za-z0-9_-]+", "-", stem).strip("-").lower()
    size = urllib.parse.parse_qs(parsed.query).get("format", [""])[0]
    tag = hashlib.md5(parsed.path.encode()).hexdigest()[:6]
    folder = "docs" if ext.lower() == ".pdf" else "img"
    return f"assets/{folder}/{stem}-{tag}{('-' + size) if size else ''}{ext.lower()}"

def main():
    files = glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True)
    urls = set()
    for f in files:
        urls.update(PATTERN.findall(open(f, encoding="utf-8").read()))
    mapping = {}
    for url in sorted(urls):
        rel = local_name(url)
        dest = os.path.join(ROOT, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        if not os.path.exists(dest):
            print("downloading", rel)
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as out:
                out.write(r.read())
        mapping[url] = rel
    for f in files:
        text = open(f, encoding="utf-8").read()
        depth = os.path.relpath(os.path.dirname(f), ROOT).count(os.sep) + (0 if os.path.dirname(f) == ROOT else 1)
        prefix = "../" * depth
        new = PATTERN.sub(lambda m: prefix + mapping[m.group(0)], text)
        # Social-share images must stay absolute URLs.
        new = re.sub(r'(<meta property="og:image" content=")(?:\.\./)*(assets/[^"]+)', r'\1https://www.ediblehopekitchen.org/\2', new)
        if new != text:
            open(f, "w", encoding="utf-8").write(new)
    print(f"Done: {len(mapping)} files saved locally. Commit and push the changes.")

if __name__ == "__main__":
    main()
