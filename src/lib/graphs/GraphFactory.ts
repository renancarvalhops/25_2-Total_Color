import { AcceptedFileExtensions, GraphClassesNames } from "@/types";
import PathGraph from "./classes/PathGraph";
import CycleGraph from "./classes/CycleGraph";
import CompleteGraph from "./classes/CompleteGraph";
import FreeGraph from "./FreeGraph";

interface MakeArguments {
    graphClassOptions?: {
        name: GraphClassesNames,
        order: number
    },
    graphFreeOptions?: {
        fileExtension: AcceptedFileExtensions,
        content: string
    }
}

export default class GraphFactory {
    static make({ graphClassOptions, graphFreeOptions }: MakeArguments): Graph {
        let Graph: Graph;

        if (graphClassOptions) {
            const { name, order } = graphClassOptions;

            switch (name) {
                case 'paths':
                    Graph = new PathGraph(order);
                    break;
                case 'cycles':
                    Graph = new CycleGraph(order);
                    break;
                case 'completes':
                    Graph = new CompleteGraph(order);
                    break;
            }
        } else if (graphFreeOptions) {
            const { fileExtension, content } = graphFreeOptions;

            Graph = new FreeGraph(fileExtension, content);
        } else {
            throw new Error('Insira informações em graphClassOptions ou graphFreeOptions');
        }


        return Graph;
    }
}