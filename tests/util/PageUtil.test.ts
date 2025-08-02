import { describe, expect, it } from "vitest";

import { AssociateStateAndPersistencyId } from "@/util/PageUtil";

type PageComponentsState = {[Key: string]: {[Key: string]: { persistencyId: string, state: object | undefined } }};
type PersistenceStateLookup = {[Key: string]: object | undefined};

const COMPONENTS_STATE_1 = {
    "page.1": {
        "component.1": {
            persistencyId: "persistency.1",
            state: {
                a: true,
                b: 5,
            },
        },
        "component.2": {
            persistencyId: "persistency.2",
            state: {
                c: "Hello world",
            },
        },
    },
    "page.2": {
        "component.1": {
            persistencyId: "persistency.1",
            state: {
                a: true,
                b: 5,
            },
        },
        "component.2": {
            persistencyId: "persistency.1",
            state: {
                c: "Hello world",
            },
        },
    },
    "page.3": {
        "component.1": {
            persistencyId: "persistency.4",
            state: {
                d: -91.2,
                e: "abc",
            },
        },
        "component.2": {
            persistencyId: "persistency.5",
            state: {
                c: false,
            },
        },
    },
};

describe("AssociateStateAndPersistencyId", {}, () => {
    it.each([
        // Edge cases.
        [{}, "page.id", {}],

        // Single page mapping.
        [COMPONENTS_STATE_1, "page.1", {"persistency.1": {a: true, b: 5}, "persistency.2": {c: "Hello world"}}],
        [COMPONENTS_STATE_1, "page.2", {"persistency.1": {c: "Hello world"}}],
        [COMPONENTS_STATE_1, "page.3", {"persistency.4": {d: -91.2, e: "abc"}, "persistency.5": {c: false}}],

        // Global state mapping.
        [COMPONENTS_STATE_1, undefined, {"persistency.1": {c: "Hello world"}, "persistency.2": {c: "Hello world"}, "persistency.4": {d: -91.2, e: "abc"}, "persistency.5": {c: false}}],
    ])("persistency state is mapped correctly",
        (
            state: PageComponentsState,
            pageId: string | undefined,
            expectedPersistencyLookup: PersistenceStateLookup,
        ) => {
            expect(AssociateStateAndPersistencyId(state, pageId)).toStrictEqual(expectedPersistencyLookup);
        }
    );
});