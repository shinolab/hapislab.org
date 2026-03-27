import yaml from 'js-yaml';
import publicationsYaml from '../data/publications.yml?raw';

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

export const publications: Publication[] = (yaml.load(publicationsYaml) as Publication[] || [])
	.map((row) => ({
		year: typeof row.year === 'number' ? row.year : Number.parseInt(row.year as any, 10) || 0,
		type: (row.type as any) || 'Others',
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
