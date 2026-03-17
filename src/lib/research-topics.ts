import type { TopicSummary } from '../data/site';
import { resolveAssetObject } from './public-assets';

interface ResearchTopicFrontmatter {
	title?: string;
	titleEn?: string;
	summary?: string;
	summaryEn?: string;
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

export function getResearchTopics(): ResearchTopicListItem[] {
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
			const primary = (entry.ja ?? entry.en) as ResearchTopicFrontmatter;
			if (!primary?.title || !primary.summary || !primary.image) {
				return null;
			}

			return {
				slug: topicId,
				title: primary.title,
				titleEn: entry.en?.title ?? primary.titleEn,
				summary: primary.summary,
				summaryEn: entry.en?.summary ?? primary.summaryEn,
				image: resolveAssetObject(primary.image),
				imageAlt: primary.imageAlt,
				date: primary.date,
				updated: primary.updated,
				detailPath: `/research-topics/${topicId}`,
				detailPathEn: `/en/research-topics/${topicId}`,
			};
		})
		.filter((topic): topic is ResearchTopicListItem => topic !== null)
		.sort((left, right) => getDateValue(right).localeCompare(getDateValue(left)) || left.title.localeCompare(right.title));
}

export function getHomeResearchTopics(limit?: number): ResearchTopicListItem[] {
	const allTopics = getResearchTopics();
	return typeof limit === 'number' ? allTopics.slice(0, limit) : allTopics;
}
