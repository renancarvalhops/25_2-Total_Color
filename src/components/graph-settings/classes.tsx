import { Dispatch, FormEvent, FormEventHandler, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Graph } from "@/types";

interface ClassesSettingsProps {
    setGraph: Dispatch<SetStateAction<Graph>>
}

export default function ClassesSettings({
    setGraph
}: ClassesSettingsProps) {
    const [graphClass, setGraphClass] = useState('');
    const [qtdVertices, setQtdVertices] = useState(3);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (graphClass === 'completos') {
            setGraph(prev => ({
                ...prev,
                order: qtdVertices
            }));
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
                            <SelectItem value="completos">Completos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>

            <section className={`${graphClass ? 'flex' : 'hidden'} flex-col gap-4`}>
                <h2 className="border-b-2 border-b-gray-500 font-bold">
                    Configurações dos {graphClass}
                </h2>

                <div className="flex gap-4">
                    <Label htmlFor="qtdVertices" className="font-normal">Quantidade de vértices</Label>
                    <Input
                        type="number"
                        id="qtdVertices"
                        name="qtdVertices"
                        value={qtdVertices}
                        onChange={(e) => {
                            setQtdVertices(Number(e.target.value))
                        }}
                    />
                </div>
            </section>

            <Button disabled={!graphClass}>Gerar Grafo</Button>
        </form>
    );
}