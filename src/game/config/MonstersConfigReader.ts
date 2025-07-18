import defaultMonstersConfig from "@assets/configs/default_monsters_config.json";

/**
 * [di, dj]
 */
const rawPathMapping: { [Key: string]: [number, number] } = {
    "left": [0, -1],
    "up": [-1, 0],
    "right": [0, 1],
    "down": [1, 0],
};

type MonsterDescriptor = {
    id: number,
    variant: number,
    updateTimeMs: number,
    path: [number, number][],
};

type MonstersConfig = {
    id: number,
    variant: number,
    updateTimeMs: number,
    path: string[],
};

class MonstersConfigReader {

    private readonly _descriptors: { [Key: string]: MonsterDescriptor };

    constructor(descriptors: MonsterDescriptor[]) {
        this._descriptors = {};
        for (const descriptor of descriptors) {
            this._descriptors[descriptor.id] = descriptor;
        }
    }

    getTileFor(monster: number): number {
        return this._descriptors[monster].variant;
    }

    getUpdateTimeFor(monster: number): number {
        return this._descriptors[monster].updateTimeMs;
    }

    getPathFor(monster: number): [number, number][] {
        return this._descriptors[monster].path;
    }

    private static _convertPath(rawPath: string[]): [number, number][] | undefined {
        const out: [number, number][] = [];

        for (const rawDirection of rawPath) {
            const direction = rawPathMapping[rawDirection];
            if (!direction) {
                return undefined;
            }
            out.push(direction);
        }

        return out;
    }

    private static _checkCycleExists(path: [number, number][]): boolean {
        if (path.length == 0) {
            return false;
        }

        const point: [number, number] = [0, 0];
        for (const direction of path) {
            point[0] += direction[0];
            point[1] += direction[1];
        }
        return point[0] == 0 && point[1] == 0;
    }

    public static create(config: MonstersConfig[] = defaultMonstersConfig): MonstersConfigReader | undefined {
        const out: MonsterDescriptor[] = [];
        for (const rawDescriptor of config) {
            const path = this._convertPath(rawDescriptor.path);
            if (!path || !this._checkCycleExists(path)) {
                return undefined;
            }

            out.push({
                id: rawDescriptor.id,
                variant: rawDescriptor.variant,
                updateTimeMs: rawDescriptor.updateTimeMs,
                path: path,
            });
        }

        return new MonstersConfigReader(out);
    }
}

export default MonstersConfigReader;
export type { MonstersConfig };
