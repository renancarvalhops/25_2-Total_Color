import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { useGraph } from "@/contexts/GraphViewContext";
import { HexadecimalColors } from "./ViewerUtils";

interface ColoringPanelProps {
    elementColors: string[]
}

export default function ColoringPanel({
    elementColors
}: ColoringPanelProps) {
    const { graph } = useGraph();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="absolute left-10 max-w-sm top-10 z-10">
                <CardContent className="flex flex-col gap-2 text-lg">
                    {
                        (graph.totalColoring) &&
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
                        <span>Cores utilizadas: {elementColors.length}</span>

                        <div className="flex flex-wrap gap-2">
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
                </CardContent>
            </Card>
        </motion.section>
    );
}