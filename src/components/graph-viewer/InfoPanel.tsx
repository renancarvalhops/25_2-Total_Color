import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { useGraph } from "@/contexts/GraphContext";
import { HexadecimalColors } from "./ViewerUtils";
import { PiMouseScrollLight } from "react-icons/pi";
import { HiCursorClick } from "react-icons/hi";
import { BsShiftFill } from "react-icons/bs";
import { TiSortNumerically } from "react-icons/ti";

export const InstructionsText = () => (
    <div className="flex flex-col gap-2 pl-4">
        <div className="flex gap-2 items-center">
            <PiMouseScrollLight size={30} />
            Utilize o scroll para aumentar/diminuir o zoom
        </div>

        <div className="flex gap-2 items-center">
            <HiCursorClick size={30} />
            Clique em um elemento do grafo para selecioná-lo
        </div>

        <div className="flex gap-2 items-center">
            <BsShiftFill size={30} />
            Shift + Clique para selecionar mais de um elemento
        </div>

        <div className="flex gap-2 items-center">
            <TiSortNumerically size={30} />
            Digite um número para atribuir uma cor ao(s) elemento(s) selecionado(s)
        </div>
    </div>
);

interface ColoringPanelProps {
    elementColors: string[]
}

export default function InfoPanel({
    elementColors
}: ColoringPanelProps) {
    const { graph } = useGraph();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <Card className="absolute md:p-2 md:top-5 left-0 lg:left-5 lg:max-w-sm p-1 shadow-md top-0 w-full z-10">
                <CardContent className="flex flex-col gap-6 md:p-4 p-1 text-md">
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

                            <div className="flex flex-row flex-wrap gap-2 items-center lg:flex-col lg:items-start">
                                <div className="flex gap-2">
                                    <span className="font-semibold">
                                        Cores utilizadas:
                                    </span>
                                    
                                    <span>
                                        {elementColors.length}
                                    </span>
                                </div>

                                <div className="border border-blue-500 flex flex-wrap gap-2 lg:border-0 lg:p-0 p-2 rounded">
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

                    <section className="flex-col gap-4 hidden lg:flex">
                        <p className="border-b-2 bg-gray-100 border-blue-500 font-semibold pl-2 px-4 py-2 rounded text-lg">
                            Instruções
                        </p>

                        <InstructionsText />
                    </section>
                </CardContent>
            </Card>
        </motion.section>
    );
}