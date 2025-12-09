import { useMemo, useState } from "react";

const useFetch = <T>(
    url: string,
): [T | undefined, unknown, boolean] => {
    if (url.startsWith("/")) {
        url = url.substring(1);
    }
    const [data, setData] = useState<T | undefined>(undefined);
    const [error, setError] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);

    const baseUrl = import.meta.env.BASE_URL;

    useMemo(() => {
        let isCancelled = false;

        async function loadData() {
            try {
                const request = await fetch(`${baseUrl}/${url}`);
                if (!request.ok) {
                    throw new Error(`Request failed with: ${request.status}.`);
                }
                const data = await request.json() as T;
                if (!isCancelled) {
                    setData(data);
                }
            } catch (err) {
                if (!isCancelled) {
                    setError(err);
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isCancelled = true;
        };
    }, [baseUrl, url]);

    return [ data, error, loading ];
};

export { useFetch };
