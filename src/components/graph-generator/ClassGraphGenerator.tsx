import React, { FormEventHandler, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { useGraph } from "@/contexts/GraphContext";
import { layouts } from ".";
import GraphFactory from "@/lib/graphs/GraphFactory";
import { GraphClassesNames } from "@/types";

interface ClassGraphGeneratorProps {
    closeDialog: () => void
}

export default function ClassGraphGenerator({
    closeDialog
}: ClassGraphGeneratorProps) {
    const { initGraph } = useGraph();
    const [graphClassName, setGraphClassName] = useState<GraphClassesNames>();
    const [order, setOrder] = useState('3');
    const [layout, setLayout] = useState('');

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (graphClassName) {
            const graph = GraphFactory.make({
                graphClass: {
                    name: graphClassName,
                    order: order ? Number(order) : 1
                }
            });

            initGraph(graph, {
                layout,
                name: `${graphClassName}-${order}`,
                renderings: 0,
                coloring: {
                    orientation: graphClassName === 'completes' ? 'color' : 'index',
                    show: false
                }
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
                        value={graphClassName}
                        onValueChange={(value: GraphClassesNames) => {
                            setGraphClassName(value);
                            setLayout(value === 'paths' ? 'grid' : 'circle');
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma classe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="paths">Caminhos</SelectItem>
                            <SelectItem value="cycles">Ciclos</SelectItem>
                            <SelectItem value="completes">Completos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>

            <section className={`${graphClassName ? 'flex' : 'hidden'} flex-col gap-4`}>
                <h2 className="border-b-2 border-b-gray-500 font-bold">
                    Configurações da classe
                </h2>

                <div className="flex gap-4">
                    <Label htmlFor="order" className="font-normal">Quantidade de vértices</Label>
                    <Input
                        type="number"
                        id="order"
                        name="order"
                        min={graphClassName === 'cycles' ? 3 : 1}
                        value={order}
                        onChange={(e) => {
                            setOrder(e.target.value)
                        }}
                    />
                </div>
            </section>

            <section className={`${graphClassName ? 'flex flex-col gap-4' : 'hidden'}`}>
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

            <Button disabled={!graphClassName}>Gerar Grafo</Button>
        </form>
    );
}