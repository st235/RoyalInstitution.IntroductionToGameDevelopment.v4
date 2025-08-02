import type { PersistentData } from "@/models/ui-data/PersistentData";

type SandboxData = PersistentData & {
    placeholder?: string;
    minLinesCount?: number;
};

export type { SandboxData };
