import { useState, useEffect, useCallback, useRef } from "react";
import type { Application, HealthMap, HealthStatus } from "../types";

export const POLL_INTERVAL_MS = 5 * 60 * 1000;

function buildInitialMap(applications: Application[]): HealthMap {
  const map: HealthMap = new Map();
  for (const app of applications) {
    for (const env of app.Environments) {
      if (env.healthCheckUrl != null) {
        map.set(env.healthCheckUrl, "unknown");
      }
    }
  }
  return map;
}

async function fetchStatus(url: string): Promise<HealthStatus> {
  try {
    const res = await fetch(url);
    return res.ok ? "healthy" : "unhealthy";
  } catch {
    // Network error, CORS block, or any other rejection → unknown
    return "unknown";
  }
}

export function useHealthPoller(applications: Application[]): {
  healthMap: HealthMap;
  checkNow: (url: string) => void;
} {
  const [healthMap, setHealthMap] = useState<HealthMap>(() =>
    buildInitialMap(applications)
  );

  const setStatus = useCallback((url: string, status: HealthStatus) => {
    setHealthMap((prev) => {
      const next = new Map(prev);
      next.set(url, status);
      return next;
    });
  }, []);

  const checkNow = useCallback(
    async (url: string) => {
      setStatus(url, "loading");
      const status = await fetchStatus(url);
      setStatus(url, status);
    },
    [setStatus]
  );

  // Keep a stable ref to checkNow for use inside the interval
  const checkNowRef = useRef(checkNow);
  useEffect(() => {
    checkNowRef.current = checkNow;
  }, [checkNow]);

  useEffect(() => {
    // Collect all non-null health URLs
    const urls: string[] = [];
    for (const app of applications) {
      for (const env of app.Environments) {
        if (env.healthCheckUrl != null) {
          urls.push(env.healthCheckUrl);
        }
      }
    }

    if (urls.length === 0) return;

    // Immediate full poll on mount
    urls.forEach((url) => checkNowRef.current(url));

    // Repeating poll every POLL_INTERVAL_MS
    const intervalId = setInterval(() => {
      urls.forEach((url) => checkNowRef.current(url));
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [applications]);

  return { healthMap, checkNow };
}
