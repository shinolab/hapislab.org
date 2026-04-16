import os
import re
import sys
import json
from pathlib import Path
from ruamel.yaml import YAML

REPO_ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = REPO_ROOT / "src" / "content"
DATA_DIR = REPO_ROOT / "src" / "data"
ORPHAN_WHITELIST_PATH = DATA_DIR / "orphan.yml"

yaml = YAML(typ='safe')

def load_yaml(path):
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return yaml.load(f) or []

def get_all_markdown_files():
    files = set()
    for ext in ["**/*.md", "**/*.mdx"]:
        for f in CONTENT_DIR.glob(ext):
            if f.is_file():
                files.add(f.relative_to(CONTENT_DIR))
    return files

def extract_links(text):
    # Match [text](link) and <a href="link">
    links = set()
    links.update(re.findall(r"\[.*?\]\(([^)]+)\)", text))
    links.update(re.findall(r'href=["\']([^"\']+)["\']', text))
    # Filter out external links
    results = set()
    for l in links:
        l = l.split("#")[0].split("?")[0]
        if not l or l.startswith(("http", "mailto", "tel")):
            continue
        results.add(l)
    return results

def get_slug_from_path(collection, rel_path):
    # rel_path relative to a collection dir (like CONTENT_DIR / "special-pages")
    path_str = str(rel_path)
    for suffix in [".en.mdx", ".en.md", ".en.html", ".mdx", ".md", ".html"]:
        if path_str.endswith(suffix):
            slug = path_str[:-len(suffix)]
            if slug == "index": return ""
            if slug.endswith("/index"): return slug[:-6]
            return slug
    return None

def resolve_link(link, current_slug):
    if link.startswith("/"):
        return link.strip("/")
    
    # Relative link resolution
    parts = current_slug.split("/") if current_slug else []
    link_parts = link.strip("/").split("/")
    
    # Basic relative path handling
    for p in link_parts:
        if p == ".":
            continue
        elif p == "..":
            if parts: parts.pop()
        else:
            parts.append(p)
    
    return "/".join(parts).strip("/")

