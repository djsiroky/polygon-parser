interface ExampleData {
    vertices: Array<[number, number]>
    edges: Array<[number, number]>
}

/**
 *  Simple example given in brief. Rectangle with diagonal interior edge 
 */
const exampleCase: ExampleData = {
    "vertices": [[0, 0], [4, 0], [4, 4], [0, 4]],
    "edges": [[0, 1], [1, 2], [0, 2], [0, 3], [2, 3]]
}

/**
 *  Polygon with more faces and interior edges
 */
const exampleCase2: ExampleData = {
    "vertices": [[0, 0], [3, 0], [3, 3], [0, 3], [1.5, 4.5], [0, 6]],
    "edges": [[0, 1], [1, 2], [0, 2], [3, 4], [3, 5], [4, 5], [0, 3], [2, 3], [2, 4]]
}

/**
 *  Concave polygon. This case prevents any sort of convex hull method
 *  to get the perimeter of overall shape.
 */
const exampleCase3: ExampleData = {
    "vertices": [[0, 0], [3, 0], [3, 3], [0, 3], [1.5, 4.5], [0, 6], [3, 6]],
    "edges": [[0, 1], [1, 2], [0, 2], [3, 4], [3, 5], [4, 5], [0, 3], [2, 3], [2, 4], [4, 6], [2, 6]]
}

/**
 *  Concave polygon with non-triangular shape
 */
const exampleCase4: ExampleData = {
    "vertices": [[0, 0], [3, 0], [3, 3], [0, 3], [1.5, 4.5], [0, 6], [3, 6], [6, 3], [7, 6], [8, 4], [6, 0]],
    "edges": [
        [0, 1], [1, 2], [0, 2], [3, 4], [3, 5], [4, 5], [0, 3], [2, 3], 
        [2, 4], [4, 6], [2, 6], [2, 7], [7, 8], [8, 9], [9, 10], [10, 1]
    ]
}

/**
 *  Concave polygon with non-triangular shape and a vertex not found on the perimeter of the overall shape
 */
const exampleCase5: ExampleData = {
    "vertices": [[0, 0], [3, 0], [3, 3], [0, 3], [1.5, 4.5], [0, 6], [3, 6], [6, 3], [7, 6], [8, 4], [6, 0]],
    "edges": [
        [0, 1], [1, 2], [0, 2], [3, 4], [3, 5], [4, 5], [0, 3], [2, 3], [2, 4], 
        [4, 6], [2, 6], [2, 7], [7, 8], [8, 9], [9, 10], [10, 1], [2, 8]
    ]
}

/**
 *  Polygon with an interior point and several nodes with the same number of neighbors 
 */
const exampleCase6: ExampleData = {
    "vertices": [[2.5, 3], [0, 3], [1, 1], [4, 1], [5, 3], [4, 5], [1, 5]],
    "edges": [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1]]
}

/**
 *  Polygon with all nodes having the same number of neighbors. The algorithm should be
 *  able to handle a set of nodes, where from a graph perspective, every point looks the same
 */
const exampleCase7: ExampleData = {
    "vertices": [[2, 4], [4, 4], [0, 0], [6, 0], [0, 6], [6, 6]],
    "edges": [[0, 1], [2, 3], [0, 2], [0, 4], [2, 4], [1, 3], [1, 5], [4, 5], [3, 5]]
}

const examplesList = [
    exampleCase,
    exampleCase2,
    exampleCase3,
    exampleCase4,
    exampleCase5,
    exampleCase6,
    exampleCase7,
]

export { ExampleData, examplesList, exampleCase, exampleCase2, exampleCase3, 
         exampleCase4, exampleCase5, exampleCase6, exampleCase7 }