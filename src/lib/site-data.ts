import { readCsv } from './csv';
import membersCsv from '../data/members.csv?raw';
import publicationsCsv from '../data/publications.csv?raw';

export interface Member {
	group: string;
	name: string;
	nameEn: string;
	role: string;
	focus: string;
	focusEn: string;
	slug: string;
	slugEn: string;
	href: string;
	detailPath: string;
	detailPathEn: string;
}

export interface Publication {
	year: number;
	category: string;
	title: string;
	authors: string;
	venue: string;
	href: string;
}

function requiredField(row: Record<string, string>, field: string): string {
	const value = row[field]?.trim();

	if (!value) {
		throw new Error(`Missing required field "${field}" in CSV row.`);
	}

	return value;
}

export const members: Member[] = readCsv(membersCsv).map((row) => ({
	group: requiredField(row, 'group'),
	name: requiredField(row, 'name'),
	nameEn: row.nameEn?.trim() ?? '',
	role: requiredField(row, 'role'),
	focus: requiredField(row, 'focus'),
	focusEn: row.focusEn?.trim() ?? '',
	slug: row.slug?.trim() ?? '',
	slugEn: row.slugEn?.trim() ?? '',
	href: row.href?.trim() ?? '',
	detailPath: row.slug?.trim() ? `/${row.slug.trim()}` : '',
	detailPathEn: row.slugEn?.trim() ? `/en/${row.slugEn.trim()}` : '',
}));

export const publications: Publication[] = readCsv(publicationsCsv)
	.map((row) => ({
		year: Number.parseInt(requiredField(row, 'year'), 10),
		category: requiredField(row, 'category'),
		title: requiredField(row, 'title'),
		authors: requiredField(row, 'authors'),
		venue: requiredField(row, 'venue'),
		href: row.href?.trim() ?? '',
	}))
	.sort((left, right) => right.year - left.year);