def main():
    all_files = get_all_markdown_files()
    reachable_files = set()
    # Initial set of reachable URLs
    reachable_urls = {"", "en", "research-topics", "en/research-topics", "members", "en/members", "awards", "en/awards", "publications", "en/publications", "access", "en/access", "links", "en/links"}

    # Mapping of file to its slug (for BFS)
    file_to_slug = {}

    # 1. Add URLs and files from page-registry.ts
    page_registry_path = DATA_DIR / "page-registry.ts"
    if page_registry_path.exists():
        content = page_registry_path.read_text(encoding="utf-8")
        current_paths = re.findall(r"currentPath:\s*['\"]([^'\"]+)['\"]", content)
        for p in current_paths:
            reachable_urls.add(p.strip("/"))
        
        content_ids = re.findall(r"contentId:\s*['\"]([^'\"]+)['\"]", content)
        for cid in content_ids:
            for ext in ["md", "mdx", "html"]:
                for f in (CONTENT_DIR / "pages").glob(f"{cid}.{ext}"):
                    if f.is_file():
                        f_rel = f.relative_to(CONTENT_DIR)
                        reachable_files.add(f_rel)
                        file_to_slug[f_rel] = cid
                for f in (CONTENT_DIR / "pages").glob(f"{cid}.en.{ext}"):
                    if f.is_file():
                        f_rel = f.relative_to(CONTENT_DIR)
                        reachable_files.add(f_rel)
                        file_to_slug[f_rel] = cid

    # 2. Add URLs and files from members (staff.yml, students.yml)
    for yml in ["staff.yml", "students.yml"]:
        data = load_yaml(DATA_DIR / yml)
        for entry in data:
            href = entry.get("href", "")
            if href.startswith("/"):
                url = href.strip("/")
                reachable_urls.add(url)
                if url.startswith("members/"):
                    slug = url[len("members/"):].strip("/")
                    for ext in ["md", "mdx", "html"]:
                        for f in (CONTENT_DIR / "members").glob(f"{slug}.{ext}"):
                            if f.is_file():
                                f_rel = f.relative_to(CONTENT_DIR)
                                reachable_files.add(f_rel)
                                file_to_slug[f_rel] = url
                        for f in (CONTENT_DIR / "members").glob(f"{slug}.en.{ext}"):
                            if f.is_file():
                                f_rel = f.relative_to(CONTENT_DIR)
                                reachable_files.add(f_rel)
                                file_to_slug[f_rel] = url
                else:
                    # Might be a special page linked from staff list
                    slug = url
                    if slug.startswith("en/"): slug = slug[3:]
                    for f in (CONTENT_DIR / "special-pages").rglob("*"):
                        if f.is_file():
                            f_slug = get_slug_from_path("special-pages", f.relative_to(CONTENT_DIR / "special-pages"))
                            if f_slug == slug:
                                f_rel = f.relative_to(CONTENT_DIR)
                                reachable_files.add(f_rel)
                                file_to_slug[f_rel] = url

    # 3. Add Research Topics (automatically reachable if title/summary exists)
    topic_dir = CONTENT_DIR / "research-topics"
    for ext in ["*.md", "*.mdx"]:
        for f in topic_dir.glob(ext):
            if f.is_file():
                content = f.read_text(encoding="utf-8")
                if "title:" in content and "summary:" in content:
                    f_rel = f.relative_to(CONTENT_DIR)
                    reachable_files.add(f_rel)
                    slug = get_slug_from_path("research-topics", f.relative_to(topic_dir))
                    if slug is not None:
                        file_to_slug[f_rel] = f"research-topics/{slug}"
                        reachable_urls.add(f"research-topics/{slug}")
                        reachable_urls.add(f"en/research-topics/{slug}")

    # 4. Add News (automatically reachable from home)
    news_dir = CONTENT_DIR / "top" / "news"
    for ext in ["*.md", "*.mdx"]:
        for f in news_dir.glob(ext):
            if f.is_file():
                f_rel = f.relative_to(CONTENT_DIR)
                reachable_files.add(f_rel)
                file_to_slug[f_rel] = "" # Home

    # 5. Add URLs and files from projects.json
    for p_json in ["projects.json", "projects.en.json"]:
        path = CONTENT_DIR / "top" / p_json
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                try:
                    data = json.load(f)
                    for entry in data:
                        href = entry.get("href", "")
                        if href.startswith("/"):
                            url = href.strip("/")
                            reachable_urls.add(url)
                            # Map to special pages if possible
                            slug = url
                            if slug.startswith("en/"): slug = slug[3:]
                            for f in (CONTENT_DIR / "special-pages").rglob("*"):
                                if f.is_file():
                                    f_slug = get_slug_from_path("special-pages", f.relative_to(CONTENT_DIR / "special-pages"))
                                    if f_slug == slug:
                                        f_rel = f.relative_to(CONTENT_DIR)
                                        reachable_files.add(f_rel)
                                        file_to_slug[f_rel] = url
                except:
                    pass

    # 6. BFS for recursive reachability
    queue = list(reachable_files)
    processed_files = set()

    while queue:
        f_rel = queue.pop(0)
        if f_rel in processed_files:
            continue
        processed_files.add(f_rel)
        
        f_path = CONTENT_DIR / f_rel
        if not f_path.exists() or not f_path.is_file(): continue
        
        current_slug = file_to_slug.get(f_rel, "")
        content = f_path.read_text(encoding="utf-8")
        links = extract_links(content)
        
        for link in links:
            resolved_url = resolve_link(link, current_slug)
            if resolved_url not in reachable_urls:
                reachable_urls.add(resolved_url)
            
            # Map resolved_url to file
            slug = resolved_url
            if slug.startswith("en/"): slug = slug[3:]
            
            new_files = []
            if slug.startswith("members/"):
                m_slug = slug[len("members/"):].strip("/")
                for ext in ["md", "mdx", "html"]:
                    new_files.extend((CONTENT_DIR / "members").glob(f"{m_slug}.{ext}"))
                    new_files.extend((CONTENT_DIR / "members").glob(f"{m_slug}.en.{ext}"))
            elif slug.startswith("research-topics/"):
                t_slug = slug[len("research-topics/"):].strip("/")
                for ext in ["md", "mdx", "html"]:
                    new_files.extend((CONTENT_DIR / "research-topics").glob(f"{t_slug}.{ext}"))
                    new_files.extend((CONTENT_DIR / "research-topics").glob(f"{t_slug}.en.{ext}"))
            else:
                # Special pages or Static pages
                # Special pages
                for f in (CONTENT_DIR / "special-pages").rglob("*"):
                    if f.is_file():
                        f_slug = get_slug_from_path("special-pages", f.relative_to(CONTENT_DIR / "special-pages"))
                        if f_slug == slug:
                            new_files.append(f)
                # Pages
                for ext in ["md", "mdx", "html"]:
                    new_files.extend((CONTENT_DIR / "pages").glob(f"{slug}.{ext}"))
                    new_files.extend((CONTENT_DIR / "pages").glob(f"{slug}.en.{ext}"))

            for f in new_files:
                if f.is_file():
                    f_rel_new = f.relative_to(CONTENT_DIR)
                    if f_rel_new not in reachable_files:
                        reachable_files.add(f_rel_new)
                        file_to_slug[f_rel_new] = resolved_url
                        queue.append(f_rel_new)

    # 7. Final check
    whitelist = set(load_yaml(ORPHAN_WHITELIST_PATH))
    orphans = []
    for f in sorted(all_files):
        if f not in reachable_files and str(f) not in whitelist:
            orphans.append(f)

    if orphans:
        print("\nOrphan markdown files found (not reachable from top page):")
        for o in orphans:
            print(f"  src/content/{o}")
        print(f"\nIf these are intentional, add them to {ORPHAN_WHITELIST_PATH.relative_to(REPO_ROOT)}")
        sys.exit(1)
    else:
        print("No orphan markdown files found.")
        sys.exit(0)

if __name__ == "__main__":
    main()
