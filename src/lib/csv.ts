import { parse } from 'csv-parse/sync';

export function readCsv(content: string): Record<string, string>[] {
	const rows = parse(content, {
		columns: true,
		skip_empty_lines: true,
		trim: true,
	}) as Array<Record<string, string | undefined>>;

	return rows.map((row) =>
		Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value ?? ''])),
	);
}
