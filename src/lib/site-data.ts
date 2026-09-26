import * as yaml from 'js-yaml';
import articleYaml from '../data/publications/article.yml?raw';
import inproceedingsYaml from '../data/publications/inproceedings.yml?raw';
import demosYaml from '../data/publications/demos.yml?raw';
import domesticYaml from '../data/publications/domestic.yml?raw';

export interface Publication {
	year: number;
	type: 'article' | 'inproceedings' | 'demos' | 'domestic' | 'Others';
	title: string;
	refId?: string;
	authors: string[];
	lang?: 'ja' | 'en';
	journal?: string;
	booktitle?: string;
	volume?: string;
	number?: string;
	pages?: string;
	eventDate?: string;
	location?: string;
	doi?: string;
	note?: string;
	href?: string;
}

const publicationsYamlByType: [Publication['type'], string][] = [
	['article', articleYaml],
	['inproceedings', inproceedingsYaml],
	['demos', demosYaml],
	['domestic', domesticYaml],
];

export const publications: Publication[] = publicationsYamlByType
	.flatMap(([type, source]) =>
		((yaml.load(source) as Omit<Publication, 'type'>[]) || []).map((row) => ({ ...row, type })),
	)
	.map((row) => ({
		year: typeof row.year === 'number' ? row.year : Number.parseInt(row.year as any, 10) || 0,
		type: row.type,
		title: row.title?.trim() || '',
		refId: row.refId?.trim(),
		authors: Array.isArray(row.authors) ? row.authors : [],
		lang:
			row.type === 'domestic'
				? 'ja'
				: row.lang === 'ja' || row.lang === 'en'
					? row.lang
					: undefined,
		journal: row.journal?.trim(),
		booktitle: row.booktitle?.trim(),
		volume: row.volume?.toString(),
		number: row.number?.toString(),
		pages: row.pages?.toString().trim().replace('--', '–'),
		eventDate: row.eventDate?.trim(),
		location: row.location?.trim(),
		doi: row.doi?.trim(),
		note: row.note?.trim(),
		href: row.href?.trim() || (row.doi ? `https://doi.org/${row.doi.trim()}` : ''),
	}))
	.sort((left, right) => right.year - left.year);

export const publicationsByRefId = publications.reduce((map, publication) => {
	if (!publication.refId) return map;
	if (map.has(publication.refId)) {
		throw new Error(`Duplicate publication refId: ${publication.refId}`);
	}
	map.set(publication.refId, publication);
	return map;
}, new Map<string, Publication>());

export const getPublicationByRefId = (refId: string) =>
	publicationsByRefId.get(refId);
