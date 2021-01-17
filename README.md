## Getting Started

This is implemented in TypeScript, so to run this requires TypeScript. Install using npm with:
```
npm install --production
```
To compile to JavaScript, run `npm build`

To run all example cases sequentially, both finding faces and then finding adjacent faces for each found face, run:
```
npm run test
```


## Polygon Parser
To parse a list of vertices and edges use any of the following:

JSON file
```
npm run polygonParser <path-to-json>.json
```
The JSON file must have the following schema: 
```
{
    "vertices": [[0, 0], [0, 2], [2, 2]]    // [X, Y]
    "edges": [[0, 1], [1, 2]]               // [startVertexIndex, endVertexIndex]
}
```

Example Cases. There are 7 example cases to run. You can pass a number 1-7 or exampleCase1-7 to run the example case

```
npm run polygonParser 6
```
```
npm run polygonParser exampleCase4
```

## Find Adjacent Faces
To parse the output of polygonParser and a face ID* and receive the faces adjacent to `faceID`, use any of the following:

**NOTE:** Face IDs are capital letters (A, B, C ... YY, ZZ)

JSON file
```
npm run findAdjacentFaces <path-to-json>.json <faceID>
```
The JSON file must have the following schema: 
```
{
    "vertices": [{ "index": 0, "X": 0, "Y: 0 }, ...]
    "edges": [{ "id": "0_1", "start": 0, "end: 1 }, ...]
    "faces": [{ "id": "A", "points": [0, 1, 2] }, ...]
}
```

Example Cases. There are 7 example cases to run. You can pass a number 1-7 or exampleCase1-7 to run the example case

```
npm run polygonParser 6 "B"
```
```
npm run polygonParser exampleCase4 "D"
```

## Project Structure
```
/data                           # Example cases / tests
| - /adjacentFaceTests
    | - exampleCase.json
    | - ...
| - /polygonParsertests
    | - index.ts
    | - ...
/src                            # Source-code for classes, algorithms, and utilities
    | - ...
index.html                      # HTML page to show results of polygonParser
main.ts                         # The main content of the web-based implementation
tsconfig.json                   # TypeScript project config for web-based implementation
tsconfig.node.json              # TypeScript project config for CLI based implementation
```