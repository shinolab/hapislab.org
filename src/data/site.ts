export interface TopicSummary {
	title: string;
	summary: string;
	image: string;
	imageAlt?: string;
	date?: string;
	updated?: string;
	detailPath?: string;
	detailPathEn?: string;
}

export interface SiteMeta {
	japaneseName: string;
	englishName: string;
}

export const siteMeta: SiteMeta = {
	japaneseName: '篠田・牧野研究室',
	englishName: 'Shinoda & Makino Lab',
};
