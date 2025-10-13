import { Graph } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type GraphContextType = {
    graph: Graph,
    updateGraph: (newValues: Graph) => void
}

const GraphContext = createContext<GraphContextType | null>(null);

export function GraphProvider({
    children
}: { children: ReactNode }) {
    const [graph, setGraph] = useState<Graph>({});

    const updateGraph = (newValues: Graph) => {
        setGraph((prev) => ({
            ...prev,
            layout: '',
            ...newValues
        }));
    };

    return (
        <GraphContext.Provider value={{ graph, updateGraph }}>
            {children}
        </GraphContext.Provider>
    );
}

export function useGraph() {
    const context = useContext(GraphContext);

    if (!context) {
        throw new Error('useGraph deve ser utilizado em um <GraphProvider>');
    }

    return context;
}