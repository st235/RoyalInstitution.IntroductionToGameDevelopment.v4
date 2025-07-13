import { describe, expect, it } from "vitest";

import Maze from "@/game/Maze";

describe("Maze.fromConfig", {}, () => {
    it("returns valid config when empty string is passed", () => {
        expect(Maze.fromConfig("")).toBe(new Maze());
    });
});
