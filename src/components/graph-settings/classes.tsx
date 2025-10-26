import React, { FormEventHandler, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { getCompleteGraphMatrix, getCompleteGraphTotalColoring } from "@/lib/graphs";
import { useGraph } from "@/contexts/GraphContext";

export default function ClassesSettings() {
    const { updateGraph } = useGraph();
    const [graphClass, setGraphClass] = useState('');
    const [order, setOrder] = useState(3);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (graphClass === 'completes') {
            const matrix = getCompleteGraphMatrix(order);
            const totalColoring = getCompleteGraphTotalColoring(order);

            updateGraph({
                matrix,
                totalColoring,
                layout: 'circle',
                class: 'completes'
            });
        }
    };

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <section className="flex flex-col gap-4">
                <h2 className="border-b-2 border-b-gray-500 font-bold">
                    Selecione a classe
                </h2>

                <div className="flex gap-4">
                    <Select value={graphClass} onValueChange={setGraphClass}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecione uma classe" />
                        </SelectTrigger>                    
                        <SelectContent>
                            <SelectItem value="completes">Completos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>

            <section className={`${graphClass ? 'flex' : 'hidden'} flex-col gap-4`}>
                <h2 className="border-b-2 border-b-gray-500 font-bold">
                    Configurações dos {graphClass}
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

            <Button disabled={!graphClass}>Gerar Grafo</Button>
        </form>
    );
}