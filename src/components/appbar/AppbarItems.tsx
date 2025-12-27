import About from "./About";
import ButtonActionMode from "./ButtonMode";
import DownloadColoredGraph from "./DownloadColoredGraph";
import DownloadGraph6 from "./DownloadGraph6";
import Instructions from "./Instructions";
import NewGraph from "./NewGraph";
import ShowColoring from "./ShowColoring";

export default function AppbarItems() {
    return (
        <>
            <Instructions />

            <ShowColoring />

            <ButtonActionMode actionMode="vertex" text="Adicionar vértice (v)" />

            <ButtonActionMode actionMode="edge" text="Adicionar aresta (e)" />

            <ButtonActionMode actionMode="coloring" text="Atribuir cor (c)" />

            <NewGraph />

            <DownloadColoredGraph />

            <DownloadGraph6 />

            <About />
        </>
    );
}