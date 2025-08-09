import type { PersistentData } from "@/models/ui-data/PersistentData";

type CheckboxData = PersistentData & {
    title: string;
    description?: string;
}

export type { CheckboxData };
