import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

export interface FrontmatterLike {
	title?: string;
	description?: string;
	lead?: string;
}

interface MarkdownModule {
	default: AstroComponentFactory;
	frontmatter?: FrontmatterLike;
}

type MarkdownModuleLoader = () => Promise<MarkdownModule>;
type HtmlModuleLoader = () => Promise<string>;

interface LoadLocalizedContentOptions {
	locale: 'ja' | 'en';
	basePath: string;
	markdownModules: Record<string, MarkdownModuleLoader>;
	htmlModules?: Record<string, HtmlModuleLoader>;
}

export interface LocalizedContentResult {
	ContentComponent?: AstroComponentFactory;
	htmlContent: string;
	frontmatter?: FrontmatterLike;
	sourceType: 'markdown' | 'html';
	resolvedLocale: 'ja' | 'en';
	isFallback: boolean;
}

export async function loadLocalizedContent({
	locale,
	basePath,
	markdownModules,
	htmlModules = {},
}: LoadLocalizedContentOptions): Promise<LocalizedContentResult> {
	const candidates =
		locale === 'en'
			? [
					{ path: `${basePath}.en.md`, sourceType: 'markdown' as const, resolvedLocale: 'en' as const },
					{ path: `${basePath}.en.html`, sourceType: 'html' as const, resolvedLocale: 'en' as const },
					{ path: `${basePath}.md`, sourceType: 'markdown' as const, resolvedLocale: 'ja' as const },
					{ path: `${basePath}.html`, sourceType: 'html' as const, resolvedLocale: 'ja' as const },
				]
			: [
					{ path: `${basePath}.md`, sourceType: 'markdown' as const, resolvedLocale: 'ja' as const },
					{ path: `${basePath}.html`, sourceType: 'html' as const, resolvedLocale: 'ja' as const },
				];

	for (const candidate of candidates) {
		if (candidate.sourceType === 'markdown') {
			const loader = markdownModules[candidate.path];
			if (!loader) continue;

			const module = await loader();

			return {
				ContentComponent: module.default,
				htmlContent: '',
				frontmatter: module.frontmatter,
				sourceType: 'markdown',
				resolvedLocale: candidate.resolvedLocale,
				isFallback: locale === 'en' && candidate.resolvedLocale === 'ja',
			};
		}

		const loader = htmlModules[candidate.path];
		if (!loader) continue;

		return {
			htmlContent: await loader(),
			sourceType: 'html',
			resolvedLocale: candidate.resolvedLocale,
			isFallback: locale === 'en' && candidate.resolvedLocale === 'ja',
		};
	}

	throw new Error(`Missing localized content for ${basePath} (${locale})`);
}
