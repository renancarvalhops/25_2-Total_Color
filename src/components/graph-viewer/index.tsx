import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { assignElementColor, createEdge, createVertex, generateVisualization, showColoring } from "./ViewerFeatures";
import { useGraph } from "@/contexts/GraphContext";
import { Core } from "cytoscape";
import Welcome from "./Welcome";
import ColoringPanel from "./InfoPanel";

export default function GraphViewer() {
    const { graph, graphView, graphRenderings } = useGraph();
    const cyContainerRef = useRef<HTMLDivElement | null>(null);
    const [coloring, setColoring] = useState<Map<string, string[]>>(new Map());
    const [cytoscape, setCytoscape] = useState<Core>();

    const updateColor = (elementId: string, previousColor: string, currentColor: string) => {
        setColoring((prev) => {
            const updatedColoring = new Map(prev);
            let ids: string[] | undefined;

            ids = updatedColoring.get(previousColor);
            if (ids) {
                if (ids.length > 1) {
                    updatedColoring.set(previousColor, [...ids.filter(id => id !== elementId)]);
                } else {
                    updatedColoring.delete(previousColor);
                }
            }

            if (currentColor) {
                ids = updatedColoring.get(currentColor);
                if (ids) {
                    updatedColoring.set(currentColor, [...ids, elementId]);
                } else {
                    updatedColoring.set(currentColor, [elementId]);
                }
            }


            return updatedColoring;
        });
    }

    useEffect(() => {
        if (graphRenderings > 0) {
            const cy = generateVisualization(graph, graphView, cyContainerRef);

            cy.on('select', '*', (e) => assignElementColor(e, updateColor));
            // cy.on('select', 'node', (e) => createEdge(e, graph));
            cy.on('tap', (e) => createVertex(e, graph));

            setColoring(new Map());
            setCytoscape(cy);
        }
    }, [graphRenderings]);

    useEffect(() => {
        if (cytoscape && graph.totalColoring && graphView.coloring?.show) {
            const intervalId = showColoring(cytoscape, graph, graphView, updateColor);

            if (intervalId) {
                return () => clearInterval(intervalId);
            }
        }
    }, [graphView.coloring?.show]);

    return (
        <motion.section
            className="bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col grow items-center justify-center relative"
        >
            {graphView.active ?
                <>
                    <div ref={cyContainerRef} className={`h-full w-full ${graphRenderings < 1 && 'hidden'}`}></div>

                    <ColoringPanel
                        elementColors={Array.from(coloring.keys()).sort((a, b) => Number(a) - Number(b))}
                    />
                </>
                :
                <Welcome />
            }
        </motion.section>
    );
}