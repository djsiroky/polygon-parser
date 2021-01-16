export interface ExampleData {
    vertices: Array<[number, number]>
    edges: Array<[number, number]>
}
const exampleData: ExampleData = {
    "vertices": [[0, 0], [2, 0], [2, 2], [0, 2]],
    "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3]]
}

const exampleData2: ExampleData = {
    "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [1, 3], [0, 4]],
    "edges": [[0, 1], [1, 2], [0, 2], [3, 4], [3, 5], [4, 5], [0, 3], [2, 3], [2, 4]]
}

const exampleData3: ExampleData = {
    "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [1, 3], [0, 4], [2, 4]],
    "edges": [[0, 1], [1, 2], [0, 2], [3, 4], [3, 5], [4, 5], [0, 3], [2, 3], [2, 4], [4, 6], [2, 6]]
}

const exampleData4: ExampleData = {
    "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [1, 3], [0, 4], [2, 4], [4, 2], [5, 5], [6, 3], [4, 0]],
    "edges": [[0, 1], [1, 2], [0, 2], [3, 4], [3, 5], [4, 5], [0, 3], [2, 3], [2, 4], [4, 6], [2, 6], [2, 7], [7, 8], [8, 9], [9, 10], [10, 1]]
}

const exampleData5: ExampleData = {
    "vertices": [[0, 0], [2, 0], [2, 2], [0, 2], [1, 3], [0, 4], [2, 4], [4, 2], [5, 5], [6, 3], [4, 0]],
    "edges": [[0, 1], [1, 2], [0, 2], [3, 4], [3, 5], [4, 5], [0, 3], [2, 3], [2, 4], [4, 6], [2, 6], [2, 7], [7, 8], [8, 9], [9, 10], [10, 1], [2, 8]]
}

const exampleData6: ExampleData = {
    "vertices": [[4, 4], [2, 4], [3, 3], [5, 3], [6, 4], [5, 5], [3, 5]],
    "edges": [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1]]
}

const exampleData7: ExampleData = {
    "vertices": [[2, 4], [4, 4], [0, 0], [6, 0], [0, 6], [6, 6]],
    "edges": [[0, 1], [2, 3], [0, 2], [0, 4], [2, 4], [1, 3], [1, 5], [4, 5], [3, 5]]
}

import { findAdjacentFaces } from './src/adjacentFaces'
import { parsePolygons } from './src/polygonParser'

const faces = parsePolygons(exampleData6)

const adjacentFaces = findAdjacentFaces(faces, 'C')
console.log('ADJACENT FACES')
console.log(adjacentFaces.map(face => face.id))