import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { useGraphView } from "@/contexts/GraphViewContext";
import { colors as colorsHex } from "./visualization";

interface ColoringPanelProps {
    colors: string[]
}

export default function ColoringPanel({
    colors
}: ColoringPanelProps) {
    const { graphView } = useGraphView();

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="absolute left-10 max-w-sm top-10 z-10">
                <CardContent className="flex flex-col gap-2 text-lg">
                    {
                        (graphView.graph.totalColoring) &&
                        <div className="flex gap-2">
                            <span>Número cromático total:</span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                {graphView.graph.totalColoring.length}
                            </motion.span>
                        </div>
                    }

                    <div className="flex flex-col gap-2">
                        <span>Cores utilizadas: {colors.length}</span>
                        <div className="flex gap-2">
                            {colors.map((color) => (
                                <span
                                    key={color}
                                    style={{
                                        color: colorsHex[(Number(color) - 1) % colorsHex.length]
                                    }}
                                >
                                    {color}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.section>
    );
}