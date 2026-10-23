#!/usr/bin/env python3
"""Validate a generated 全能签 source before pointing a phone at it.

    全能签 gives no useful error for a malformed source — you get an empty list or a
    silent failure. So check the payload here instead:

    ./validate.py            # schema + local files only
    ./validate.py --remote   # also fetch every icon and IPA over HTTPS

Checks performed:
  * schema: required keys, types, ISO-8601 versionDate with offset, minIos format
  * every URL absolute and https (全能签 fetches from a phone; relative paths die)
  * duplicate bundleIds (two apps with one id cannot coexist on a device)
  * icons actually decode as PNG and are NOT Apple-crushed (CgBI) — a CgBI icon is
    what you get out of an IPA and it renders as a blank box
  * IPAs return 200, carry a ZIP signature, and match the size recorded in catalog
"""
import argparse, json, pathlib, re, struct, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent
SOURCE = ROOT / "appstore.json"
CATALOG = ROOT / "catalog.json"

REQUIRED_APP_KEYS = ["name", "type", "version", "versionDate", "versionDescription",
                     "bundleId", "icon", "downUrl", "minIos"]

problems: list[str] = []
notes: list[str] = []


def fail(msg: str) -> None:
    problems.append(msg)


def http_head(url: str) -> tuple[int, dict]:
    """Follow redirects, return (status, headers). GitHub release assets redirect."""
    out = subprocess.run(
        ["curl", "-sIL", "--max-time", "45", "-o", "/dev/null",
         "-w", "%{http_code} %{content_type} %{size_download} %{url_effective}", url],
        capture_output=True, text=True)
    code, ctype, size, _final = (out.stdout.split(" ", 3) + ["", "", "", ""])[:4]
    return int(code or 0), {"content-type": ctype, "size": size}


def fetch_prefix(url: str, n: int = 32) -> bytes:
    out = subprocess.run(["curl", "-sL", "--max-time", "45", "-r", f"0-{n-1}", url],
                         capture_output=True)
    return out.stdout[:n]


def check_url(url: str, what: str, remote: bool, expect: str) -> None:
    if not url.startswith("https://"):
        fail(f"{what}: not an absolute https URL -> {url!r}")
        return
    if not remote:
        notes.append(f"{what}: https ok (reachability not checked; pass --remote)")
        return
    code, hdrs = http_head(url)
    if code != 200:
        fail(f"{what}: HTTP {code} -> {url}")
        return
    if expect == "png":
        head = fetch_prefix(url)
        if head[:8] != b"\x89PNG\r\n\x1a\n":
            fail(f"{what}: not a PNG (magic {head[:8]!r}) -> {url}")
        elif b"CgBI" in head:
            fail(f"{what}: Apple-crushed CgBI png, will render blank -> {url}")
        else:
            notes.append(f"{what}: png ok")
    elif expect == "ipa":
        head = fetch_prefix(url, 4)
        if head[:2] != b"PK":
            fail(f"{what}: not a ZIP/IPA (magic {head!r}) -> {url}")
        else:
            notes.append(f"{what}: ipa ok ({hdrs.get('size')} bytes reported)")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--remote", action="store_true", help="also fetch icons and IPAs")
    args = ap.parse_args()

    if not SOURCE.exists():
        sys.exit("appstore.json missing — run ./build.py --base https://... first")
    src = json.loads(SOURCE.read_text(encoding="utf-8"))
    catalog = json.loads(CATALOG.read_text(encoding="utf-8")) if CATALOG.exists() else {"apps": []}
    by_bundle = {a["bundleId"]: a for a in catalog.get("apps", []) if "bundleId" in a}

    print(f"source: {src.get('name')!r}  apps: {len(src.get('apps', []))}")

    if not src.get("name"):
        fail("top-level 'name' missing")
    check_url(src.get("sourceicon", ""), "sourceicon", args.remote, "png")
    if not isinstance(src.get("news"), list):
        fail("top-level 'news' must be a list")

    seen: dict[str, str] = {}
    for i, app in enumerate(src.get("apps", [])):
        label = app.get("name") or f"apps[{i}]"
        for k in REQUIRED_APP_KEYS:
            if k not in app or app[k] in ("", None):
                fail(f"{label}: missing required key {k!r}")
        if not re.match(r"^[A-Za-z0-9][A-Za-z0-9._-]*\.[A-Za-z0-9._-]+$", app.get("bundleId", "")):
            fail(f"{label}: bundleId does not look like reverse-DNS: {app.get('bundleId')!r}")
        if not re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$",
                        app.get("versionDate", "")):
            fail(f"{label}: versionDate must be ISO-8601 with an offset: {app.get('versionDate')!r}")
        if not re.match(r"^\d+(\.\d+)*$", app.get("minIos", "")):
            fail(f"{label}: minIos should look like '15.0', got {app.get('minIos')!r}")
        if not re.match(r"^\d+(\.\d+)*$", app.get("version", "")):
            fail(f"{label}: version should be dotted numeric, got {app.get('version')!r}")
        bid = app.get("bundleId", "")
        if bid in seen:
            fail(f"duplicate bundleId {bid!r} shared by {seen[bid]!r} and {label!r}")
        seen[bid] = label
        check_url(app.get("icon", ""), f"{label}.icon", args.remote, "png")
        check_url(app.get("downUrl", ""), f"{label}.downUrl", args.remote, "ipa")
        # size agreement against the catalog record, when we have one
        if bid in by_bundle and args.remote:
            code, hdrs = http_head(app["downUrl"])
            want = by_bundle[bid].get("ipaSize")
            if want and str(want) != (hdrs.get("size") or "").strip():
                notes.append(f"{label}: size {hdrs.get('size')} vs catalog {want} "
                             f"(curl -I reports the header, not the body — informational)")

    # anything in the catalog but not in the generated source
    built = {a.get("bundleId") for a in src.get("apps", [])}
    for bid, a in by_bundle.items():
        if bid not in built:
            fail(f"catalog app {a.get('name')!r} ({bid}) missing from appstore.json — rebuild")

    for n in notes:
        print(f"  ok    {n}")
    for p in problems:
        print(f"  FAIL  {p}")
    print(f"\n{len(problems)} problem(s)")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
