// src/context/LoadingProvider.jsx
import React, { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext({
  loading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  // counter to avoid accidental stop when multiple sources start
  const [count, setCount] = useState(0);

  const startLoading = useCallback(() => {
    setCount((c) => c + 1);
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setCount((c) => {
      const next = Math.max(0, c - 1);
      if (next === 0) setLoading(false);
      return next;
    });
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
