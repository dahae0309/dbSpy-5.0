"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//hard-coded xy positioning of each node in the canvas
function createNodes(schemaObject, edges) {
    console.log('i am in createNodes file');
    const nodePositions = [
        { x: 1000, y: 400 },
        { x: 1000, y: 0 },
        { x: 0, y: 600 },
        { x: 0, y: 0 },
        { x: 2500, y: 200 },
        { x: 0, y: 200 },
        { x: 2000, y: 800 },
        { x: 0, y: 400 },
        { x: 0, y: 800 },
        { x: 1000, y: 800 },
        { x: 0, y: 1050 },
    ];
    // renders each table on the React Flow canvas
    const nodes = [];
    let i = 0;
    for (const tableKey in schemaObject) {
        //tableKey is name of the table
        const columnData = schemaObject[tableKey]; //obj of obj
        //console.log("here", tableKey, columnData)
        //console.log("edges", edges) //edges are coming from createEdges file
        nodes.push({
            id: tableKey,
            type: 'table',
            position: nodePositions[i],
            data: { table: [tableKey, columnData], edges },
        });
        i = (i + 1) % 17;
    }
    return nodes;
}
exports.default = createNodes;
//# sourceMappingURL=createNodes.js.map