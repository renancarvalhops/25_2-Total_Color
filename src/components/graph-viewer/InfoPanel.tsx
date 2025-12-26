import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { useGraph } from "@/contexts/GraphContext";
import { HexadecimalColors } from "./ViewerUtils";
import { PiHandTapLight, PiMouseScrollLight } from "react-icons/pi";
import { HiCursorClick } from "react-icons/hi";
import { BsShiftFill } from "react-icons/bs";
import { Modes } from "@/types";

const onlyMobile = "flex gap-2 items-center lg:hidden";
const onlyDesktop = "gap-2 hidden items-center lg:flex";

export const InstructionsText = () => (
    <div className="flex flex-col gap-2">
        <div className={onlyDesktop}>
            <PiMouseScrollLight size={30} />
            Utilize o scroll para aumentar/diminuir o zoom
        </div>

        <div className={onlyDesktop}>
            <HiCursorClick size={30} />
            <div>
                Clique em um elemento do grafo para selecioná-lo
                <span className="text-gray-700 text-sm"> (a seleção é cumulativa)</span>
            </div>
        </div>

        <div className={onlyMobile}>
            <PiHandTapLight size={30} />
            <div>
                Toque em um elemento do grafo para selecioná-lo
                <span className="text-gray-700 text-sm"> (a seleção é cumulativa)</span>
            </div>
        </div>

        <div className={onlyDesktop}>
            <BsShiftFill size={30} />
            Shift + Clique arrastado cria uma caixa que seleciona os elementos contidos nela
        </div>

        <div className={onlyMobile}>
            <PiHandTapLight size={30} />
            Toque para interagir com um elemento do grafo
        </div>
    </div>
);

const modesConfig: Record<Modes, { title: string, instruction: string }> = {
    view: {
        title: "",
        instruction: ""
    },
    vertex: {
        title: "vértice",
        instruction: "em um espaço disponível para criar um vértice"
    },
    edge: {
        title: "aresta",
        instruction: "em dois vértices para gerar uma aresta"
    },
    coloring: {
        title: "coloração",
        instruction: "em um ou mais elementos e digite um número para atribuir uma cor"
    },
};


interface ColoringPanelProps {
    elementColors: string[]
}

export default function InfoPanel({
    elementColors
}: ColoringPanelProps) {
    const { graph, graphView } = useGraph();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <Card className="absolute md:p-2 md:top-5 left-0 lg:left-5 lg:max-w-sm p-1 shadow-md top-0 w-full z-10">
                <CardContent className="flex flex-col gap-0 lg:gap-6 md:p-4 p-1 text-md">
                    <section className="flex flex-col gap-4">
                        <p className="border-b-2 bg-gray-100 border-blue-500 font-semibold pl-2 px-4 py-2 rounded text-lg">
                            Coloração
                        </p>

                        <div className="flex flex-col gap-2 pl-4">
                            {
                                (graph.totalColoring) &&
                                <div className="flex gap-2">
                                    <span className="font-semibold">
                                        Número cromático total:
                                    </span>

                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1 }}
                                    >
                                        {graph.totalColoring.length}
                                    </motion.span>
                                </div>
                            }

                            <div className="flex flex-col flex-wrap gap-2 items-start">
                                <div className="flex gap-2">
                                    <span className="font-semibold">
                                        Cores utilizadas:
                                    </span>

                                    <span>
                                        {elementColors.length}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 lg:p-0 p-2 rounded">
                                    {elementColors.map((elementColor) => {
                                        const color = Number(elementColor) - 1;

                                        return (
                                            <span
                                                key={elementColor}
                                                style={{
                                                    color: HexadecimalColors.get(color)
                                                }}
                                            >
                                                {elementColor}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    {graphView.mode !== "view" && (
                        <section className="flex flex-col gap-4">
                            <div className="border-b-2 bg-gray-100 border-blue-500 font-semibold pl-2 px-4 py-2 rounded text-lg">
                                Modo {modesConfig[graphView.mode].title}
                            </div>

                            <div className="flex gap-2 items-center">
                                <HiCursorClick className="hidden lg:flex" size={30} />
                                <PiHandTapLight className="flex lg:hidden" size={30} />

                                <p>
                                    <span className="hidden lg:inline">Clique </span>
                                    <span className="inline lg:hidden">Toque </span>
                                    {modesConfig[graphView.mode].instruction}
                                </p>
                            </div>
                        </section>
                    )}

                    {/* <section className="flex-col gap-4 hidden lg:flex">
                        <p className="border-b-2 bg-gray-100 border-blue-500 font-semibold pl-2 px-4 py-2 rounded text-lg">
                            Instruções
                        </p>

                        <InstructionsText />
                    </section> */}
                </CardContent>
            </Card>
        </motion.section>
    );
}