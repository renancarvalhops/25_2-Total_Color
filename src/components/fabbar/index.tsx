import { DownloadIcon, LoaderCircleIcon, PaletteIcon, PlusIcon, PyramidIcon } from "lucide-react";
import { motion } from "motion/react";
import GraphGenerator from "../graph-generator";
import { useGraph } from "@/contexts/GraphContext";
import { useEffect, useState } from "react";
import { matrixToGraph6 } from "@/lib/graphs";

export default function FabBar() {
    const { graph, updateGraph } = useGraph();
    const [graph6File, setGraph6File] = useState<Blob>();

    useEffect(() => {
        if (graph.matrix) {
            const blob = new Blob([matrixToGraph6(graph.matrix)]);
            setGraph6File(blob);
        }
    }, [graph.renderings]);

    return (
        <motion.menu
            className="bottom-0 fixed flex gap-10 items-center justify-between p-8 w-screen z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
        >
            {
                graph.matrix ?
                    <>
                        <div className="border border-gray-200 bg-white cursor-pointer flex gap-2 hover:opacity-60 p-2 rounded duration-300 w-auto">
                            <div className="flex">
                                {graph6File ? <DownloadIcon /> : <LoaderCircleIcon className="animate-spin" />}
                            </div>
                            <a
                                download={`${graph.fileName}.g6`}
                                href={graph6File ? URL.createObjectURL(graph6File) : ''}
                            >
                                Baixar em graph6
                            </a>
                        </div>

                        <div
                            className="border border-gray-200 bg-white cursor-pointer flex gap-2 hover:opacity-60 p-2 rounded duration-300 w-auto"
                            onClick={() => updateGraph({ showColoring: true })}
                        >
                            <div className="flex">
                                <PaletteIcon />
                            </div>

                            Apresentar Coloração
                        </div>
                    </>
                    :
                    <div></div>
            }

            <GraphGenerator>
                <div className="border border-gray-200 bg-white cursor-pointer flex gap-2 hover:opacity-60 p-2 rounded duration-300 w-auto">
                    <div className="flex">
                        <PyramidIcon />
                        <PlusIcon size={15} />
                    </div>

                    Criar grafo
                </div>
            </GraphGenerator>
        </motion.menu>
    );
}