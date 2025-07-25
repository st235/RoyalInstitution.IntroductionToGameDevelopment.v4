type PageState = "locked" | "in-progress" | "completed";

type PageStatic = {
    id: string;
    ordinal: number;
    title: string;
    description: string;
    shoudOpen: string[];
    sandboxPlaceholder?: string;
};

type PageWithExercise = PageStatic & {
    state: PageState;
};

export type { PageStatic, PageWithExercise, PageState };
