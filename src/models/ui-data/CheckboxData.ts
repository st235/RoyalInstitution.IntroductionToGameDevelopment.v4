import type { LevelCompletionData } from "@/models/ui-data/LevelCompletionData";
import type { PersistentData } from "@/models/ui-data/PersistentData";

type CheckboxData = LevelCompletionData & PersistentData & {
    title: string;
    description?: string;
}

export type { CheckboxData };
