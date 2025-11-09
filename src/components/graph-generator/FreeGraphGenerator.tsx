import { FormEventHandler, useState } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../ui/shadcn-io/dropzone";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useGraphView } from "@/contexts/GraphViewContext";
import { AcceptedFileExtensions } from "@/types";
import { layouts } from ".";
import GraphFactory from "@/lib/graphs/GraphFactory";


interface GraphFreeOptions {
    fileExtension: AcceptedFileExtensions,
    content: string
}

interface FreeGraphGeneratorProps {
    closeDialog: () => void
}

export default function FreeGraphGenerator({
    closeDialog
}: FreeGraphGeneratorProps) {
    const { generateGraphView } = useGraphView();
    const [files, setFiles] = useState<File[]>();
    const [graphFile, setGraphFile] = useState<GraphFreeOptions & { name: string }>();
    const [layout, setLayout] = useState<string>('');

    const handleDrop = (newFiles: File[]) => {
        setFiles(newFiles);

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                const isG6 = /.+\.g6$/g;

                if (isG6.test(newFiles[0].name)) {
                    setGraphFile({
                        name: newFiles[0].name.replace(/\..+$/, ''),
                        fileExtension: 'g6',
                        content: reader.result.split(/\s+/g)[0]
                    });
                } else {
                    setGraphFile({
                        name: newFiles[0].name.replace(/\..+$/, ''),
                        fileExtension: 'txt',
                        content: reader.result
                    });
                }
            }
        };

        reader.readAsText(newFiles[0]);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (graphFile) {
            const graph = GraphFactory.make({
                graphFreeOptions: {
                    fileExtension: graphFile.fileExtension,
                    content: graphFile.content
                }
            });

            generateGraphView({
                graph,
                layout,
                name: graphFile.name,
                renderings: 0
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
                        {graphFile?.content}
                    </pre>
                </div>

                <section className={`${graphFile ? 'flex flex-col gap-4' : 'hidden'}`}>
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
            </section>

            <Button disabled={!graphFile}>Gerar Grafo</Button>
        </form>
    );
}