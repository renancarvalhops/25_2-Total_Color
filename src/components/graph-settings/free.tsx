import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../ui/shadcn-io/dropzone";
import { Button } from "../ui/button";
import { Graph } from "@/types";

type Matrix = {
    text: string,
    data: number[][]
};

interface FreeSettingsProps {
    setGraph: Dispatch<SetStateAction<Graph>>
}

export default function FreeSettings({
    setGraph
}: FreeSettingsProps) {
    const [files, setFiles] = useState<File[] | undefined>();
    const [matrix, setMatrix] = useState<Matrix>();

    const handleDrop = (files: File[]) => {
        setFiles(files);

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                const lines = reader.result.split(/\s+/g);
                const newMatrix: Matrix = {
                    text: '',
                    data: []
                };

                lines.forEach((line, lineNumber) => {
                    newMatrix.data.push([]);
                    line.split(',').forEach(char => {
                        newMatrix.text += ` ${char}`;
                        newMatrix.data[lineNumber].push(Number(char));
                    });
                    newMatrix.text += '\n';
                });

                setMatrix(newMatrix);
            }
        };
        reader.readAsText(files[0]);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setGraph(prev => ({
            ...prev,
            matrix: matrix?.data
        }));
    };

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <section className="flex flex-col gap-4">
                <h2 className="border-b-2 border-b-gray-500 font-bold">
                    Carregue um arquivo .txt da matriz
                </h2>

                <div className="flex flex-col gap-4">
                    <Dropzone
                        accept={{ 'text/plain': ['.txt'] }}
                        maxFiles={1}
                        maxSize={1024 * 1024 * 10}
                        onDrop={handleDrop}
                        onError={console.error}
                        src={files}
                    >
                        <DropzoneEmptyState />

                        <DropzoneContent />
                    </Dropzone>

                    <pre className="text-center">
                        {matrix?.text}
                    </pre>
                </div>
            </section>

            <Button disabled={!files}>Gerar Grafo</Button>
        </form>
    );
}