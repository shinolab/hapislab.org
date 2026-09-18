import re

PAGES_FIELD = "pages:"


def validate_pages_line(line):
    if PAGES_FIELD not in line:
        return None

    content = line.split(PAGES_FIELD, 1)[1].strip().strip("'").strip('"')
    if not content:
        return None

    range_err_msg = (
        "Numeric range must use en dash (–) or double hyphen (--) without spaces"
    )

    # If it contains letters (Latin or CJK), it's considered an identifier or complex page, so OK.
    if re.search(r"[A-Za-z\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]", content):
        return None

    # Split by non-digit sequences
    parts = re.split(r"([^\d]+)", content)
    parts = [p for p in parts if p]

    nums = [p for p in parts if p.isdigit()]
    ops = [p for p in parts if not p.isdigit()]

    if len(nums) == 2:
        op = ops[0]
        # Valid range must be exactly en dash or -- without surrounding spaces
        if op not in ["\u2013", "--"]:
            return range_err_msg
    elif len(nums) > 2:
        # Complex cases like 1-1-1 or 95–99, 2008.
        # Check if it contains a valid range operator
        if "\u2013" in ops or "--" in ops:
            return None
        # Check if it's an ID-like string consisting only of hyphens (e.g., 1-1-1)
        if all(op == "-" for op in ops):
            return None
        # Otherwise, lists (1, 2, 3) or dates (2013/8/29) are disallowed
        return range_err_msg

    return None


_SIMPLE_RANGE_RE = re.compile(
    r"^(?P<q>['\"]?)[\s\u3000]*(?P<a>\d+)[\s\u3000]*"
    r"(?:[-\u2010-\u2015\u2212\uFF0D]+|[~\u301C\uFF5E])"
    r"[\s\u3000]*(?P<b>\d+)[\s\u3000]*(?P=q)(?P<rest>\s*(?:#.*)?)$"
)


def fix_pages_line(line):
    if validate_pages_line(line) is None:
        return line
    head, value = line.split(PAGES_FIELD, 1)
    newline = "\n" if value.endswith("\n") else ""
    m = _SIMPLE_RANGE_RE.match(value.strip())
    if not m:
        return line
    q = m.group("q")
    return f"{head}{PAGES_FIELD} {q}{m.group('a')}--{m.group('b')}{q}{m.group('rest')}{newline}"


def fix_name_line(line):
    return line.replace("\u3000", " ")


def validate_name(name, comment=""):
    # Extract comment from name string if present (e.g. "Name # comment")
    if "#" in name:
        name_part, comment_part = name.split("#", 1)
        name = name_part.strip()
        comment = (comment + " " + comment_part).strip()

    name = name.strip().strip("'").strip('"')
    if not name:
        return None

    if "\u3000" in name:
        return "Full-width space is not allowed. Use half-width space instead"

    # Check for Japanese names (CJK characters)
    if re.search(r"[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]", name):
        clean_name = re.sub(r"\s*(\(OB\)|\*|（.+）|\(.+\))$", "", name).strip()
        has_space = re.search(r"\s", clean_name) is not None
        allow_surname_only = "allow-surname-only" in comment

        if not has_space and not allow_surname_only:
            return "Japanese names must have a space between surname and given name unless '# allow-surname-only' comment is set"
    else:
        # English names
        if re.search(r"\b[A-Z]\.", name):
            allow_abbr = "allow-abbr" in comment
            if not allow_abbr:
                return "Abbreviated name is not allowed unless '# allow-abbr' comment is set"

    return None


def normalize_title(title):
    # Case-insensitive, ignore punctuation, ignore spaces and underscores.
    # \W matches any character which is NOT a word character (in any language).
    # We also explicitly remove underscores since \w includes them.
    return re.sub(r"[\W_]", "", title.lower())
