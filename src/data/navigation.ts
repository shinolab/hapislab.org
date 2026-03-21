export interface NavItem {
    href: string;
    label: string;
}

const primaryNavByLocale = {
    ja: [
        { href: '/', label: 'トップページ' },
        { href: '/research-topics', label: '研究テーマ' },
        { href: '/members', label: 'メンバー' },
        { href: '/awards', label: '受賞' },
        { href: '/publications', label: '発表論文' },
        { href: '/access', label: 'アクセス' },
        { href: '/links', label: 'リンク' },
    ],
    en: [
        { href: '/en/', label: 'Top' },
        { href: '/en/research-topics', label: 'Topics' },
        { href: '/en/members', label: 'Members' },
        { href: '/en/awards', label: 'Awards' },
        { href: '/en/publications', label: 'Publications' },
        { href: '/en/access', label: 'Access' },
        { href: '/en/links', label: 'Links' },
    ],
} satisfies Record<'ja' | 'en', NavItem[]>;

export function getPrimaryNav(locale: 'ja' | 'en' = 'ja'): NavItem[] {
    return primaryNavByLocale[locale];
}
