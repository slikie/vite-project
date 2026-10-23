#!/usr/bin/env python3
"""Generate 全能签's appstore.json from catalog.json.

全能签 source schema (taken from a working third-party source, not guessed):

    {
      "name":        "<source name>",
      "sourceicon":  "<absolute https URL to a png>",
      "apps": [
        {
          "name":               "<app name>",
          "type":               "4",              # copied from the reference source
          "version":            "<CFBundleShortVersionString>",
          "versionDate":        "2026-10-10T21:07:12+08:00",
          "versionDescription": "<free text>",
          "bundleId":           "<CFBundleIdentifier>",
          "icon":               "<absolute https URL to a png>",
          "downUrl":            "<absolute https URL to an unsigned .ipa>",
          "minIos":             "15.0"
        }
      ],
      "news": [{"title": "", "content": "", "time": "YYYY-MM-DD"}]
    }

Every URL in the output must be absolute — 全能签 fetches the source from a phone
and cannot resolve relative paths — so a base URL is required.

Usage:
    ./build.py --base https://user.github.io/qnq-source
    ./build.py --base https://example.com/qnq --mirror     # also download the IPAs
                                                           # into apps/ and serve them
                                                           # from --base instead of upstream
"""
import argparse, hashlib, json, pathlib, shutil, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent
CATALOG = ROOT / "catalog.json"
OUT = ROOT / "appstore.json"


def sha256(path: pathlib.Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def mirror_ipa(app: dict) -> tuple[str, int, str]:
    """Download the IPA into apps/ and return (relative path, size, sha256)."""
    apps_dir = ROOT / "apps"
    apps_dir.mkdir(exist_ok=True)
    name = app.get("ipaMirrorName") or f"{app['name']}-{app['version']}.ipa"
    target = apps_dir / name
    if target.exists() and target.stat().st_size == app.get("ipaSize"):
        print(f"    cached  {name} ({target.stat().st_size} bytes)")
    else:
        print(f"    fetch   {app['ipaUrl']}")
        # curl handles the %2B in GitHub release asset names more reliably than urllib
        subprocess.run(["curl", "-sL", "--fail", "-o", str(target), app["ipaUrl"]], check=True)
        print(f"    saved   {name} ({target.stat().st_size} bytes)")
    digest = sha256(target)
    expected = app.get("ipaSha256")
    if expected and digest != expected:
        sys.exit(f"    ERROR sha256 mismatch for {name}\n      expected {expected}\n      got      {digest}")
    if expected:
        print("    sha256  ok")
    return f"apps/{name}", target.stat().st_size, digest


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True,
                    help="public https base URL of this repo, no trailing slash")
    ap.add_argument("--mirror", action="store_true",
                    help="serve the IPAs from this repo (apps/) instead of the upstream URL")
    args = ap.parse_args()

    base = args.base.rstrip("/")
    if not base.startswith("https://"):
        sys.exit("--base must be an https:// URL: 全能签 fetches over HTTPS from a phone")

    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    apps_out = []

    print(f"building for base {base}")
    for app in catalog["apps"]:
        print(f"  {app['name']} {app['version']}")
        icon = app["icon"]
        if args.mirror:
            rel, size, digest = mirror_ipa(app)
            down_url = f"{base}/{rel}"
        else:
            down_url = app["ipaUrl"]
            size, digest = app.get("ipaSize"), app.get("ipaSha256")

        entry = {
            "name": app["name"],
            "type": app.get("type", "4"),
            "version": app["version"],
            "versionDate": app["versionDate"],
            "versionDescription": app["versionDescription"],
            "bundleId": app["bundleId"],
            "icon": icon if icon.startswith("http") else f"{base}/{icon}",
            "downUrl": down_url,
            "minIos": app["minIos"],
        }
        apps_out.append(entry)
        if size:
            print(f"    size    {size/1024/1024:.1f} MiB")
        if digest:
            print(f"    sha256  {digest}")

    source = {
        "name": catalog["sourceName"],
        "sourceicon": f"{base}/{catalog['sourceIcon']}",
        "apps": apps_out,
        "news": catalog.get("news", []),
    }
    OUT.write_text(json.dumps(source, indent=4, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\nwrote {OUT.relative_to(ROOT)}  ({OUT.stat().st_size} bytes, {len(apps_out)} apps)")
    print(f"add this to 全能签 → 资源 → 软件源 → 添加第三方源:\n  {base}/appstore.json")


if __name__ == "__main__":
    main()
