import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { assignColorNumber, generateVisualization, showColoring } from "./visualization";
import { useGraphView } from "@/contexts/GraphViewContext";
import { Core } from "cytoscape";
import Welcome from "./Welcome";
import ColoringPanel from "./ColoringPanel";

export default function GraphViewer() {
    const { graphView } = useGraphView();
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
        if (graphView.renderings > 0) {
            const cytoscapeInstance = generateVisualization(graphView, cyContainerRef);
    
            cytoscapeInstance.elements().on('select', (e) => assignColorNumber(e, updateColor));
            setColoring(new Map());
            setCytoscape(cytoscapeInstance);
        }
    }, [graphView.renderings]);

    useEffect(() => {
        if (cytoscape && graphView.graph.totalColoring) {
            showColoring(cytoscape, graphView, updateColor);
        }
    }, [graphView.coloringOptions?.show]);

    return (
        <motion.section
            className="bg-background flex flex-col grow items-center justify-center relative"
        >
            {graphView.renderings < 1 ?
                <Welcome />
                :
                <>
                    <div ref={cyContainerRef} className={`h-full w-full ${graphView.renderings < 1 && 'hidden'}`}></div>

                    <ColoringPanel colors={Array.from(coloring.keys())} />
                </>
            }


        </motion.section>
    );
}