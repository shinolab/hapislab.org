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


def validate_name(name, comment=""):
    # Extract comment from name string if present (e.g. "Name # comment")
    if "#" in name:
        name_part, comment_part = name.split("#", 1)
        name = name_part.strip()
        comment = (comment + " " + comment_part).strip()

    name = name.strip().strip("'").strip('"')
    if not name:
        return None

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
