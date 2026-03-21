export interface HomePageContent {
    tabTitle: string;
    heroTitle: string;
    heroSubtitle?: string;
    description: string;
    overviewHeading: string;
    newsHeading: string;
    affiliationsHeading: string;
    projectsHeading: string;
    latestHeading: string;
    carouselLabel: string;
    carouselPreviousLabel: string;
    carouselNextLabel: string;
    affiliations: string[];
    formatDate(date?: string): string;
}

const homePageContentByLocale = {
    ja: {
        tabTitle: '篠田・牧野研究室',
        heroTitle: 'これから始まるハプティクス',
        description: `システムの中に新しい物理現象や物理的構造を導入することで,
従来の壁を越える実世界情報環境を実現します．
特に人間，環境，その相互作用のセンシングや，感覚に働きかけて人間を支援する技術について，
ハードウエアレベルからの提案を行っています．
斬新な発想に基づく基礎的・普遍的成果を目指すとともに，それらが人々の問題を解決し，
実用技術として幅広く活用されるまでのプロセスも研究のテーマに含まれます．

なかでも人間の触覚を有効活用するハプティクスに注目しています．ハプティクスは，
長らく理工学や情報学のニッチ領域と見なされてきました．
しかし現在はそのシーズとニーズの両面において不連続的な変化が起きつつあります．`,
        overviewHeading: 'Haptics & Applied Physics in Synthesis',
        newsHeading: 'News',
        affiliationsHeading: '研究室の所属',
        projectsHeading: '関連プロジェクト',
        latestHeading: '最新記事一覧',
        carouselLabel: '研究テーマ一覧',
        carouselPreviousLabel: '前へ',
        carouselNextLabel: '次へ',
        affiliations: [
            '東京大学 大学院新領域創成科学研究科 複雑理工学専攻',
            '東京大学 大学院情報理工学系研究科 システム情報学専攻',
            '東京大学 工学部 計数工学科',
        ],
        formatDate: (date) => date?.replace(/-/g, '/') ?? '',
    },
    en: {
        tabTitle: 'Shinoda & Makino Lab',
        heroTitle: 'Haptics: Just Beginning',
        description: `We aim to realize real-world information environments that transcend conventional boundaries
by introducing novel physical phenomena and structural designs into systems. Our research
focuses on hardware-level innovations, particularly in sensing humans, environments,
and their interactions, as well as developing technologies that support people
by engaging their senses. While striving for fundamental and universal achievements
based on original concepts, our research also encompasses the entire process of transforming
these ideas into practical technologies that solve real-world problems.

In particular, we focus on haptics—the technology of touch. For a long time,
haptics was considered a niche field within science and engineering. However,
we are now witnessing a discontinuous shift in both its technological seeds
and societal needs.`,
        overviewHeading: 'Haptics & Applied Physics in Synthesis',
        newsHeading: 'News',
        affiliationsHeading: 'Laboratory affiliations',
        projectsHeading: 'Related projects',
        latestHeading: 'Latest articles',
        carouselLabel: 'Featured research themes',
        carouselPreviousLabel: 'Previous',
        carouselNextLabel: 'Next',
        affiliations: [
            'Department of Complexity Science and Engineering, Graduate School of Frontier Sciences',
            'Department of Information Physics and Computing, Graduate School of Information Science and Technology',
            'Department of Mathematical Engineering and Information Physics, School of Engineering',
        ],
        formatDate: (date) => date ?? '',
    },
} satisfies Record<'ja' | 'en', HomePageContent>;

export function getHomePageContent(locale: 'ja' | 'en' = 'ja'): HomePageContent {
    return homePageContentByLocale[locale];
}
