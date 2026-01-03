// src/hooks/useFetchWithLoader.js
import { useEffect, useState, useCallback } from "react";

/**
 * Simulated fetch hook with loading state and refresh function.
 * Accepts a fetcher async function (or a promise-returning function).
 */
export default function useFetchWithLoader(fetcher, deps = [], delay = 700) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        // optional tiny delay to make skeleton visible
        await new Promise((r) => setTimeout(r, delay));
        const res = await fetcher();
        if (!mounted) return;
        setData(res);
      } catch (err) {
        if (!mounted) return;
        setError(err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, ...deps]);

  return { data, loading, error, refresh };
}
