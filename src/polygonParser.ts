import { Vertex } from './Vertex'
import { Polygon } from './Polygon'
import { Edge } from './Edge'
import { ExampleData } from '../data/polygonParserTests'
import { processCliArgsPolygonParser } from './nodeCli'

/**
 * Returns any edges where both start + end vertices
 * are both part of the cycle param 
 * 
 * Computational Complexity: O(n^2)  
 * 
 * @param cycle - the cycle to check for interior edges
 * @param edges - all edges of the shape
 */
function findInteriorEdge(cycle: number[], edges: number[][]): number[][] {
    const cycleEdges = sortEdgeVertices(edgesFromCycle(cycle)) // O(n)
    return sortEdgeVertices(edges)
        .filter(edge => cycleEdges.findIndex(cycleEdge => cycleEdge[0] === edge[0] && cycleEdge[1] === edge[1]) === -1) // O(n^2)
        .filter(edge => cycle.includes(edge[0]) && cycle.includes(edge[1])) // O(n^2)
}

/**
 * Splits a cycle into 2, each starting + ending with the
 * start + end of interior edge
 * 
 * Computational Complexity: O(n^2)  
 * 
 * @param cycle - the cycle to split with the interior edge
 * @param intEdge - the interior edge to split the cycle with
 */
function splitCycleByInteriorEdge(cycle: number[], intEdge: number[]): [number[], number[]] {
    const [startIdx, endIdx] = intEdge.map(v => cycle.indexOf(v)).sort((a, b) => a - b) // O(n^2)
    const cycle1 = cycle.slice(startIdx, endIdx + 1) // O(n)
    const cycle2 = cycle.slice(endIdx).concat(cycle.slice(0, startIdx + 1)) // O(n)
    return [cycle1, cycle2]
}

/**
 * Sorts each edge so the smaller index is always first
 * 
 * Computational Complexity: O(n)  
 * 
 * @param edges 
 */
function sortEdgeVertices(edges: number[][]) {
    return edges.map(edge => edge[0] > edge[1] ? edge.reverse() : edge)
}

/**
 * Given the vertices of a cycle, return all the edges
 * connecting the vertices. Example:
 * [0, 1, 2]  => [[0, 1], [1, 2], [2, 0]]
 * 
 * Computational Complexity: O(n)  
 * 
 * @param cycle - path of vertices in a cycle
 */
function edgesFromCycle(cycle: number[]) {
    const edges = cycle.map((vertex, index) => {
        const i = index + 1 === cycle.length ? 0 : index + 1
        return [vertex, cycle[i]]
    })
    return edges
}

/**
 * Returns the vertex with the fewest neighbors / edges connecting to it 
 * 
 * Computational Complexity: O(n)  
 * 
 * @param nodesToCheck  - vertices to check for connections
 */
function findNodeWithFewestConnections(nodesToCheck: Vertex[]): Vertex {
    let fewestConnectionsNode = nodesToCheck[0]
    let minNeighbors = fewestConnectionsNode.neighbors.length
    nodesToCheck.forEach(node => {
        if (node.neighbors.length < minNeighbors) {
            fewestConnectionsNode = node
            minNeighbors = node.neighbors.length
        }
    })
    return fewestConnectionsNode
}

/**
 * Uses breadth-first traversal to find the options with the
 * longest path between the startIdx node and any of the endOptions 
 * 
 * Computational Complexity: O(n * m)  
 * 
 * @param startIdx - index to start at
 * @param endOptions - options to end at 
 * @param nodes - all nodes in the graph
 */
function farthestDistance(startIdx: number, endOptions: number[], nodes: Vertex[]): number | null {
    let options = [...endOptions]
    const queue = nodes[startIdx].neighbors
    const visited = [startIdx]
    while (queue.length > 0) {
        const v = queue.shift() as number
        if (endOptions.includes(v)) { // O(n)
            options = options.filter(option => option !== v) // O(n)
            if (options.length === 1) {
                return options[0]
            }
        }
        const neighbors = nodes[v].neighbors.filter(n => !visited.includes(n))  // O(m * n)
        queue.push(...neighbors)
        visited.push(...neighbors)
    }
    return null
}

