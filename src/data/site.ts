export interface NavItem {
	href: string;
	label: string;
}

export interface TopicSummary {
	title: string;
	summary: string;
	image: string;
	imageAlt?: string;
	date?: string;
	updated?: string;
	detailPath?: string;
	titleEn?: string;
	summaryEn?: string;
	detailPathEn?: string;
}

export interface AwardHighlight {
	year: string;
	title: string;
	recipients: string;
}

export const siteMeta = {
	japaneseName: '篠田・牧野研究室',
	englishName: 'Shinoda & Makino Lab',
	tagline: 'Haptics & Applied Physics in Synthesis',
	description:
		'システムの中に新しい物理現象や物理的構造を導入することで、従来の壁を越える実世界情報環境を実現する研究室です。',
	affiliations: [
		'東京大学大学院 新領域創成科学研究科 複雑理工学専攻',
		'東京大学大学院 情報理工学系研究科 システム情報学専攻',
		'東京大学 工学部 計数工学科',
	],
};

export const primaryNav: NavItem[] = [
	{ href: '/', label: 'トップページ' },
	{ href: '/research-topics', label: '研究テーマ' },
	{ href: '/members', label: 'メンバー' },
	{ href: '/awards', label: '受賞' },
	{ href: '/publications', label: '発表論文' },
	{ href: '/access', label: 'アクセス' },
	{ href: '/links', label: 'リンク' },
];
