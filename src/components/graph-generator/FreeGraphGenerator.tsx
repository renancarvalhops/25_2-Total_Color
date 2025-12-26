import { FormEventHandler, useState } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../ui/shadcn-io/dropzone";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useGraph } from "@/contexts/GraphContext";
import { AcceptedFileExtensions } from "@/types";
import { layouts } from ".";
import GraphFactory from "@/lib/graphs/GraphFactory";
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon, FileDownIcon, InfoIcon, SquareCheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import Image from "next/image";


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
    const { initGraph } = useGraph();
    const [files, setFiles] = useState<File[]>();
    const [graphFile, setGraphFile] = useState<GraphFreeOptions & { name: string }>();
    const [layout, setLayout] = useState<string>('');
    const [isColored, setIsColored] = useState(false);
    const [step, setStep] = useState<"form" | "adj_matrix" | "col_matrix" | "g6">("form");

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

        const graph = GraphFactory.make({
            graphFree: graphFile ? {
                fileExtension: graphFile.fileExtension,
                content: graphFile.content,
                isColored: isColored
            } : null
        });

        initGraph(graph, {
            layout,
            name: graphFile ? graphFile.name : 'free-graph',
            coloring: {
                orientation: 'color',
                show: false
            },
            active: true,
            mode: "view"
        });
        
        closeDialog();
    };

    return (
        <section>
            {step === "form" && (
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit}
                >
                    <Button className="cursor-pointer bg-blue-500 hover:bg-blue-500">
                        Gerar um grafo do zero
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">OU</span>
                        </div>
                    </div>

                    <section className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 items-center">
                            <Dropzone
                                accept={{ 'text/plain': ['.txt', '.g6'] }}
                                maxFiles={1}
                                maxSize={1024 * 1024 * 10}
                                onDrop={handleDrop}
                                onError={console.error}
                                src={files}
                            >
                                <DropzoneEmptyState>
                                    <div className="cursor-pointer flex flex-col gap-2 items-center">
                                        <DownloadIcon />
                                        <p>Adicione um grafo a partir de um arquivo .txt ou .g6</p>

                                        <div className="text-gray-600 text-sm">
                                            <p>Arraste e solte ou clique para carregar</p>
                                            <p>Tamanho máximo: 10MB</p>
                                        </div>
                                    </div>
                                </DropzoneEmptyState>

                                <DropzoneContent>
                                    <div className="cursor-pointer flex flex-col gap-2 items-center">
                                        <DownloadIcon />
                                        <p>{files && files[0].name}</p>

                                        <div className="text-gray-600 text-sm">
                                            <p>Arraste e solte ou clique para substituir</p>
                                        </div>
                                    </div>
                                </DropzoneContent>
                            </Dropzone>
                        </div>

                        <Button variant={"secondary"} className="cursor-pointer" onClick={(e) => {
                            e.preventDefault();
                            setStep("adj_matrix");
                        }}>
                            <InfoIcon />
                            Instruções sobre os formatos de arquivo
                        </Button>

                        <div className="border-2 hover:opacity-70 rounded-md">
                            <label className="cursor-pointer flex gap-2 p-2">
                                <input
                                    type="checkbox"
                                    className="cursor-pointer"
                                    checked={isColored}
                                    onChange={(e) => setIsColored(e.target.checked)}
                                />

                                Grafo com coloração
                            </label>
                        </div>

                        <section className={`${graphFile ? 'flex flex-col gap-4' : 'hidden'}`}>
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

                    {graphFile &&
                        <Button className="cursor-pointer bg-blue-500 hover:bg-blue-500">
                            Gerar um grafo a partir de um arquivo
                        </Button>
                    }
                </form>   
            )}

            {step === "adj_matrix" && (
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-4 text-justify">
                        <p>O arquivo <code>.txt</code> pode conter uma matriz de adjacências ou um grafo com a coloração já realizada.</p>

                        <p>Para arquivos <code>.txt</code> contendo uma matriz de adjacências, considera-se que ela representa um grafo não direcionado. Apenas o triângulo superior da matriz, excluindo a diagonal principal, será considerado.</p>

                        <p>Como exemplo, tanto <em>M<sub>1</sub></em> quanto <em>M<sub>2</sub></em> geram o mesmo grafo:</p>

                        <div className="flex gap-5 items-center justify-between">
                            <div className="flex gap-2 items-center">
                                <div>M<sub>1</sub> =</div>
                                <code className="flex flex-col">
                                    <span>0101</span>
                                    <span>0010</span>
                                    <span>0001</span>
                                    <span>0000</span>
                                </code>
                            </div>

                            <div className="flex gap-2 items-center">
                                <div>M<sub>2</sub> =</div>
                                <code className="flex flex-col">
                                    <span>0101</span>
                                    <span>1010</span>
                                    <span>0101</span>
                                    <span>1010</span>
                                </code>
                            </div>

                            <Image
                                alt="Exemplo de grafo gerado por upload de um .txt com matriz de adjacências"
                                src="/examples/example-graph.png"
                                width={100}
                                height={100}
                            />
                        </div>

                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="flex gap-2">
                            <a
                                href={"/examples/example-adj_matrix-m1.txt"}
                                download
                            >
                                <Button variant={"outline"}>
                                    <FileDownIcon />
                                    Download do exemplo <span>M<sub>1</sub></span>
                                </Button>
                            </a>

                            <a
                                href={"/examples/example-adj_matrix-m2.txt"}
                                download
                            >
                                <Button variant={"outline"}>
                                    <FileDownIcon />
                                    Download do exemplo <span>M<sub>2</sub></span>
                                </Button>
                            </a>
                        </div>

                        <div className="flex justify-between">
                            <Button className="cursor-pointer" variant={"secondary"} onClick={() => setStep("form")}>
                                <ArrowLeftIcon />
                                Voltar
                            </Button>

                            <Button className="cursor-pointer" variant={"secondary"} onClick={() => setStep("col_matrix")}>
                                Instruções .txt (coloração)
                                <ArrowRightIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {step === "col_matrix" && (
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-4 text-justify">
                        <p>Para arquivos <code>.txt</code> que contêm um grafo com a coloração já realizada, o padrão adotado é o seguinte:</p>

                        <div className="flex gap-2 items-center">
                            <code className="flex flex-col">
                                <span>[quantidade de vértices]</span>
                                <span>[indice_vertice cor]</span>
                                <span>[quantidade de arestas]</span>
                                <span>[indice_vertice1 indice_vertice2 cor]</span>
                            </code>
                        </div>

                        <p>Como exemplo, temos:</p>

                        <div className="flex gap-5 items-center justify-between">
                            <div className="flex gap-2 items-center">
                                <code className="flex flex-col">
                                    <span>3</span>
                                    <span>0 0</span>
                                    <span>1 1</span>
                                    <span>2 2</span>
                                    <span>3</span>
                                    <span>0 1 2</span>
                                    <span>0 2 1</span>
                                    <span>1 2 0</span>
                                </code>
                            </div>

                            <Image
                                alt="Exemplo de grafo gerado por upload de um .txt de um grafo com coloração"
                                src="/examples/example-graph-coloring.png"
                                width={150}
                                height={150}
                            />
                        </div>

                        <p><strong>Observação:</strong> ao adicionar um arquivo contendo um grafo com coloração, é necessário indicar ao sistema que o grafo já se encontra colorido.</p>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="flex gap-2">
                            <a
                                href={"/examples/example-col_matrix.txt"}
                                download
                            >
                                <Button variant={"outline"}>
                                    <FileDownIcon />
                                    Download do exemplo
                                </Button>
                            </a>
                        </div>

                        <div className="flex justify-between">
                            <Button className="cursor-pointer" variant={"secondary"} onClick={() => setStep("adj_matrix")}>
                                <ArrowLeftIcon />
                                Instruções .txt (adjacências)
                            </Button>

                            <Button className="cursor-pointer" variant={"secondary"} onClick={() => setStep("g6")}>
                                Instruções .g6
                                <ArrowRightIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {step === "g6" && (
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-4 text-justify">
                        <p>Arquivos <code>.g6</code> codificam grafos simples não-direcionados em caracteres correspondentes aos códigos 63 a 126 da tabela ASCII.</p>

                        <div>
                            <p>Especificação do formato:</p>
                            <a href="https://users.cecs.anu.edu.au/~bdm/data/formats.txt" target="_blank">https://users.cecs.anu.edu.au/~bdm/data/formats.txt</a>
                        </div>

                        <div>
                            <p>Conversor entre matriz de adjacências e o formato <code>graph6</code>, implementado em TypeScript/JavaScript:</p>
                            <a href="https://www.npmjs.com/package/graph6" target="_blank">https://www.npmjs.com/package/graph6</a>
                        </div>

                        <p>Como exemplo, temos:</p>

                        <div className="flex gap-10 items-center justify-center">
                            <div className="flex gap-2 items-center">
                                <code className="flex flex-col">
                                    <span>{"D~{"}</span>
                                </code>
                            </div>

                            <Image
                                alt="Exemplo de grafo gerado por upload de um .g6"
                                src="/examples/example-graph6.png"
                                width={150}
                                height={150}
                            />

                        </div>
                        
                        <p><strong>Observação:</strong> nesse sistema é possível exportar qualquer grafo para o formato <code>.g6</code>.</p>

                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="flex gap-2">
                            <a
                                href={"/examples/example-graph6.g6"}
                                download
                            >
                                <Button variant={"outline"}>
                                    <FileDownIcon />
                                    Download do exemplo
                                </Button>
                            </a>
                        </div>

                        <div className="flex justify-between">
                            <Button className="cursor-pointer" variant={"secondary"} onClick={() => setStep("col_matrix")}>
                                <ArrowLeftIcon />
                                Instruções .txt (coloração)
                            </Button>

                            <Button className="cursor-pointer" variant={"secondary"} onClick={() => setStep("form")}>
                                <ArrowLeftIcon />
                                Voltar para o formulário
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}