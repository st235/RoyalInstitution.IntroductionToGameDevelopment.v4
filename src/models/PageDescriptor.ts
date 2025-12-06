type PageState = "locked" | "in-progress" | "completed";

type PageDescriptor = {
    id: string;
    ordinal: number;
    shouldOpen: string[];
    isHidden?: boolean;
    isOpenByDefault?: boolean;
}

type StatefulPageDescriptor = PageDescriptor & {
    state: PageState;
}

export type { PageDescriptor, StatefulPageDescriptor, PageState };
