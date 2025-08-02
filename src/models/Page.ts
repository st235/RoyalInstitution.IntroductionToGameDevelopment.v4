type PageState = "locked" | "in-progress" | "completed";

type PageComponent = {
    id: string;
    type: string;
    data?: object;
}

type Page = {
    id: string;
    ordinal: number;
    components: PageComponent[];
    shoudOpen: string[];
}

type StatefulPage = Page & {
    state: PageState;
}

export type { Page, StatefulPage, PageState, PageComponent };
