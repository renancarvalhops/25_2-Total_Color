import { Graph, GraphValues } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type GraphContextType = {
    graph: Graph,
    updateGraph: (newValues: GraphValues) => void
}

const GraphContext = createContext<GraphContextType | null>(null);

export function GraphProvider({
    children
}: { children: ReactNode }) {
    const [graph, setGraph] = useState<Graph>({ renderings: 0 });

    const updateGraph = (newValues: GraphValues) => {
        setGraph((prev) => ({
            layout: 'grid',
            ...newValues,
            renderings: prev.renderings + 1
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