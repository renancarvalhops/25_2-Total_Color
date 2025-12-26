import { GraphView, Modes } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type GraphContextType = {
    graph: Graph,
    graphView: GraphView;
    graphRenderings: number;
    initGraph: (newGraph: Graph, newGraphView: GraphView) => void;
    resetGraph: () => void;
    changeGraphViewMode: (newMode: Modes) => void;
    viewColoring: () => void;  
}

const GraphContext = createContext<GraphContextType | null>(null);

const defaultGraph: Graph = {
    matrix: []
};

const defaultGraphView: GraphView = {
    layout: '',
    name: '',
    active: false,
    mode: "view"
};

export function GraphProvider({
    children
}: { children: ReactNode }) {
    const [graphRenderings, setGraphRenderigs] = useState(0);
    const [graph, setGraph] = useState<Graph>(defaultGraph);
    const [graphView, setGraphView] = useState<GraphView>(defaultGraphView);

    const initGraph = (newGraph: Graph, newGraphView: GraphView) => {
        setGraph(newGraph);
        setGraphView(newGraphView);
        setGraphRenderigs(prev => prev + 1);
    };

    const resetGraph = () => {
        setGraph(defaultGraph);
        setGraphView(defaultGraphView);
    };

    const changeGraphViewMode = (newMode: Modes) => {
        setGraphView((prev) => ({
            ...prev,
            mode: prev.mode === newMode ? "view" : newMode
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
        <GraphContext.Provider value={{
            graph,
            graphView,
            graphRenderings,
            initGraph,
            resetGraph,
            changeGraphViewMode,
            viewColoring
        }}>
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