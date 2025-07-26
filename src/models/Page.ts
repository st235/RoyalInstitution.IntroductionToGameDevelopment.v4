type PageState = "locked" | "in-progress" | "completed";

type Page = {
    id: string;
    ordinal: number;
    title: string;
    description: string;
    shoudOpen: string[];
    sandboxPlaceholder?: string;
};

type StatefulPage = Page & {
    state: PageState;
};

export type { Page, StatefulPage, PageState };
