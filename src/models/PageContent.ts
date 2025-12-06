type PageComponent = {
    id: string;
    type: string;
    data?: object;
}

type PageContent = {
    id: string;
    components: PageComponent[];
    gameConfig?: string;
    isLocalConfigAllowed?: boolean;
}

export type { PageContent, PageComponent };
