import { FormEventHandler, useState } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../ui/shadcn-io/dropzone";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useGraph } from "@/contexts/GraphContext";
import { GraphFile } from "@/types";
import { getGraphMatrix } from "@/lib/graphs";

export default function FreeSettings() {
    const { updateGraph } = useGraph();
    const [files, setFiles] = useState<File[]>();
    const [graphFile, setGraphFile] = useState<GraphFile>();
    const [layout, setLayout] = useState<string>();

    const handleDrop = (newFiles: File[]) => {
        setFiles(newFiles);
        
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                const isG6 = /.+\.g6$/g;

                if (isG6.test(newFiles[0].name)) {
                    setGraphFile({
                        type: 'g6',
                        text: reader.result.split(/\s+/g)[0]
                    });
                } else {
                    setGraphFile({
                        type: 'txt',
                        text: reader.result
                    });
                }
            }
        };

        reader.readAsText(newFiles[0]);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (graphFile) {
            const matrix = getGraphMatrix(graphFile);
    
            updateGraph({
                file: graphFile,
                matrix,
                layout: layout ?? 'grid'
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
                    Carregue um arquivo .txt da matriz ou .g6
                </h2>

                <div className="flex flex-col gap-4 items-center">
                    <Dropzone
                        accept={{ 'text/plain': ['.txt', '.g6'] }}
                        maxFiles={1}
                        maxSize={1024 * 1024 * 10}
                        onDrop={handleDrop}
                        onError={console.error}
                        src={files}
                    >
                        <DropzoneEmptyState />

                        <DropzoneContent />
                    </Dropzone>

                    <pre className="max-h-72 max-w-72 overflow-auto">
                        {graphFile?.text}
                    </pre>
                </div>

                <section className={`${graphFile ? 'flex flex-col gap-4' : 'hidden'}`}>
                    <h2 className="border-b-2 border-b-gray-500 font-bold">
                        Layout
                    </h2>

                    <div className="flex gap-4">
                        <Select value={layout} onValueChange={setLayout}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecione um layout" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="random">Random</SelectItem>
                                <SelectItem value="grid">Grid</SelectItem>
                                <SelectItem value="circle">Circle</SelectItem>
                                <SelectItem value="concentric">Concentric</SelectItem>
                                <SelectItem value="breadthfirst">Breadthfirst</SelectItem>
                                <SelectItem value="cose">Cose</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </section>
            </section>

            <Button disabled={!graphFile}>Gerar Grafo</Button>
        </form>
    );
}