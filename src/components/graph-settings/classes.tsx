import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ClassesSettings() {
    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
        >
            <Input type="number" placeholder="Quantidade de Vértices" />

            <Button>Atualizar Grafo </Button>
        </form>
    );
}