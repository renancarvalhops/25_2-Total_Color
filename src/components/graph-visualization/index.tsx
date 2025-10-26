import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { WritingText } from "../ui/shadcn-io/writing-text";
import { assignColorNumber, generateVisualization, showColoring } from "./visualization";
import { useGraph } from "@/contexts/GraphContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function GraphVisualization() {
    const { graph } = useGraph();
    const cyContainerRef = useRef<HTMLElement | null>(null);
    const [coloring, setColoring] = useState<Map<string, string[]>>(new Map());
    const colors = Array.from(coloring.keys());

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
        const cy = generateVisualization(graph, cyContainerRef);

        if (cy) {
            setColoring(new Map());
            cy.elements().on('select', (e) => assignColorNumber(e, updateColor));

            if (graph.class) {
                showColoring(cy, graph, updateColor);
            }
        }
    }, [graph.renderings]);
    

    return (
        <>
            {
                Boolean(graph.matrix) ||
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

            {
                colors.length > 0 &&
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="absolute bottom-5 left-5 z-10 w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>
                                Coloração Total
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="flex flex-col gap-2">
                            {
                                (graph.class && graph.totalColoring) &&    
                                <div className="flex gap-2">
                                    <span>Número cromático total:</span>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1 }}
                                    >
                                        {graph.totalColoring.length}
                                    </motion.span>
                                </div>
                            }

                            <div className="flex flex-col gap-2">
                                <span>Coloração:</span>
                                <div className="flex flex-col gap-2">
                                    {[...coloring].map(([color, elementsIds]) => (
                                        <div key={color} className="flex gap-2 pl-4">
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 1 }}
                                            >
                                                {`${color} --> `}
                                            </motion.span>

                                            {elementsIds.map((elementId) => (
                                                <motion.span
                                                    key={elementId}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 1 }}
                                                >
                                                    {elementId}
                                                </motion.span>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>
            }
        </>
    );
}