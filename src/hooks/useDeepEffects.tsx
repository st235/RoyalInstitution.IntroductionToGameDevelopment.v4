
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { DependencyList, EffectCallback } from "react";

import { deepEquals } from "@/util/Objects";

const isPrimitive = (val: unknown) => val !== Object(val);

const useDeepCompareEffect = <T extends DependencyList>(
    effect: EffectCallback,
    deps: T,
) => {
    if (!(deps instanceof Array) || !deps.length) {
        console.warn(
            "`useDeepCompareLayoutEffect` should not be used with no dependencies. Use React.useEffect instead."
        );
    }

    if (deps.every(isPrimitive)) {
        console.warn(
            "`useDeepCompareLayoutEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead."
        );
    }

    const ref = useRef<T | undefined>(undefined);
    if (!ref.current || !deepEquals(deps, ref.current)) {
        ref.current = deps;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, ref.current);
};

const useDeepCompareLayoutEffect = <T extends DependencyList>(
    effect: EffectCallback,
    deps: T,
) => {
    if (!(deps instanceof Array) || !deps.length) {
        console.warn(
            "`useDeepCompareLayoutEffect` should not be used with no dependencies. Use React.useEffect instead."
        );
    }

    if (deps.every(isPrimitive)) {
        console.warn(
            "`useDeepCompareLayoutEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead."
        );
    }

    const ref = useRef<T | undefined>(undefined);
    if (!ref.current || !deepEquals(deps, ref.current)) {
        ref.current = deps;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(effect, ref.current);
};

const useDeepCompareMemo = <R, T extends DependencyList = DependencyList>(
    factory: () => R,
    deps: T,
): R => {
    if (!(deps instanceof Array) || !deps.length) {
        console.warn(
            "`useDeepCompareLayoutEffect` should not be used with no dependencies. Use React.useEffect instead."
        );
    }

    if (deps.every(isPrimitive)) {
        console.warn(
            "`useDeepCompareLayoutEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead."
        );
    }

    const ref = useRef<T | undefined>(undefined);
    if (!ref.current || !deepEquals(deps, ref.current)) {
        ref.current = deps;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(factory, ref.current);
};

export { useDeepCompareEffect, useDeepCompareLayoutEffect, useDeepCompareMemo };