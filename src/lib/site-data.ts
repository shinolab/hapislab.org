import { readCsv } from './csv';
import publicationsCsv from '../data/publications.csv?raw';

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
