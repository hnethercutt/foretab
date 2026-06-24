'use client'
import { createContext, useContext, useState } from 'react';

type LoadingContextType = {
    loading: boolean;
    start: () => void;
    stop: () => void;
};

// Initial state
const LoadingContext = createContext<LoadingContextType | null>(null);

// Give entire app access to the context
export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);
    const start = () => setLoading(true);
    const stop = () => setLoading(false);

    return (
        <LoadingContext.Provider value ={{ loading, start, stop }}>
            { children }
        </LoadingContext.Provider>
    );
}

export function useLoadingContext() {
    const context = useContext(LoadingContext);
    if(!context) {
        // Should never occur since the app is wrapped with the provider
        throw new Error('Provider does not exist');
    }
    return context;
}