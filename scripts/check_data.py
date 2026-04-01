import os
import re
import sys
from pathlib import Path

from validator import normalize_title, validate_name, validate_pages_line

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PUBLICATIONS_PATH = REPO_ROOT / "src" / "data" / "publications.yml"
DEFAULT_AWARDS_PATH = REPO_ROOT / "src" / "data" / "awards.yml"

TARGETS = {
    DEFAULT_AWARDS_PATH: ["recipients:", "authors:"],
    DEFAULT_PUBLICATIONS_PATH: ["authors:", "recipients:"],
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

    seen_titles = {}  # normalized -> (line_num, original_title)

    with open(file_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            # Capture titles. Indented by exactly two spaces as seen in publications.yml.
            match = re.match(r"^  title:\s*(.*)$", line)
            if match:
                raw_val = match.group(1).strip()
                title_part, comment = (
                    raw_val.split("#", 1) if "#" in raw_val else (raw_val, "")
                )
                # Remove quotes if present
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


def check_names(file_path, list_keys):
    errors = []
    if not os.path.exists(file_path):
        return errors
    in_list = False
    parent_indent = -1
    with open(file_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            stripped = line.strip()

            # Find the start of the list
            found_key = False
            for key in list_keys:
                if stripped.startswith(key):
                    in_list = True
                    parent_indent = len(line) - len(line.lstrip())
                    found_key = True
                    break
            if found_key:
                continue

            if in_list:
                current_indent = len(line) - len(line.lstrip())
                # If we have content and indentation is same or less than parent, we are out
                if stripped and current_indent <= parent_indent:
                    in_list = False
                    continue

                # Check for list item '-'
                match = re.match(r"^(\s*-\s*)(.+)$", line)
                if match:
                    raw_val = match.group(2).strip()
                    name_part, comment = (
                        raw_val.split("#", 1) if "#" in raw_val else (raw_val, "")
                    )
                    name = name_part.strip().strip("'").strip('"')

                    err = validate_name(name, comment)
                    if err:
                        errors.append(f"{file_path}:{i}: {err}: {line.strip()}")
    return errors


def main():
    all_errors = []
    for file_path, keys in TARGETS.items():
        all_errors.extend(check_names(file_path, keys))
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
