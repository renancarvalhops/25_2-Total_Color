import { convertToElementId } from "@/components/graph-viewer/ViewerUtils";
import Graph from "@/lib/graphs/Graph";
import { GraphElement } from "@/lib/graphs/types";
import { GraphView, ActionMode } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type GraphContextType = {
    graph: Graph,
    graphView: GraphView;
    graphRenderings: number;
    initGraph: (newGraph: Graph, newGraphView: GraphView) => void;
    resetGraph: () => void;
    changeGraphViewMode: (newActionMode: ActionMode) => void;
    viewColoring: () => void;
    updateDisplayedColoring: (cyElementId: string, color: string) => void;
}

const GraphContext = createContext<GraphContextType | null>(null);

const defaultGraph: Graph = {
    matrix: []
};

const defaultGraphView: GraphView = {
    layout: '',
    name: '',
    active: false,
    actionMode: "view",
    displayedColoring: new Map()
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

    const changeGraphViewMode = (newActionMode: ActionMode) => {
        setGraphView((prev) => ({
            ...prev,
            actionMode: prev.actionMode === newActionMode ? "view" : newActionMode
        }));
    };

    const viewColoring = () => {
        setGraphView((prev) => ({
            ...prev,
            showColoring: true
        }));
    };

    const updateDisplayedColoring = (cyElementId: string, color: string) => {
        setGraphView((prev) => {
            const elementId: GraphElement = convertToElementId(cyElementId);
            const newDisplayedColoring = new Map(prev.displayedColoring);
            const icolor = Number.parseInt(color);

            if (icolor) {
                newDisplayedColoring.set(elementId, `${icolor}`);
            } else if (newDisplayedColoring.has(elementId)) {
                newDisplayedColoring.delete(elementId);
            }

            return ({
                ...prev,
                displayedColoring: newDisplayedColoring
            });
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
            viewColoring,
            updateDisplayedColoring,
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