/**
 *  Given a start node, traverses the graph by using the heuristic 
 *  of picking the neighbor with the fewest neighbors, implying it 
 *  is more likely a perimeter node.
 * 
 * Computational Complexity: O(n^2 + n * m)  
 * 
 * @param startNode the vertex to start with
 * @param nodes all vertices in the graph, with neighbors as a property
 */
function findCycleByNeighborCount(startNode: Vertex, nodes: Vertex[]) {
    const visited: number[] = []
    const traversalPath = [startNode.index]

    // Go to the neighbor with the fewest edges connecting to it
    const nextNodeOptions = startNode.neighbors.filter(n => n !== startNode.index)  // O(n)
    let nextNode = findNodeWithFewestConnections(nextNodeOptions.map(n => nodes[n])) // O(n)
    let nextNodeIdx = nextNode.index
    // Repeat until you reach start node
    while (nextNode.index !== startNode.index) {
        visited.push(nextNode.index)
        traversalPath.push(nextNode.index)
        let nextNodeOptions = nextNode.neighbors
            .filter(n => !visited.includes(n)) // O(n * m)
        if (nextNodeOptions.length === 1) {
            nextNodeIdx = nextNodeOptions[0]
        } else {
            nextNodeOptions = nextNodeOptions
                .filter(n => visited.length < 4 ? n !== startNode.index : true)  // O(n)
            nextNodeOptions = nextNodeOptions.filter(n => {
                return nodes[n].neighbors.length === Math.min(...nextNodeOptions.map(x => nodes[x].neighbors.length)) // O(n^2)
            })
            if (nextNodeOptions.length === 1) {
                nextNodeIdx = nextNodeOptions[0]
            } else {
                // Find node thats further from start, unless one is start
                if (nextNodeOptions.includes(startNode.index)) {  // O(n)
                    nextNodeIdx = startNode.index
                } else {
                    nextNodeIdx = farthestDistance(startNode.index, nextNodeOptions, nodes) as number // O(n * m)
                }
            }
        }
        nextNode = nodes[nextNodeIdx]
    }
    return traversalPath
}

/**
 * Attempts to find a cycle using the pointLineTest as a 
 * heuristic, choosing the "most inward" (closest to 0, but
 * not 0) of possible neighbors.
 * 
 * Computational Complexity: O(n * m)  
 * 
 * @param edge - unused edge that will be the start/end of the cycle
 * @param edges - all edges in the graph
 * @param nodes  - all nodes in the graph
 * @param edgeCounts - object of current edge counts to remove options connected with a 2x used edge
 */
function findCycleByPointLineTest(edge: number[], edges: number[][], nodes: Vertex[], edgeCounts: {[index: string]: number}) {
        const newCycle: number[] = []
        const startNodeIdx = edge[0]
        const startNode = nodes[startNodeIdx]
        newCycle.push(startNodeIdx)
        const endNode = nodes[edge[1]]
        let currentNode = newCycle[newCycle.length - 1]
        let directionToFocus = null
        let nextOpts: number[]
        while (newCycle[newCycle.length - 1] != endNode.index) {
            try {
                if (newCycle.length == 1) {
                    // For first pass, filter out the endNode as an option so we don't return [startNode => endNode]
                    nextOpts = nodes[currentNode].neighbors.filter(x => x !== edge[1] && !newCycle.includes(x))
                        .filter(x => edgeCounts[[currentNode, x].sort((a, b) => a - b).join('_')] < 2) // O(n * m)
                } else {
                    // For subsequent pass, filter out the startNode as an option
                    nextOpts = nodes[currentNode].neighbors.filter(x => x !== edge[0] && !newCycle.includes(x)) 
                        .filter(x => edgeCounts[[currentNode, x].sort((a, b) => a - b).join('_')] < 2) // O(n * m)
                }
                let edgeToTest = [[endNode.X, endNode.Y], [startNode.X, startNode.Y]] 
                if (newCycle.length > 1) {
                    const prevNode = newCycle[newCycle.length - 2]
                    edgeToTest = [[nodes[prevNode].X, nodes[prevNode].Y], [nodes[currentNode].X, nodes[currentNode].Y]]
                }
                // If endNode is an option, pick that
                if (nextOpts.includes(edge[1])) { // O(n)
                    currentNode = edge[1]
                // If only one option, pick that one
                } else if (nextOpts.length === 1) {
                    currentNode = nextOpts[0]
                } else {
                    // Otherwise, use pointLIneTest as heuristic
                    let ds = nextOpts.map(opt => (pointLineTest(nodes[opt], edgeToTest))).filter(d => d !== 0) // O(n)
                    const dObj: {[index: number]: number} = {}
                    ds.forEach((d, i) => dObj[nextOpts[i]] = d)  // O(n)
                    let idx = ds.indexOf(Math.min(...ds))
                    if (ds.map(d => d / Math.abs(d)).every(v => v === 1)) { // O(n)
                        directionToFocus = 1
                    } else if (ds.map(d => d / Math.abs(d)).every(v => v === -1)) { // O(n)
                        directionToFocus = -1
                    }
                    if (directionToFocus == -1) {
                        nextOpts = nextOpts.filter((opt, id) => ds[id] < 0) // O(n)
                        ds = ds.filter(d => d < 0) // O(n)
                        idx = ds.indexOf(Math.max(...ds)) // O(n)
                    }
                    if (directionToFocus == 1) {
                        nextOpts = nextOpts.filter((opt, id) => ds[id] > 0)  // O(n)
                        ds = ds.filter(d => d > 0)  // O(n)
                        idx = ds.indexOf(Math.min(...ds))  // O(n)
                    }
                    currentNode = nextOpts[idx]
                    if (idx === -1) {
                        return
                    }
                }
                newCycle.push(currentNode)
            } catch (e) {
                console.error(e)
                return
            }
        }
    return newCycle
}

