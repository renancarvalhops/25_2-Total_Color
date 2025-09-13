import { useWindowSize } from "@/hooks/use-window-size";
import { getCompleteGraph } from "@/lib/graphs";
import { Graph } from "@/types";
import cytoscape, { Core, ElementsDefinition } from "cytoscape";
import { motion } from "motion/react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { WritingText } from "../ui/shadcn-io/writing-text";

interface GraphVisualizationProps {
    graph: Graph,
    setGraph: Dispatch<SetStateAction<Graph>>
}

export default function GraphVisualization({
    graph,
    setGraph
}: GraphVisualizationProps) {
    const cyContainerRef = useRef<HTMLElement | null>(null);
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    const order = 6;
    let cy: Core;    

    useEffect(() => {
        cy = cytoscape({
            container: cyContainerRef.current,
            elements: graph.elements,
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#ccc',
                        'font-size': '14px',
                        'font-weight': 'lighter',
                        'height': '50px',
                        'label': 'data(id)',
                        'text-valign': 'center',
                        'width': '50px'
                    }
                },
                {
                    selector: 'node:selected',
                    style: {
                        'background-color': '#0000aa',
                        'color': '#fff'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'line-color': '#ccc',
                        'width': 3
                    }
                },
                {
                    selector: 'edge:selected',
                    style: {
                        'line-color': '#0000af'
                    }
                }
            ],
            layout: {
                name: 'circle'
            }
        });
    }, [windowWidth, windowHeight]);

    return (
        <>
            <section
                className="flex h-full items-center justify-center p-4 w-full"
            >
                <WritingText
                    text="Crie grafos e descubra a coloração total com o Total-Color 😎"
                    className="text-4xl text-white"
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