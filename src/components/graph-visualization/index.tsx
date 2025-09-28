import { generateElements } from "@/lib/graphs";
import { Graph } from "@/types";
import { Core } from "cytoscape";
import { motion } from "motion/react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { WritingText } from "../ui/shadcn-io/writing-text";
import { assignColorNumber, generateVisualization } from "./visualization";

interface GraphVisualizationProps {
    graph: Graph,
    setGraph: Dispatch<SetStateAction<Graph>>
}

export default function GraphVisualization({
    graph,
    setGraph
}: GraphVisualizationProps) {
    const cyContainerRef = useRef<HTMLElement | null>(null);
    let cy: Core;

    useEffect(() => {
        const elements = generateElements(graph);
        
        if (elements) {
            setGraph(prev => ({
                ...prev,
                elements
            }));
        }

    }, [graph.matrix]);

    useEffect(() => {
        if (graph.elements) {
            cy = generateVisualization(graph, cyContainerRef);

            cy.elements().on('select', assignColorNumber);
        }
    }, [graph.elements]);

    return (
        <>
            {
                Boolean(graph.elements) ||
                <section
                    className="flex h-full items-center justify-center p-4 w-full"
                >
                    <WritingText
                        text="Bem-vindo(a) ao Total-Color 😎"
                        className="text-4xl text-white select-none"
                        inView={true}
                        spacing=".5rem"
                        transition={{
                            type: "spring",
                            bounce: 0,
                            duration: 2,
                            delay: 0.2
                        }}
                    />
                </section>                    
            }
            <motion.section
                ref={cyContainerRef}
                className="h-full w-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: .7 }}
            />
        </>
    );
}