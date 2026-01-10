import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { useGraph } from "@/contexts/GraphContext";
import { getColoringByColor, getGraphClassName, HexadecimalColors } from "./ViewerUtils";
import { PiHandTapLight } from "react-icons/pi";
import { HiCursorClick } from "react-icons/hi";
import { BsCircleFill } from "react-icons/bs";
import { ActionMode, GraphClassName } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { GraphClass } from "@/lib/graphs/classes/GraphClass";

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

const graphClassInfo: Record<GraphClassName | "", { title: string, denotation: string, references: string[]}> = {
    paths: {
        title: "Caminhos",
        denotation: "P",
        references: []
    },
    cycles: {
        title: "Ciclos",
        denotation: "C",
        references: []
    },
    completes: {
        title: "Completos",
        denotation: "K",
        references: []
    },
    "": {
        title: "",
        denotation: "",
        references: []
    }
};

const showItemsDefault = {
    informations: true,
    coloring: true,
    instructions: true
};

export default function InfoPanel() {
    const { graph, graphView } = useGraph();
    const [showItems, setShowItems] = useState(showItemsDefault);

    const totalColoringByColor = getColoringByColor(graph.totalColoring || new Map());
    const displayedColoringByColor = getColoringByColor(graphView.displayedColoring);

    const updateShowItems = (target: keyof typeof showItemsDefault) => {
        setShowItems((prev) => {
            const current = {
                ...prev,
                [target]: !prev[target]
            };

            localStorage.setItem("showItems", JSON.stringify(current));
            return current;
        });
    };

    useEffect(() => {
        const lsData = localStorage.getItem("showItems");

        if (lsData) {
            setShowItems(JSON.parse(lsData));
        }
    }, []);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <Card className="absolute left-0 p-0 shadow-md top-0 w-full z-10 md:top-5 lg:left-5 lg:max-w-sm">
                <CardContent className="flex flex-col gap-4 p-2 md:p-4 lg:gap-6">
                    {/* informações do grafo */}
                    {graph instanceof GraphClass && (
                        <section className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-xl">Informações</h2>

                                <Button
                                    variant="outline"
                                    size={"icon"}
                                    onClick={() => updateShowItems("informations")}
                                >
                                    {showItems.informations ? <MinusIcon /> : <PlusIcon />}
                                </Button>
                            </div>

                            {showItems.informations && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <h3>Classe:</h3>

                                        <span>
                                            {graphClassInfo[getGraphClassName(graph)].title}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <h3>Grafo:</h3>

                                        <span>
                                            {graphClassInfo[getGraphClassName(graph)].denotation}<sub>{graph.matrix.length}</sub>
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <h3>Referências:</h3>

                                        {graphClassInfo[getGraphClassName(graph)].references.map((reference, index) => (
                                            <span key={index}>
                                                {reference}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* coloração */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-xl">Coloração</h2>

                            <Button
                                variant="outline"
                                size={"icon"}
                                onClick={() => updateShowItems("coloring")}
                            >
                                {showItems.coloring ? <MinusIcon /> : <PlusIcon />}
                            </Button>
                        </div>

                        {showItems.coloring && (
                            <div className="flex flex-col gap-2">
                                {
                                    (graph.totalColoring) &&
                                    <div className="flex gap-2">
                                        <h3>Número cromático total:</h3>

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
                                        <h3>Cores utilizadas:</h3>

                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 1 }}
                                        >
                                            {displayedColoringByColor.size}
                                        </motion.span>
                                    </div>

                                    {displayedColoringByColor.size > 0 && (
                                        <div className="flex gap-2">
                                            <h3>Cores:</h3>

                                            <div className="flex flex-wrap gap-2">
                                                {displayedColoringByColor.keys().toArray().sort((a, b) => Number(a) - Number(b)).map((elementColor) => {
                                                    const color = Number(elementColor) - 1;
                                                    const colorHex = HexadecimalColors.get(color);

                                                    return (
                                                        <motion.span
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ duration: 1 }}
                                                            key={elementColor}
                                                            style={{
                                                                color: colorHex,
                                                                borderColor: colorHex,
                                                                borderWidth: "1px",
                                                                padding: "0.2px 6px",
                                                            }}
                                                        >
                                                            {elementColor}
                                                        </motion.span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* instruções */}
                    {graphView.actionMode !== "view" && (
                        <section className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-xl">
                                    Modo {modesConfig[graphView.actionMode].title}
                                </h2>

                                <Button
                                    variant="outline"
                                    size={"icon"}
                                    onClick={() => updateShowItems("instructions")}
                                >
                                    {showItems.instructions ? <MinusIcon /> : <PlusIcon />}
                                </Button>
                            </div>

                            {showItems.instructions && (
                                <div className="flex flex-col gap-2">
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