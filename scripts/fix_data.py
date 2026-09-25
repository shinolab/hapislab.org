import sys

from check_data import DEFAULT_PUBLICATIONS_PATH, TARGETS, iter_name_items
from validator import (
    find_blank_lines_in_entries,
    fix_name_line,
    fix_pages_line,
)


def fix_file(file_path, list_keys):
    if not file_path.exists():
        return []
    with open(file_path, "r", encoding="utf-8", newline="") as f:
        lines = f.readlines()
    original = list(lines)

    for idx, _, _ in list(iter_name_items(lines, list_keys)):
        lines[idx] = fix_name_line(lines[idx])
    if file_path == DEFAULT_PUBLICATIONS_PATH:
        lines = [fix_pages_line(line) for line in lines]

    changes = [
        (i + 1, old.rstrip("\r\n"), new.rstrip("\r\n"))
        for i, (old, new) in enumerate(zip(original, lines))
        if old != new
    ]
    blank = set(find_blank_lines_in_entries(lines))
    changes.extend((idx + 1, "(blank line)", "(removed)") for idx in blank)
    changes.sort()
    lines = [line for idx, line in enumerate(lines) if idx not in blank]
    if changes:
        with open(file_path, "w", encoding="utf-8", newline="") as f:
            f.writelines(lines)
    return changes


def main():
    fixed = 0
    for file_path, keys in TARGETS.items():
        for lineno, old, new in fix_file(file_path, keys):
            print(f"{file_path.name}:{lineno}: `{old.strip()}` -> `{new.strip()}`")
            fixed += 1
    print(f"{fixed} line(s) fixed.", file=sys.stderr)


if __name__ == "__main__":
    main()
