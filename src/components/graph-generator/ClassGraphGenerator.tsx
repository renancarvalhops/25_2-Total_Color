import React, { FormEventHandler, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import {
    getCompleteGraphMatrix,
    getCompleteGraphTotalColoring,
    getCycleGraphMatrix,
    getCycleGraphTotalColoring,
    getPathGraphMatrix,
    getPathGraphTotalColoring,
    matrixToGraph6
} from "@/lib/graphs";
import { useGraph } from "@/contexts/GraphContext";
import { Download } from "lucide-react";
import { layouts } from ".";

interface ClassGraphGeneratorProps {
    closeDialog: () => void
}

export default function ClassGraphGenerator({
    closeDialog
}: ClassGraphGeneratorProps) {
    const { updateGraph } = useGraph();
    const [graphClass, setGraphClass] = useState('');
    const [order, setOrder] = useState(3);
    const [fileG6, setFileG6] = useState<Blob>();
    const [layout, setLayout] = useState<string>();

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (graphClass === 'completes') {
            const matrix = getCompleteGraphMatrix(order);
            const totalColoring = getCompleteGraphTotalColoring(order);
            const blob = new Blob([matrixToGraph6(matrix)]);
            setFileG6(blob);

            updateGraph({
                matrix,
                totalColoring,
                layout,
                class: graphClass
            });
        } else if (graphClass === 'paths') {
            const matrix = getPathGraphMatrix(order);
            const totalColoring = getPathGraphTotalColoring(order);
            const blob = new Blob([matrixToGraph6(matrix)]);
            setFileG6(blob);

            updateGraph({
                matrix,
                totalColoring,
                layout,
                class: graphClass
            });
        } else if (graphClass === 'cycles') {
            const matrix = getCycleGraphMatrix(order);
            const totalColoring = getCycleGraphTotalColoring(order);
            const blob = new Blob([matrixToGraph6(matrix)]);
            setFileG6(blob);

            updateGraph({
                matrix,
                totalColoring,
                layout,
                class: graphClass
            });
        }

        closeDialog();
    };

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <section className="flex flex-col gap-4">
                <h2 className="border-b-2 border-b-gray-500 font-bold">
                    Selecione uma classe
                </h2>

                <div className="flex gap-4">
                    <Select
                        value={graphClass}
                        onValueChange={(value) => {
                            setGraphClass(value);
                            setLayout(value === 'paths' ? 'grid' : 'circle');
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma classe" />
                        </SelectTrigger>                    
                        <SelectContent>
                            <SelectItem value="completes">Completos</SelectItem>
                            <SelectItem value="paths">Caminhos</SelectItem>
                            <SelectItem value="cycles">Ciclos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>

            <section className={`${graphClass ? 'flex' : 'hidden'} flex-col gap-4`}>
                <h2 className="border-b-2 border-b-gray-500 font-bold">
                    Configurações da classe
                </h2>

                <div className="flex gap-4">
                    <Label htmlFor="order" className="font-normal">Quantidade de vértices</Label>
                    <Input
                        type="number"
                        id="order"
                        name="order"
                        min={1}
                        value={order}
                        onChange={(e) => {
                            setOrder(Number(e.target.value))
                        }}
                    />
                </div>
            </section>

            <section className={`${graphClass ? 'flex flex-col gap-4' : 'hidden'}`}>
                <h2 className="border-b-2 border-b-gray-500 font-bold">
                    Layout
                </h2>

                <div className="flex gap-4">
                    <Select value={layout} onValueChange={setLayout}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um layout" />
                        </SelectTrigger>
                        <SelectContent>
                            {layouts.map((layout) => (
                                <SelectItem key={layout.value} value={layout.value}>
                                    {layout.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </section>            

            <Button disabled={!graphClass}>Gerar Grafo</Button>

            <Button
                variant="outline"
                className={`${!fileG6 && 'hidden'}`}
            >
                <Download />
                <a
                    download={`${graphClass}-${order}.g6`}
                    href={fileG6 && URL.createObjectURL(fileG6)}
                >
                    Baixar em graph6
                </a>
            </Button>
        </form>
    );
}