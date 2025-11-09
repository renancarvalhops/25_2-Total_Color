import { GraphView } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type GraphContextType = {
    graph: Graph,
    graphView: GraphView;
    initGraph: (newGraph: Graph, newGraphView: GraphView) => void;
    viewColoring: () => void;
}

const GraphContext = createContext<GraphContextType | null>(null);

const defaultGraph = {
    matrix: []
};

const defaultGraphView = {
    layout: '',
    name: '',
    renderings: 0
};

export function GraphProvider({
    children
}: { children: ReactNode }) {
    const [graph, setGraph] = useState<Graph>(defaultGraph);
    const [graphView, setGraphView] = useState<GraphView>(defaultGraphView);

    const initGraph = (newGraph: Graph, newGraphView: GraphView) => {
        setGraph(newGraph);
        
        setGraphView((prev) => ({
            ...newGraphView,
            renderings: !prev ? 1 : prev.renderings + 1
        }));
    };

    const viewColoring = () => {
        setGraphView((prev) => {
            if (prev.coloring) {
                return {
                    ...prev,
                    coloring: {
                        orientation: prev.coloring.orientation,
                        show: true
                    }
                }
            } else {
                return prev;
            }
        });
    };

    return (
        <GraphContext.Provider value={{ graph, graphView, initGraph, viewColoring }}>
            {children}
        </GraphContext.Provider>
    );
}

export function useGraph() {
    const context = useContext(GraphContext);

    if (!context) {
        throw new Error('useGraphView deve ser utilizado em um <GraphViewProvider>');
    }

    return context;
}