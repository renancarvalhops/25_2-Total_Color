import GraphFree from "@/lib/graphs/GraphFree";
import { GraphView } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type GraphContextType = {
    graph: Graph,
    graphView: GraphView;
    graphRenderings: number;
    initGraph: (newGraph: Graph, newGraphView: GraphView) => void;
    resetGraph: () => void;
    viewColoring: () => void;
    // addVertex: () => void;
    // rmVertex: (vertex: number) => void;
    // addEdge: (origin: number, target: number) => void;
    // rmEdge: (origin: number, target: number) => void;    
}

const GraphContext = createContext<GraphContextType | null>(null);

const defaultGraph = {
    matrix: []
};

const defaultGraphView = {
    layout: '',
    name: ''
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

    // const addVertex = () => {
    //     if (graph instanceof GraphFree) {
    //         graph.addVertex();
    //     }
    // }

    // const rmVertex = (vertex: number) => {
    //     if (graph instanceof GraphFree) {
    //         graph.rmVertex(vertex);
    //     }
    // }

    // const addEdge = (origin: number, target: number) => {
    //     if (graph instanceof GraphFree) {
    //         graph.addEdge(origin, target);
    //     }
    // }

    // const rmEdge = (origin: number, target: number) => {
    //     if (graph instanceof GraphFree) {
    //         graph.rmEdge(origin, target);
    //     }
    // }

    const resetGraph = () => {
        setGraph(defaultGraph);
        setGraphView(defaultGraphView);
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
            // addVertex,
            // rmVertex,
            // addEdge,
            // rmEdge,
            resetGraph,
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