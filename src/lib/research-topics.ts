import type { TopicSummary } from '../data/site';
import { resolveAssetObject } from './public-assets';

interface ResearchTopicFrontmatter {
	title?: string;
	titleEn?: string;
	summary?: string;
	thumbnail?: string;
	thumbnailAlt?: string;
	image?: string;
	imageAlt?: string;
	date?: string;
	updated?: string;
	detailPath?: string;
	detailPathEn?: string;
}

interface MarkdownModule {
	frontmatter?: ResearchTopicFrontmatter;
}

export interface ResearchTopicListItem extends Omit<TopicSummary, 'image'> {
	slug: string;
	image: any;
}

const ENGLISH_SUMMARY_FALLBACK = 'Sorry, this entry is only available in Japanese.';

const topicModules = import.meta.glob('../content/research-topics/*.{md,mdx}', {
	eager: true,
});

function getTopicId(path: string): string {
	return path.replace(/^.*\/([^/]+?)(?:\.en)?\.mdx?$/, '$1');
}

function isEnglishModule(path: string): boolean {
	return /\.en\.mdx?$/.test(path);
}

function getDateValue(frontmatter?: ResearchTopicFrontmatter): string {
	return frontmatter?.date ?? '';
}

export function getResearchTopics(locale: 'ja' | 'en' = 'ja'): ResearchTopicListItem[] {
	const groupedTopics = new Map<
		string,
		{ ja?: ResearchTopicFrontmatter; en?: ResearchTopicFrontmatter }
	>();

	for (const [path, moduleValue] of Object.entries(topicModules)) {
		const module = moduleValue as MarkdownModule;
		const frontmatter = module.frontmatter;

		if (!frontmatter?.title || !frontmatter.summary) {
			continue;
		}

		const topicId = getTopicId(path);
		const existing = groupedTopics.get(topicId) ?? {};

		if (isEnglishModule(path)) {
			existing.en = frontmatter;
		} else {
			existing.ja = frontmatter;
		}

		groupedTopics.set(topicId, existing);
	}

	return [...groupedTopics.entries()]
		.map(([topicId, entry]): ResearchTopicListItem | null => {
			const japanese = entry.ja;
			const english = entry.en;
			const primary = (japanese ?? english) as ResearchTopicFrontmatter;
			const localized = (locale === 'en' ? (english ?? japanese) : (japanese ?? english)) as ResearchTopicFrontmatter;
			const thumbnailPath =
				localized?.thumbnail ??
				localized?.image ??
				primary?.thumbnail ??
				primary?.image;
			if (!primary?.title || !primary.summary || !thumbnailPath) {
				return null;
			}

			const title =
				locale === 'en'
					? english?.title ?? japanese?.titleEn ?? primary.title
					: primary.title;
			const summary =
				locale === 'en'
					? english?.summary ?? ENGLISH_SUMMARY_FALLBACK
					: primary.summary;

			return {
				slug: topicId,
				title,
				summary,
				image: resolveAssetObject(thumbnailPath),
				imageAlt:
					localized?.thumbnailAlt ??
					localized?.imageAlt ??
					primary.thumbnailAlt ??
					primary.imageAlt,
				date: primary.date,
				updated: primary.updated,
				detailPath: `/research-topics/${topicId}`,
				detailPathEn: `/en/research-topics/${topicId}`,
			};
		})
		.filter((topic): topic is ResearchTopicListItem => topic !== null)
		.sort((left, right) => getDateValue(right).localeCompare(getDateValue(left)) || left.title.localeCompare(right.title));
}

export function getHomeResearchTopics(locale: 'ja' | 'en' = 'ja', limit?: number): ResearchTopicListItem[] {
	const allTopics = getResearchTopics(locale);
	return typeof limit === 'number' ? allTopics.slice(0, limit) : allTopics;
}
