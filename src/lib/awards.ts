import yaml from 'js-yaml';
import awardsYaml from '../data/awards.yml?raw';

export interface Award {
	year: number;
	month: number;
	day: number;
	title: string;
	recipients: string[];
	award_name: string;
	org: string;
	href: string;
	external: boolean;
}

export const awards: Award[] = (yaml.load(awardsYaml) as Award[] || [])
	.sort((a, b) => {
		if (b.year !== a.year) return b.year - a.year;
		if (b.month !== a.month) return b.month - a.month;
		return b.day - a.day;
	});
