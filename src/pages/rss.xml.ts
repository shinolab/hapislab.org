import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getResearchTopics } from '../lib/research-topics';
import { siteMeta } from '../data/site';

interface NewsFrontmatter {
    title?: string;
    date?: string;
    expireDate?: string;
}

interface NewsModule {
    frontmatter?: NewsFrontmatter;
    rawContent?: () => string;
}

export async function GET(context: APIContext) {
    const researchTopics = getResearchTopics('ja');
    
    const newsModules = import.meta.glob<NewsModule>(
        '../content/top/news/*.md',
        { eager: true }
    );

    const newsItems = Object.entries(newsModules)
        .filter(([path]) => !path.endsWith('.en.md'))
        .map(([path, module]) => {
            const title = module.frontmatter?.title || 'News';
            const date = module.frontmatter?.date ? new Date(module.frontmatter.date) : new Date();
            return {
                title,
                pubDate: date,
                description: '', // Content is complex in these files
                link: '/',
            };
        });

    const items = [
        ...researchTopics.map((topic) => ({
            title: topic.title,
            pubDate: topic.date ? new Date(topic.date) : new Date(),
            description: topic.summary,
            link: topic.detailPath || `/research-topics/${topic.slug}/`,
        })),
        ...newsItems,
    ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

    return rss({
        title: siteMeta.japaneseName,
        description: '篠田・牧野研究室の最新情報',
        site: context.site!,
        items,
        customData: `<language>ja-jp</language>`,
    });
}