/**
 * Tests all points in a pair of cycles and the splitting
 * interior edge to determine if splitting the cycle
 * would create an interior point
 * 
 * Computational Complexity: O(n)  
 * 
 * @param cycles  - potentially split cycles 
 * @param intEdge - edge that is splitting the cycle into two
 * @param nodes  - all nodes in the graph
 */
function pointInsideCycles(cycles: [number[], number[]], intEdge: number[], nodes: Vertex[]): boolean {
    let [cycle1, cycle2] = [...cycles]
    cycle1 = cycle1.slice(1, cycle1.length - 1)
    cycle2 = cycle2.slice(1, cycle2.length - 1)
    const edgeStart = nodes[intEdge[0]]
    const edgeEnd = nodes[intEdge[1]]
    const edge = [[edgeStart.X, edgeStart.Y], [edgeEnd.X, edgeEnd.Y]]
    const r1 = cycle1.map(x => {
        const d = pointLineTest(nodes[x], edge) // O(1)
        if (d > 0) {
            return 1
        } else if (d < 0) {
            return -1
        }
        return 0
    }) // O(n)
    const r2 = cycle2.map(x => {
        const d = pointLineTest(nodes[x], edge)
        if (d > 0) {
            return 1
        } else if (d < 0) {
            return -1
        }
        return 0
    }) // O(n)
    if (r1[0] === r2[0] && r1.every(x => x === r1[0]) && r2.every(x => x === r2[0])) {  // O(n)
        return true
    }
    return false
}

/**
 * Returns 0 if a point is on an edge, a negative number if point is
 * on one side of an edge, a positve number of on the other side 
 * 
 * @see https://math.stackexchange.com/questions/274712/calculate-on-which-side-of-a-straight-line-is-a-given-point-located
 * 
 * Computational Complexity: O(1)  
 * 
 * @param point - point to test
 * @param edge  - edge to test against
 */
function pointLineTest(point: Vertex, edge: number[][]) {
    const x = point.X
    const y = point.Y
    const x1 = edge[0][0]
    const y1 = edge[0][1]
    const x2 = edge[1][0]
    const y2 = edge[1][1]
    const d = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)
    return d
}

/**
 * Shuffles a dataset (pseudo)randomly
 * 
 * Computational Complexity: O(n log(n))  
 * 
 * @param data any data in an array
 */
function shuffle(data: unknown[]) {
    return data.sort(() => Math.random() - 0.5)
}

/**
 * Returns an updated edgeCounts object based on edges from the cycle
 * that is added or removed. Used because edges can only be a part of
 * two faces in a 2D graph
 * 
 * Computational Complexity: O(n)  
 * 
 * @param cycle - Cycle to use to update the edge counts
 * @param edgeCounts - Object containing the edge counts, with edge ID as key
 * @param deleted - true if decrementing the edge count, false if incrementing (default false)
 */
