import type { LevelCompletionData } from "@/models/ui-data/LevelCompletionData";
import type { PersistentData } from "@/models/ui-data/PersistentData";

type SandboxData = LevelCompletionData & PersistentData & {
    placeholder?: string;
    initialValue?: string;
    minLinesCount?: number;
};

export type { SandboxData };
