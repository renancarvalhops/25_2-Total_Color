import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { assignElementColor, createEdge, createVertex, generateVisualization, showColoring } from "./ViewerFeatures";
import { useGraph } from "@/contexts/GraphContext";
import { Core } from "cytoscape";
import Welcome from "./Welcome";
import ColoringPanel from "./InfoPanel";

export default function GraphViewer() {
    const { graph, graphView, changeGraphViewMode, graphRenderings, updateDisplayedColoring } = useGraph();
    const cyContainerRef = useRef<HTMLDivElement | null>(null);
    const [cytoscape, setCytoscape] = useState<Core>();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "v":
                    changeGraphViewMode("vertex");
                    break;
                case "e":
                    changeGraphViewMode("edge");
                    break;
                case "c":
                    changeGraphViewMode("coloring");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (graphRenderings <= 0) return;

        const cy = generateVisualization(graph, graphView, cyContainerRef);
        setCytoscape(cy);
    }, [graphRenderings]);

    useEffect(() => {
        if (cytoscape) {
            cytoscape.off("tap");
            cytoscape.off("select");

            switch (graphView.actionMode) {
                case "vertex":
                    cytoscape.on("tap", (e) => createVertex(e, graph));
                    break;
                case "edge":
                    cytoscape.on("select", "node", (e) => createEdge(e, graph));
                    break;
                case "coloring":
                    cytoscape.on("select", "*", (e) => assignElementColor(e, updateDisplayedColoring));
                    break;
            }
        }
    }, [graphView.actionMode]);

    useEffect(() => {
        if (cytoscape && graph.totalColoring && graphView.showColoring) {
            const intervalId = showColoring(cytoscape, graph, updateDisplayedColoring);

            if (intervalId) {
                return () => clearInterval(intervalId);
            }
        }
    }, [graphView.showColoring]);

    return (
        <motion.section
            className="bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col grow items-center justify-center relative"
        >
            {graphView.active ?
                <>
                    <div ref={cyContainerRef} className="h-full w-full"></div>

                    <ColoringPanel />
                </>
                :
                <Welcome />
            }
        </motion.section>
    );
}