function updateEdgeCounts(cycle: number[], edgeCounts: { [id: string]: number}, deleted = false) {
    cycle.forEach((node, idx) => { // O(n)
        let nextIdx = idx + 1
        if (nextIdx > cycle.length - 1) {
            nextIdx = 0
        }
        const edgeId = [node, cycle[nextIdx]].sort((a, b) => a - b).join('_') // O(2)
        if (deleted) {
            edgeCounts[edgeId] -= 1
        } else {
            edgeCounts[edgeId] += 1
        }
    })
    return edgeCounts
}

/**
 * Main function that takes in a list of vertices and a list of
 * edges (the indices of the start and end vertices) and returns
 * an array of closed faces or polygons
 * 
 * Estimated Computational Complexity: O(n^2)  
 * 
 * @param data - an object with keys vertices and edges
 */
function parsePolygons(data: ExampleData): Polygon[] { 
    const { edges, vertices } = data

    // Optional: Randomize order of edges so there isn't an ordering bias
    // edges = shuffle(edges)

    // Draw edges and vertices  O(v + e)
    const nodes: Vertex[] = vertices.map((vertex, idx) => new Vertex(idx, vertex[0], vertex[1])) // O(n)
    const edgeObjects: Edge[] = edges.map(edge => new Edge(nodes[edge[0]], nodes[edge[1]])) // O(n)

    // Initialize edgeCounts
    let edgeCounts: { [index: string ]: number } = {}
    edgeObjects.forEach(edge => {
        edgeCounts[edge.id] = 0
    })  // O(e)

    nodes.forEach((node) => { 
        node.findNeighborVertices(edges)
    }) // O(v)

    // Start with node with fewest neighbors
    const startNode = findNodeWithFewestConnections(nodes)  // O(n)

    // STEP 1
    // Traverse the nodes until a cycle is found,
    // using the fewest number of neighbors as 
    // the target/heuristic. Ideally, this will be
    // the perimeter of the input shape, but there are
    // checks if this is not the case.
    const traversalPath = findCycleByNeighborCount(startNode, nodes)  // O(n^2 + n * m)

    // STEP 2
    // Check the found cycle for interior edges
    // If found, split the cycle by the interior edge
    // Repeat until no further edges are found
    const faceCycles: number[][] = []
    const cyclesToCheck: number[][] = [traversalPath]

    while (cyclesToCheck.length > 0) {
        const c = cyclesToCheck.pop() as number[]
        const interiorEdges = findInteriorEdge(c, edges) // O(n^2)
        if (interiorEdges.length > 0) {
            const cycles = splitCycleByInteriorEdge(c, interiorEdges[0])  // O(n^2)
            if (pointInsideCycles(cycles, interiorEdges[0], nodes)) {  // O(n)
                edgeCounts = updateEdgeCounts(c, edgeCounts)  // O(n)
                faceCycles.push(c)
            } else {
                cyclesToCheck.push(...cycles)
            }
        } else {
            edgeCounts = updateEdgeCounts(c, edgeCounts) // O(n)
            faceCycles.push(c)
        }
    }

    // STEP 3
    // Any remaining nodes are interior. To find which cycle they're a part of, 
    // find the neighbor of the node and find which cycle has all neighbors in it
    const usedNodes: number[] = []
    const usedNodesSet = new Set(usedNodes.concat(...faceCycles).sort((a, b) => a - b)) // O(n log n)
    
    const interiorNodes = nodes.map(n => n.index).filter(n => !usedNodesSet.has(n)) // O(n)
    interiorNodes.forEach(intNodeIdx => {
        // Try and find the cycle that contains the interior node
        const containingCycleIdx = faceCycles.findIndex(polygon => nodes[intNodeIdx].neighbors.every(pt => polygon.includes(pt) ))
        if (containingCycleIdx !== -1) {
            // If found, split the cycle by a path that goes through the interior node
            const containingCycle = faceCycles[containingCycleIdx]
            const deletedCycle = faceCycles.splice(containingCycleIdx, 1)
            edgeCounts = updateEdgeCounts(deletedCycle[0], edgeCounts, true) // O(n)
            const neighbors = nodes[intNodeIdx].neighbors
            const firstN = neighbors[0]
            const secondN = neighbors[Math.floor(neighbors.length / 2)]
            const cycles = splitCycleByInteriorEdge(containingCycle, [firstN, secondN]) // O(n^2)
            cycles.forEach(cycle => {
                // Try to find connection 
                if (cycle.indexOf(firstN) !== cycle.length - 1) {  // O(n)
                    cycle.splice(cycle.indexOf(firstN), 0, intNodeIdx) // O(n)
                } else {
                    cycle.push(intNodeIdx)
                }
                cyclesToCheck.push(cycle)
            })  // O(n^2)

        }
    })
    
    // STEP 4
    // If checking interior nodes generated any new 
    // cycles, check those for interior edges and 
    // split by the interior edge
    while (cyclesToCheck.length > 0) {
        const c = cyclesToCheck.pop() as number[]
        const interiorEdges = findInteriorEdge(c, edges)  // O(n^2)
        if (interiorEdges.length > 0) {
            const cycles = splitCycleByInteriorEdge(c, interiorEdges[0])  // O(n^2)
            cyclesToCheck.push(...cycles)
        } else {
            edgeCounts = updateEdgeCounts(c, edgeCounts) // O(n)
            faceCycles.push(c)
        }
    }

    // STEP 5
    // Finally, check for any unused edges. Typically, this
    // occurs when there's no topological difference between
    // two interior edges and one is not picked up. 
    // See exampleCase7 for an example of this
    const unusedEdgeIds = Object.keys(edgeCounts).filter(key => edgeCounts[key] === 0) // O(n)
    const unusedEdges = unusedEdgeIds.map(s => s.split('_').map(x => parseInt(x)))  // O(n * m)

    unusedEdges.forEach(edge => {
        // Try to find a cycle 
        // If we run out of options, return undefined
        const edgeObj = new Edge(nodes[edge[0]], nodes[edge[1]])
        if (edgeCounts[edgeObj.id] !== 0) {
            return
        }
        const newCycle = findCycleByPointLineTest(edge, edges, nodes, edgeCounts) // O(n * m)

        // If success, add new edge to faceCycles
        if (newCycle !== undefined) {
            faceCycles.push(newCycle)
            edgeCounts = updateEdgeCounts(newCycle, edgeCounts) // O(n)
        } else {
            // If fail, check for an interior edge
            faceCycles.forEach((c, i, arr) => {
                const iE = findInteriorEdge(c ,edges) // O(n^2)
                const iEIds = iE.map(e => e.sort((a, b) => a -b).join('_')) // O(n^2)
                if (iEIds.includes(edgeObj.id)) {
                    const [cycle1, cycle2] = splitCycleByInteriorEdge(c , edge) // O(n^2)
                    arr[i] = cycle1
                    edgeCounts = updateEdgeCounts(c, edgeCounts, true) // O(n)
                    edgeCounts = updateEdgeCounts(cycle1, edgeCounts)  // O(n)
                    faceCycles.push(cycle2)
                    edgeCounts = updateEdgeCounts(cycle2, edgeCounts)  // O(n)
                    return
                }
            })
        }
    })

    // STEP 6
    // Generate Polygons from each cycle and return
    const faces: Polygon[] = faceCycles.map((polygon, idx) => {
        const polygonPoints = polygon.map(index => nodes[index])
        return new Polygon(polygonPoints, idx)
    }) // O(n * m)
    return faces
}


if (typeof require !== 'undefined' && require.main === module) {
    const data = processCliArgsPolygonParser()
    if (data !== null) {
        const vertices = data.vertices.map((v, idx) => new Vertex(idx, v[0], v[1]))
        const edges = data.edges.map((e) => new Edge(vertices[e[0]], vertices[e[1]]))
        const jsonVertices = vertices.map(v => ({ index: v.index, X: v.X, Y: v.Y}))
        const jsonEdges = edges.map(e => ({ id: e.id, start: e.start.index, end: e.end.index}))
        const faces = parsePolygons(data)
        const jsonFaces = faces.map(f => ({ id: f.id, points: f.points.map(pt => pt.index)}))
        const output = {
            vertices: jsonVertices,
            edges: jsonEdges,
            faces: jsonFaces
        }
        console.log(JSON.stringify(output, undefined, 2))
    }
}

export { parsePolygons }
