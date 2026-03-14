export interface StaticPageEntry {
	slug: string;
	currentPath: string;
	kind: 'basic' | 'members' | 'publications' | 'topics' | 'awards';
	contentId?: string;
	title?: string;
	description?: string;
	lead?: string;
	introHtml?: string;
}

export const japaneseStaticPageEntries: StaticPageEntry[] = [
	{ slug: 'research-topics', currentPath: '/research-topics', kind: 'topics', contentId: 'research-topics' },
	{ slug: 'members', currentPath: '/members', kind: 'members', contentId: 'members' },
	{ slug: 'publications', currentPath: '/publications', kind: 'publications', contentId: 'publications' },
	{ slug: 'awards', currentPath: '/awards', kind: 'basic', contentId: 'awards' },
	{ slug: 'access', currentPath: '/access', kind: 'basic', contentId: 'access' },
	{ slug: 'links', currentPath: '/links', kind: 'basic', contentId: 'links' },
];

export const englishStaticPageEntries: StaticPageEntry[] = [
	{ slug: 'research-topics', currentPath: '/en/research-topics', kind: 'topics', contentId: 'research-topics' },
	{ slug: 'members', currentPath: '/en/members', kind: 'members', contentId: 'members' },
	{ slug: 'publications', currentPath: '/en/publications', kind: 'publications', contentId: 'publications' },
	{ slug: 'awards', currentPath: '/en/awards', kind: 'awards', contentId: 'awards' },
	{ slug: 'access', currentPath: '/en/access', kind: 'basic', contentId: 'access' },
	{ slug: 'links', currentPath: '/en/links', kind: 'basic', contentId: 'links' },
];
