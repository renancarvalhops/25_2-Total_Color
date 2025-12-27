import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { useGraph } from "@/contexts/GraphContext";
import { getColoringByColor, HexadecimalColors } from "./ViewerUtils";
import { PiHandTapLight } from "react-icons/pi";
import { HiCursorClick } from "react-icons/hi";
import { BsCircleFill } from "react-icons/bs";
import { ActionMode } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";

const modesConfig: Record<ActionMode, { title: string, instruction: string }> = {
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


export default function InfoPanel() {
    const { graph, graphView } = useGraph();
    const [showInstructions, setShowInstructions] = useState(true);

    const totalColoringByColor = getColoringByColor(graph.totalColoring || new Map());
    const displayedColoringByColor = getColoringByColor(graphView.displayedColoring);

    useEffect(() => {
        if (localStorage.getItem("hiddenInstructions")) {
            setShowInstructions(false);
        }
    }, []);

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
                                        {totalColoringByColor.size}
                                    </motion.span>
                                </div>
                            }

                            <div className="flex flex-col flex-wrap gap-2 items-start">
                                <div className="flex gap-2">
                                    <span className="font-semibold">
                                        Cores utilizadas:
                                    </span>

                                    <span>
                                        {displayedColoringByColor.size}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2 lg:p-0 p-2 rounded">
                                    {displayedColoringByColor.keys().toArray().sort((a, b) => Number(a) - Number(b)).map((elementColor) => {
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

                    {graphView.actionMode !== "view" && (
                        <section className="flex flex-col gap-4">
                            <div className="border-b-2 bg-gray-100 border-blue-500 font-semibold flex justify-between items-center pl-2 px-4 py-2 rounded text-lg">
                                Modo {modesConfig[graphView.actionMode].title}

                                <Button
                                    variant="outline"
                                    size={"icon"}
                                    onClick={() => {
                                        localStorage.setItem("hiddenInstructions", String(!showInstructions));
                                        setShowInstructions(!showInstructions);
                                    }}
                                >
                                    {showInstructions ? <MinusIcon /> : <PlusIcon />}
                                </Button>
                            </div>

                            {showInstructions && (
                                <div>
                                    <div className="flex gap-2 items-center">
                                        <HiCursorClick className="hidden lg:flex" size={30} />
                                        <PiHandTapLight className="flex lg:hidden" size={30} />

                                        <p>
                                            <span className="hidden lg:inline">Clique </span>
                                            <span className="inline lg:hidden">Toque </span>
                                            {modesConfig[graphView.actionMode].instruction}
                                        </p>
                                    </div>

                                    {graphView.actionMode === "coloring" && (
                                        <>
                                            <div className="flex gap-2 items-center">
                                                <HiCursorClick className="hidden lg:flex" size={60} />
                                                <PiHandTapLight className="flex lg:hidden" size={35} />

                                                <p>
                                                    <span>Em seguida, </span>
                                                    <span className="hidden lg:inline">clique </span>
                                                    <span className="inline lg:hidden">toque </span>
                                                    <span>em um espaço disponível <span className="hidden lg:inline">(ou pressione <kbd>Enter</kbd>)</span> para finalizar a atribuição da cor e permitir que o sistema valide sua corretude</span>
                                                </p>
                                            </div>

                                            <div className="flex gap-2 items-center">
                                                <BsCircleFill className="text-red-700" size={30} />

                                                <p>Caso haja conflito, o sistema preencherá todo o elemento de vermelho</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </section>
                    )}
                </CardContent>
            </Card>
        </motion.section>
    );
}