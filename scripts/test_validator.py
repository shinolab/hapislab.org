from validator import (
    find_blank_lines_in_entries,
    fix_name_line,
    fix_pages_line,
    normalize_title,
    validate_name,
    validate_pages_line,
)


def test_normalize_title():
    assert normalize_title("Title") == "title"
    assert normalize_title("Title: Subtitle") == "titlesubtitle"
    assert normalize_title("Title Subtitle") == "titlesubtitle"
    assert normalize_title("Title-Subtitle") == "titlesubtitle"
    assert normalize_title("Title_Subtitle") == "titlesubtitle"
    assert normalize_title("タイトル: これ") == "タイトルこれ"
    assert normalize_title("タイトル　これ") == "タイトルこれ"
    assert normalize_title("A & B") == "ab"
    assert normalize_title("A.B.") == "ab"
    assert normalize_title("Quoted 'Title'") == "quotedtitle"


def test_validate_pages_line():
    range_err_msg = (
        "Numeric range must use en dash (–) or double hyphen (--) without spaces"
    )

    # Numeric ranges
    assert validate_pages_line("pages: 10--20") is None
    assert validate_pages_line("pages: 10–20") is None
    assert validate_pages_line("pages: 10-20") == range_err_msg
    assert validate_pages_line("pages: 10---20") == range_err_msg
    assert validate_pages_line("pages: 10 - 20") == range_err_msg
    assert validate_pages_line("pages: 10 -20") == range_err_msg
    assert validate_pages_line("pages: 10- 20") == range_err_msg
    assert validate_pages_line("pages: 10 – 20") == range_err_msg
    assert validate_pages_line("pages: 10　–　20") == range_err_msg
    assert validate_pages_line("pages: 1+13") == range_err_msg

    # Alphanumeric / IDs (should pass)
    assert validate_pages_line("pages: 1C3-6") is None
    assert validate_pages_line("pages: 1P1-T12") is None
    assert validate_pages_line("pages: PI-20-024") is None
    assert validate_pages_line("pages: 1A1-20a7") is None
    assert validate_pages_line("pages: 1-1-1") is None

    # Lists and dates (should not pass)
    assert validate_pages_line("pages: 1, 2, 3") == range_err_msg
    assert validate_pages_line("pages: 2013/8/29") == range_err_msg


def test_validate_name_japanese():
    name_err_msg = "Japanese names must have a space between surname and given name unless '# allow-surname-only' comment is set"

    assert validate_name("田中 太郎") is None
    assert (
        validate_name("田中　太郎")
        == "Full-width space is not allowed. Use half-width space instead"
    )
    assert validate_name("田中太郎") == name_err_msg
    assert validate_name("田中太郎 # allow-surname-only") is None
    assert validate_name("田中 太郎 (OB)") is None
    assert validate_name("田中太郎 (OB)") == name_err_msg


def test_validate_name_english_abbreviation():
    abbr_err_msg = (
        "Abbreviated name is not allowed unless '# allow-abbr' comment is set"
    )

    assert validate_name("Taro Tanaka") is None
    assert validate_name("T. Tanaka") == abbr_err_msg
    assert validate_name("T. Tanaka", "# allow-abbr") is None


def test_fix_pages_line():
    assert fix_pages_line("  pages: 10-20\n") == "  pages: 10--20\n"
    assert fix_pages_line("  pages: 10 - 20\n") == "  pages: 10--20\n"
    assert fix_pages_line("  pages: 10 – 20\n") == "  pages: 10--20\n"
    assert fix_pages_line("  pages: 10　–　20\n") == "  pages: 10--20\n"
    assert fix_pages_line("  pages: 10---20\n") == "  pages: 10--20\n"
    assert fix_pages_line("  pages: 10〜20\n") == "  pages: 10--20\n"
    assert fix_pages_line("  pages: '10-20'\n") == "  pages: '10--20'\n"

    for line in ["  pages: 10--20\n", "  pages: 10–20\n", "  pages: 1-1-1\n", "  pages: 1C3-6\n"]:
        assert fix_pages_line(line) == line

    for line in ["  pages: 1+13\n", "  pages: 1, 2, 3\n", "  pages: 2013/8/29\n"]:
        assert fix_pages_line(line) == line
        assert validate_pages_line(line) is not None


def test_fix_name_line():
    assert fix_name_line("    - 田中　太郎\n") == "    - 田中 太郎\n"
    assert validate_name(fix_name_line("田中　太郎")) is None


def test_find_blank_lines_in_entries():
    lines = [
        "- type: article\n",
        "  pages: \n",
        "\n",
        "  doi:\n",
        "\n",
        "- type: article\n",
        "  title: A\n",
        "  \n",
        "  \n",
        "  doi:\n",
        "  \n",
        "\n",
        "- type: article\n",
        "\n",
    ]
    assert find_blank_lines_in_entries(lines) == [2, 7, 8]
    assert find_blank_lines_in_entries(["\n", "  a: 1\n"]) == []
