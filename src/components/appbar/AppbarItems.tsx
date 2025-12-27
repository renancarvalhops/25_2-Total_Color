import { MouseEventHandler } from "react";
import About from "./About";
import ButtonActionMode from "./ButtonActionMode";
import DownloadColoredGraph from "./DownloadColoredGraph";
import DownloadGraph6 from "./DownloadGraph6";
import Instructions from "./Instructions";
import NewGraph from "./NewGraph";
import ShowColoring from "./ShowColoring";
import { useGraph } from "@/contexts/GraphContext";
import FreeGraph from "@/lib/graphs/FreeGraph";

interface AppbarItemsProps {
    onItemClick?: MouseEventHandler
}

export default function AppbarItems({
    onItemClick = () => {}
}: AppbarItemsProps) {
    const { graph, graphView } = useGraph();

    return (
        <>
            {graphView.active && (
                <div>
                    <Instructions />
                </div>
            )}

            {graph.totalColoring && (
                <div onClick={onItemClick}>
                    <ShowColoring />
                </div>
            )}

            {graphView.active && graph instanceof FreeGraph && (
                <>
                    <div onClick={onItemClick}>
                        <ButtonActionMode actionMode="vertex" text="Adicionar vértice (v)" />
                    </div>

                    <div onClick={onItemClick}>
                        <ButtonActionMode actionMode="edge" text="Adicionar aresta (e)" />
                    </div>

                    <div onClick={onItemClick}>
                        <ButtonActionMode actionMode="coloring" text="Atribuir cor (c)" />
                    </div>
                </>
            )}

            {graphView.active && (
                <div onClick={onItemClick}>
                    <NewGraph />
                </div>
            )}

            {graphView.displayedColoring.size > 0 && (
                <div onClick={onItemClick}>
                    <DownloadColoredGraph />
                </div>
            )}

            {graphView.active && (
                <div onClick={onItemClick}>
                    <DownloadGraph6 />
                </div>
            )}

            <div>
                <About />
            </div>
        </>     
    );
}