import os
import re
import sys
from pathlib import Path

from validator import normalize_title, validate_name, validate_pages_line

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PUBLICATIONS_PATH = REPO_ROOT / "src" / "data" / "publications.yml"
DEFAULT_AWARDS_PATH = REPO_ROOT / "src" / "data" / "awards.yml"

TARGETS = {
    DEFAULT_AWARDS_PATH: ["recipients:"],
    DEFAULT_PUBLICATIONS_PATH: ["authors:"],
}

ALLOWED_KEYS = {
    DEFAULT_PUBLICATIONS_PATH: {
        "address",
        "articleno",
        "authors",
        "booktitle",
        "doi",
        "eventDate",
        "href",
        "issue",
        "journal",
        "lang",
        "location",
        "note",
        "number",
        "numpages",
        "pages",
        "publisher",
        "refId",
        "series",
        "title",
        "type",
        "volume",
        "year",
    },
    DEFAULT_AWARDS_PATH: {
        "award",
        "day",
        "external",
        "month",
        "org",
        "recipients",
        "title",
        "year",
    },
}


def check_pages(file_path):
    errors = []
    if not os.path.exists(file_path):
        return errors
    with open(file_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            err = validate_pages_line(line)
            if err:
                errors.append(f"{file_path}:{i}: {err}: {line.strip()}")
    return errors


def check_duplicates(file_path):
    errors = []
    if not os.path.exists(file_path):
        return errors

    seen_titles = {} 

    with open(file_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            match = re.match(r"^  title:\s*(.*)$", line)
            if match:
                raw_val = match.group(1).strip()
                title_part, comment = (
                    raw_val.split("#", 1) if "#" in raw_val else (raw_val, "")
                )
                title = title_part.strip().strip("'").strip('"')

                if not title:
                    continue

                if "allow-duplicate" in comment:
                    continue

                norm = normalize_title(title)
                if not norm:
                    continue

                if norm in seen_titles:
                    prev_line, _ = seen_titles[norm]
                    errors.append(
                        f"{file_path}:{i}: Duplicate title found: \"{title}\" (already appears at line {prev_line})"
                    )
                else:
                    seen_titles[norm] = (i, title)
    return errors


def iter_name_items(lines, list_keys):
    in_list = False
    parent_indent = -1
    for idx, line in enumerate(lines):
        stripped = line.strip()

        if any(stripped.startswith(key) for key in list_keys):
            in_list = True
            parent_indent = len(line) - len(line.lstrip())
            continue

        if in_list:
            current_indent = len(line) - len(line.lstrip())
            if stripped and current_indent <= parent_indent:
                in_list = False
                continue

            match = re.match(r"^(\s*-\s*)(.+)$", line)
            if match:
                raw_val = match.group(2).strip()
                name_part, comment = (
                    raw_val.split("#", 1) if "#" in raw_val else (raw_val, "")
                )
                name = name_part.strip().strip("'").strip('"')
                yield idx, name, comment


def check_names(file_path, list_keys):
    errors = []
    if not os.path.exists(file_path):
        return errors
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    for idx, name, comment in iter_name_items(lines, list_keys):
        err = validate_name(name, comment)
        if err:
            errors.append(f"{file_path}:{idx + 1}: {err}: {lines[idx].strip()}")
    return errors


def check_keys(file_path):
    errors = []
    if not os.path.exists(file_path):
        return errors
    allowed = ALLOWED_KEYS.get(file_path, set())
    with open(file_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            match = re.match(r"^(- |  )([a-zA-Z]+):", line)
            if match:
                key = match.group(2)
                if key not in allowed:
                    errors.append(f"{file_path}:{i}: Unknown key found: \"{key}\"")
    return errors


def main():
    all_errors = []
    for file_path, keys in TARGETS.items():
        all_errors.extend(check_names(file_path, keys))
        all_errors.extend(check_keys(file_path))
    all_errors.extend(check_pages(DEFAULT_PUBLICATIONS_PATH))
    all_errors.extend(check_duplicates(DEFAULT_PUBLICATIONS_PATH))
    if all_errors:
        print("\nValidation Failed:")
        for error in all_errors:
            print(error)
        sys.exit(1)
    else:
        print("Validation Passed.")
        sys.exit(0)


if __name__ == "__main__":
    main()
