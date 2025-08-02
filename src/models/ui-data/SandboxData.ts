import type { PersistentData } from "@/models/ui-data/PersistentData";

type SandboxData = PersistentData & {
    placeholder?: string;
};

export type { SandboxData };
