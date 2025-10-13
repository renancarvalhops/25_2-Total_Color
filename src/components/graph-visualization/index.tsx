import { Core } from "cytoscape";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { WritingText } from "../ui/shadcn-io/writing-text";
import { assignColorNumber, generateVisualization } from "./visualization";
import { useGraph } from "@/contexts/GraphContext";

export default function GraphVisualization() {
    const { graph } = useGraph();
    const cyContainerRef = useRef<HTMLElement | null>(null);
    let cy: Core;

    useEffect(() => {
        if (graph.elements) {
            cy = generateVisualization(graph, cyContainerRef);
            cy.elements().on('select', assignColorNumber);
        }
    });

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