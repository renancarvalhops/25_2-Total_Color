import { GraphView } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type GraphContextType = {
    graphView: GraphView;
    generateGraphView: (newGraphView: GraphView) => void;
    viewColoring: () => void;
}

const GraphViewContext = createContext<GraphContextType | null>(null);

const defaultGraphView = {
    graph: { matrix: [] },
    layout: '',
    name: '',
    renderings: 0
};

export function GraphViewProvider({
    children
}: { children: ReactNode }) {
    const [graphView, setGraphView] = useState<GraphView>(defaultGraphView);

    const generateGraphView = (newGraphView: GraphView) => {
        setGraphView((prev) => ({
            ...newGraphView,
            renderings: !prev ? 1 : prev.renderings + 1
        }));
    };

    const viewColoring = () => {
        setGraphView((prev) => {
            if (prev.coloringOptions) {
                return {
                    ...prev,
                    coloringOptions: {
                        orientation: prev.coloringOptions.orientation,
                        show: true
                    }
                }
            } else {
                return prev;
            }
        });
    };

    return (
        <GraphViewContext.Provider value={{ graphView, generateGraphView, viewColoring }}>
            {children}
        </GraphViewContext.Provider>
    );
}

export function useGraphView() {
    const context = useContext(GraphViewContext);

    if (!context) {
        throw new Error('useGraphView deve ser utilizado em um <GraphViewProvider>');
    }

    return context;
}