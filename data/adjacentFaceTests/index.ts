interface FaceData {
    vertices: Array<{
        index: number
        X: number
        Y: number
    }>,
    edges: Array<{
        id: string
        start: number
        end: number
    }>,
    faces: Array<{
        id: string
        points: number[]
    }>
}

/**
 *  Simple example given in brief. Rectangle with diagonal interior edge 
 */
import exampleCase from './exampleCase.json'

/**
 *  Polygon with more faces and interior edges
 */
import exampleCase2 from './exampleCase2.json'

/**
 *  Concave polygon. This case prevents any sort of convex hull method
 *  to get the perimeter of overall shape.
 */
import exampleCase3 from './exampleCase3.json'

/**
 *  Concave polygon with non-triangular shape
 */
import exampleCase4 from './exampleCase4.json'

/**
 *  Concave polygon with non-triangular shape and a vertex not found on the perimeter of the overall shape
 */
import exampleCase5 from './exampleCase5.json'

/**
 *  Polygon with an interior point and several nodes with the same number of neighbors 
 */
import exampleCase6 from './exampleCase6.json'

/**
 *  Polygon with all nodes having the same number of neighbors. The algorithm should be
 *  able to handle a set of nodes, where from a graph perspective, every point looks the same
 */
import exampleCase7 from './exampleCase7.json'

const examplesList = [
    exampleCase,
    exampleCase2,
    exampleCase3,
    exampleCase4,
    exampleCase5,
    exampleCase6,
    exampleCase7,
]


export { FaceData, examplesList }