import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { WritingText } from "../ui/shadcn-io/writing-text";
import { assignColorNumber, generateVisualization, showColoring } from "./visualization";
import { useGraph } from "@/contexts/GraphContext";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import GraphGenerator from "../graph-generator";
import { Core } from "cytoscape";

export default function GraphViewer() {
    const { graph } = useGraph();
    const cyContainerRef = useRef<HTMLDivElement | null>(null);
    const [coloring, setColoring] = useState<Map<string, string[]>>(new Map());
    const colors = Array.from(coloring.keys());
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
        const cytoscapeInstance = generateVisualization(graph, cyContainerRef);

        if (cytoscapeInstance) {
            cytoscapeInstance.elements().on('select', (e) => assignColorNumber(e, updateColor));
            setColoring(new Map());
            setCytoscape(cytoscapeInstance);
        }
    }, [graph.renderings]);

    useEffect(() => {
        if (graph.showColoring && graph.totalColoring && cytoscape) {
            const orientation = graph.class !== 'completes' ? 'index' : 'color';
            showColoring(cytoscape, graph.totalColoring, updateColor, orientation);
        }
    }, [graph.showColoring]);
    
    return (
        <motion.section
            className="bg-background flex flex-col grow items-center justify-center"
        >

            <div ref={cyContainerRef} className={`h-full w-full ${!graph.matrix && 'hidden'}`}></div>

            <motion.div
                className={`flex flex-col gap-24 ${graph.matrix && 'hidden'}`}
            >
                <motion.div>
                    <WritingText
                        text="Bem-vindo(a) ao Total-Color 😎"
                        className="text-2xl lg:text-4xl select-none"
                        inView={true}
                        spacing=".5rem"
                        transition={{
                            type: "spring",
                            bounce: 0.6,
                            duration: 2,
                            delay: .3
                        }}
                    />
                </motion.div>

                <motion.div
                    className="flex flex-col gap-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 2 }}
                >
                    <GraphGenerator tabDefaultValue="classes">
                        <Button>Iniciar com uma classe</Button>
                    </GraphGenerator>

                    <GraphGenerator tabDefaultValue="free">
                        <Button>Iniciar no modo livre</Button>
                    </GraphGenerator>
                </motion.div>

            </motion.div>
        </motion.section>
    );

    // colors.length > 0 &&
    // <motion.section
    //     initial={{ opacity: 0 }}
    //     animate={{ opacity: 1 }}
    //     transition={{ duration: 0.5 }}
    // >
    //     <Card className="absolute bottom-5 left-5 z-10 w-full max-w-sm">
    //         <CardHeader>
    //             <CardTitle>
    //                 Coloração Total
    //             </CardTitle>
    //         </CardHeader>

    //         <CardContent className="flex flex-col gap-2">
    //             {
    //                 (graph.class && graph.totalColoring) &&    
    //                 <div className="flex gap-2">
    //                     <span>Número cromático total:</span>
    //                     <motion.span
    //                         initial={{ opacity: 0 }}
    //                         animate={{ opacity: 1 }}
    //                         transition={{ duration: 1 }}
    //                     >
    //                         {graph.totalColoring.length}
    //                     </motion.span>
    //                 </div>
    //             }

    //             <div className="flex flex-col gap-2">
    //                 <span>Coloração:</span>
    //                 <div className="flex flex-col gap-2">
    //                     {[...coloring].map(([color, elementsIds]) => (
    //                         <div key={color} className="flex gap-2 pl-4">
    //                             <motion.span
    //                                 initial={{ opacity: 0 }}
    //                                 animate={{ opacity: 1 }}
    //                                 transition={{ duration: 1 }}
    //                             >
    //                                 {`${color} --> `}
    //                             </motion.span>

    //                             {elementsIds.map((elementId) => (
    //                                 <motion.span
    //                                     key={elementId}
    //                                     initial={{ opacity: 0 }}
    //                                     animate={{ opacity: 1 }}
    //                                     transition={{ duration: 1 }}
    //                                 >
    //                                     {elementId}
    //                                 </motion.span>
    //                             ))}
    //                         </div>
    //                     ))}
    //                 </div>
    //             </div>
    //         </CardContent>
    //     </Card>
    // </motion.section>
}