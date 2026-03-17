import yaml from 'js-yaml';
import awardsYaml from '../data/awards.yml?raw';

export interface Award {
	year: number;
	month?: number;
	day?: number;
	title: string;
	recipients: string[];
	award: string;
	org: string;
	href: string;
	external: boolean;
}

export const awards: Award[] = (yaml.load(awardsYaml) as Award[] || [])
	.sort((a, b) => {
		if (b.year !== a.year) return b.year - a.year;
		const monthDiff = (b.month ?? 0) - (a.month ?? 0);
		if (monthDiff !== 0) return monthDiff;
		return (b.day ?? 0) - (a.day ?? 0);
	});
