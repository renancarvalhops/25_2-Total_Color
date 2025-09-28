import { Collection, SingularElementArgument } from "cytoscape";

type ValidatedTotalColoring = {
    hasConflict: boolean,
    adjacentElements: Collection
}

const validateTotalColoring = (targetElement: SingularElementArgument): ValidatedTotalColoring => {    
    let adjacentElements: Collection;

    if (targetElement.isNode()) {
        adjacentElements = targetElement.neighborhood();
    } else {
        const incidentVertices = targetElement.connectedNodes();
        const adjacentEdges = (incidentVertices.connectedEdges()).difference(targetElement);

        adjacentElements = incidentVertices.union(adjacentEdges);
    }

    let validationResult: ValidatedTotalColoring = {
        hasConflict: false,
        adjacentElements: adjacentElements
    };

    adjacentElements.forEach(adjacentElement => {
        if (
            targetElement.data('colorNumber') &&
            adjacentElement.data('colorNumber') &&
            targetElement.data('colorNumber') === adjacentElement.data('colorNumber')
        ) {
            validationResult.hasConflict = true;
        }
    });

    return validationResult;
};

export { validateTotalColoring }