type PageState = "locked" | "in-progress" | "completed";

type PageDescriptor = {
    id: string;
    ordinal: number;
    shouldOpen: string[];
    requestedViewport: {
        width: number;
        height: number;
    };
    isHidden?: boolean;
    isOpenByDefault?: boolean;
}

type StatefulPageDescriptor = PageDescriptor & {
    state: PageState;
}

export type { PageDescriptor, StatefulPageDescriptor, PageState };
