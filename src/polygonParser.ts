import { Vertex } from './Vertex'
import { Polygon } from './Polygon'
import { Edge } from './Edge'
import { ExampleData } from '../data/examples'

function findInteriorEdge(cycle: number[], edges: number[][]) {
    let cycleEdges = sortEdgeVertices(edgesFromCycle(cycle))
    return sortEdgeVertices(edges)
        .filter(edge => cycleEdges.findIndex(cycleEdge => cycleEdge[0] === edge[0] && cycleEdge[1] === edge[1]) === -1)
        .filter(edge => cycle.includes(edge[0]) && cycle.includes(edge[1]))
}

function splitCycleByInteriorEdge(cycle: number[], intEdge: number[]) {
    let [startIdx, endIdx] = intEdge.map(v => cycle.indexOf(v)).sort((a, b) => a - b)
    let cycle1 = cycle.slice(startIdx, endIdx + 1)
    let cycle2 = cycle.slice(endIdx).concat(cycle.slice(0, startIdx + 1))
    return [cycle1, cycle2]
}

function sortEdgeVertices(edges: number[][]) {
    return edges.map(edge => edge[0] > edge[1] ? edge.reverse() : edge)
}

function edgesFromCycle(cycle: number[]) {
    let edges = cycle.map((vertex, index) => {
        let i = index + 1 === cycle.length ? 0 : index + 1
        return [vertex, cycle[i]]
    })
    return edges
}

function findNodeWithFewestConnections(nodesToCheck: Vertex[]) {
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

function farthestDistance(startIdx: number, endOptions: number[], nodes: Vertex[]) {
    let options = [...endOptions]
    // let queue = findNei(startIdx, edges)
    let queue = nodes[startIdx].neighbors
    let visited = [startIdx]
    while (queue.length > 0) {
        let v = queue.shift() as number
        if (endOptions.includes(v)) {
            options = options.filter(option => option !== v)
            if (options.length === 1) {
                return options[0]
            }
        }
        // let neighbors = findConnectedVertices(v, edges).filter(n => !visited.includes(n))
        let neighbors = nodes[v].neighbors.filter(n => !visited.includes(n))
        queue.push(...neighbors)
        visited.push(...neighbors)
    }
    return null
}

function shortestPath(startIdx: number, endOptions: number[], nodes: Vertex[]) {
    let path = [startIdx]
    let queue = nodes[startIdx].neighbors
    let visited = [startIdx]
    while (queue.length > 0) {
        let v = queue.shift() as number
        if (endOptions.includes(v)) {
            return v
        }
        let neighbors = nodes[v].neighbors.filter(n => !visited.includes(n))
        queue.push(...neighbors)
        visited.push(...neighbors)
    }
    return null
}

function findCycleByNeighborCount(startNode: Vertex, nodes: Vertex[]) {
    const visited: number[] = []
    const traversalPath = [startNode.index]

    // Go to the neighbor with the fewest edges connecting to it
    let nextNodeOptions = startNode.neighbors
        .filter(n => n !== startNode.index) 
    let nextNode = findNodeWithFewestConnections(nextNodeOptions.map(n => nodes[n]))
    let nextNodeIdx = nextNode.index
    // Repeat until you reach start node
    while (nextNode.index !== startNode.index) {
        visited.push(nextNode.index)
        traversalPath.push(nextNode.index)
        let nextNodeOptions = nextNode.neighbors
            .filter(n => !visited.includes(n))
        if (nextNodeOptions.length === 1) {
            nextNodeIdx = nextNodeOptions[0]
        } else {
            nextNodeOptions = nextNodeOptions
                .filter(n => visited.length < 4 ? n !== startNode.index : true)
            nextNodeOptions = nextNodeOptions.filter(n => {
                return nodes[n].neighbors.length === Math.min(...nextNodeOptions.map(x => nodes[x].neighbors.length))
            })
            if (nextNodeOptions.length === 1) {
                nextNodeIdx = nextNodeOptions[0]
            } else {
                // Find node thats further from start, unless one is start
                if (nextNodeOptions.includes(startNode.index)) {
                    nextNodeIdx = startNode.index
                } else {
                    nextNodeIdx = farthestDistance(startNode.index, nextNodeOptions, nodes) as number
                }
            }
        }
        nextNode = nodes[nextNodeIdx]
    }
    return traversalPath
}

function findCycleByPointLineTest(edge: number[], edges: number[][], nodes: Vertex[], edgeCounts: {[index: string]: number}) {
        const newCycle: number[] = []
        let startNodeIdx = edge[0]
        let startNode = nodes[startNodeIdx]
        newCycle.push(startNodeIdx)
        let endNode = nodes[edge[1]]
        let currentNode = newCycle[newCycle.length - 1]
        let directionToFocus = null
        while (newCycle[newCycle.length - 1] != endNode.index) {
            try {
                if (newCycle.length == 1) {
                    var nextOpts = nodes[currentNode].neighbors.filter(x => x !== edge[1] && !newCycle.includes(x))
                        .filter(x => edgeCounts[[currentNode, x].sort((a, b) => a - b).join('_')] < 2)
                } else {
                    nextOpts = nodes[currentNode].neighbors.filter(x => x !== edge[0] && !newCycle.includes(x)) 
                        .filter(x => edgeCounts[[currentNode, x].sort((a, b) => a - b).join('_')] < 2)
                }
                let edgeToTest = [[endNode.X, endNode.Y], [startNode.X, startNode.Y]] 
                if (newCycle.length > 1) {
                    let prevNode = newCycle[newCycle.length - 2]
                    edgeToTest = [[nodes[prevNode].X, nodes[prevNode].Y], [nodes[currentNode].X, nodes[currentNode].Y]]
                    nodes[currentNode].findNeighborVertices(edges)
                    nextOpts = nodes[currentNode].neighbors.filter(x => x !== edge[0] && !newCycle.includes(x))
                        .filter(x => edgeCounts[[currentNode, x].sort((a, b) => a - b).join('_')] < 2)
                }
                if (nextOpts.includes(edge[1])) {
                    currentNode = edge[1]
                } else if (nextOpts.length === 1) {
                    currentNode = nextOpts[0]
                } else {
                    let ds = nextOpts.map(opt => (pointLineTest(nodes[opt], edgeToTest))).filter(d => d !== 0)
                    let dObj: {[index: number]: number} = {}
                    ds.forEach((d, i) => dObj[nextOpts[i]] = d)
                    let idx = ds.indexOf(Math.min(...ds))
                    if (ds.map(d => d / Math.abs(d)).every(v => v === 1)) {
                        directionToFocus = 1
                    } else if (ds.map(d => d / Math.abs(d)).every(v => v === -1)) {
                        directionToFocus = -1
                    }
                    if (directionToFocus == -1) {
                        nextOpts = nextOpts.filter((opt, id) => ds[id] < 0)
                        ds = ds.filter(d => d < 0)
                        idx = ds.indexOf(Math.max(...ds))
                    }
                    if (directionToFocus == 1) {
                        nextOpts = nextOpts.filter((opt, id) => ds[id] > 0)
                        ds = ds.filter(d => d > 0)
                        idx = ds.indexOf(Math.min(...ds))
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

function pointInsideCycles(cycles: number[][], intEdge: number[], nodes: Vertex[]) {
    let [cycle1, cycle2] = [...cycles]
    cycle1 = cycle1.slice(1, cycle1.length - 1)
    cycle2 = cycle2.slice(1, cycle2.length - 1)
    let edgeStart = nodes[intEdge[0]]
    let edgeEnd = nodes[intEdge[1]]
    let edge = [[edgeStart.X, edgeStart.Y], [edgeEnd.X, edgeEnd.Y]]
    // TODO: Better implementation of this
    let r = cycle1.map(x => {
        let d = pointLineTest(nodes[x], edge)
        if (d > 0) {
            return 1
        } else if (d < 0) {
            return -1
        }
        return 0
    })
    let r1 = cycle2.map(x => {
        let d = pointLineTest(nodes[x], edge)
        if (d > 0) {
            return 1
        } else if (d < 0) {
            return -1
        }
        return 0
    })
    if (r[0] === r1[0]) {
        return true
    }
    return false
}

function pointLineTest(point: Vertex, edge: number[][]) {
    let x = point.X
    let y = point.Y
    let x1 = edge[0][0]
    let y1 = edge[0][1]
    let x2 = edge[1][0]
    let y2 = edge[1][1]
    let d = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1)
    return d
}

function shuffle(data: any[]) {
    return data.sort((_a, _b) => Math.random() - 0.5)
}

function updateEdgeCounts(c: number[], edgeCounts: { [id: string]: number}, deleted: boolean = false) {
    c.forEach((node, idx) => {
        let nextIdx = idx + 1
        if (nextIdx > c.length - 1) {
            nextIdx = 0
        }
        let edgeId = [node, c[nextIdx]].sort((a, b) => a - b).join('_')
        if (deleted) {
            edgeCounts[edgeId] -= 1
        } else {
            edgeCounts[edgeId] += 1
        }
    })
    return edgeCounts
}

function parsePolygons(data: ExampleData): [Vertex[], Edge[], Polygon[]] { 
    let { edges, vertices } = data

    // Randomize order of edges so there isn't an ordering bias
    edges = shuffle(edges)

    // Draw edges and vertices
    const nodes: Vertex[] = vertices.map((vertex, idx) => new Vertex(idx, vertex[0], vertex[1]))
    const edgeObjects: Edge[] = edges.map(edge => new Edge(nodes[edge[0]], nodes[edge[1]]))

    let edgeCounts: { [index: string ]: number } = {}

    edgeObjects.forEach(edge => {
        edgeCounts[edge.id] = 0
        edge.draw()
    })

    nodes.forEach((node, idx) => { 
        node.findNeighborVertices(edges)
        node.draw(idx)
    })

    // Start with node with fewest neighbors
    const startNode = findNodeWithFewestConnections(nodes)
    const traversalPath = findCycleByNeighborCount(startNode, nodes)
    const faceCycles: number[][] = []
    const cyclesToCheck: number[][] = [traversalPath]

    // Find all interior edges that start and end in perimeter
    while (cyclesToCheck.length > 0) {
        const c = cyclesToCheck.pop() as number[]
        const interiorEdges = findInteriorEdge(c, edges)
        if (interiorEdges.length > 0) {
            let cycles = splitCycleByInteriorEdge(c, interiorEdges[0])
            if (pointInsideCycles(cycles, interiorEdges[0], nodes)) {
                edgeCounts = updateEdgeCounts(c, edgeCounts)
                faceCycles.push(c)
            } else {
                cyclesToCheck.push(...cycles)
            }
        } else {
            edgeCounts = updateEdgeCounts(c, edgeCounts)
            faceCycles.push(c)
        }
    }

    let usedNodes: number[] = []
    let usedNodesSet = new Set(usedNodes.concat(...faceCycles).sort((a, b) => a - b))
    
    let interiorNodes = nodes.map(n => n.index).filter(n => !usedNodesSet.has(n))
    // Any remaining nodes are interior. To find which cycle they're a part of, 
    // find the neighbor of the node and find which cycle has all neighbors in it
    interiorNodes.forEach(intNodeIdx => {
        let containingCycleIdx = faceCycles.findIndex(polygon => nodes[intNodeIdx].neighbors.every(pt => polygon.includes(pt) ))
        if (containingCycleIdx !== -1) {
            let containingCycle = faceCycles[containingCycleIdx]
            let deletedCycle = faceCycles.splice(containingCycleIdx, 1)
            edgeCounts = updateEdgeCounts(deletedCycle[0], edgeCounts, true)
            // interior node -> containingCycle[0]
            let neighbors = nodes[intNodeIdx].neighbors
            let firstN = neighbors[0]
            let secondN = neighbors[Math.floor(neighbors.length / 2)]
            console.log(`Splitting cycle ${containingCycle} with ${[firstN, secondN]}`)
            let cycles = splitCycleByInteriorEdge(containingCycle, [firstN, secondN])
            cycles.forEach(cycle => {
                // Try to find connection 
                if (cycle.indexOf(firstN) !== cycle.length - 1) {
                    cycle.splice(cycle.indexOf(firstN), 0, intNodeIdx)
                } else {
                    cycle.push(intNodeIdx)
                }
                cyclesToCheck.push(cycle)
            })

            // continue cycle and check if containingCycle[i] exists
            // if so, add c to cycles, reset array, and repeat
            // if not, continue and repeat
        } else {
            // Reparse starting from missing node and already visited
        }
    })
    while (cyclesToCheck.length > 0) {
        let c = cyclesToCheck.pop() as number[]
        let interiorEdges = findInteriorEdge(c, edges)
        if (interiorEdges.length > 0) {
            console.log(`Splitting cycle ${c} by ${interiorEdges[0]}`)
            let cycles = splitCycleByInteriorEdge(c, interiorEdges[0])
            cyclesToCheck.push(...cycles)
        } else {
            edgeCounts = updateEdgeCounts(c, edgeCounts)
            faceCycles.push(c)
        }
    }

    let unusedEdgeIds = Object.keys(edgeCounts).filter(key => edgeCounts[key] === 0)
    let unusedEdges = unusedEdgeIds.map(s => s.split('_').map(x => parseInt(x)))

    unusedEdges.forEach(edge => {
        // Try to find a cycle 
        // If we run out of options, return undefined
        let edgeObj = new Edge(nodes[edge[0]], nodes[edge[1]])
        if (edgeCounts[edgeObj.id] !== 0) {
            return
        }
        let newCycle =  findCycleByPointLineTest(edge, edges, nodes, edgeCounts)

        // If success, add new edge to faceCycles
        if (newCycle !== undefined) {
            faceCycles.push(newCycle)
            edgeCounts = updateEdgeCounts(newCycle, edgeCounts)
        } else {
            // If fail, check for an interior edge
            faceCycles.forEach((c, i, arr) => {
                let iE = findInteriorEdge(c ,edges)
                let iEIds = iE.map(e => e.sort((a, b) => a -b).join('_'))
                if (iEIds.includes(edgeObj.id)) {
                    console.log(`Splitting cycle ${c} with ${[edge[0], edge[1]]}`)
                    let [cycle1, cycle2] = splitCycleByInteriorEdge(c , edge)
                    arr[i] = cycle1
                    edgeCounts = updateEdgeCounts(c, edgeCounts, true)
                    edgeCounts = updateEdgeCounts(cycle1, edgeCounts)
                    faceCycles.push(cycle2)
                    edgeCounts = updateEdgeCounts(cycle2, edgeCounts)
                    return
                }
            })
        }
    })

    const faces: Polygon[] = faceCycles.map((polygon, idx) => {
        let polygonPoints = polygon.map(index => nodes[index])
        return new Polygon(polygonPoints, idx)
    })

    return [nodes, edgeObjects, faces]
}

export { parsePolygons }


//Starting at node, go to one neighbor, continue in one direction on the containing cycle until you find another neighbor, then go back to the interior node to create a face. Repeat until all neighbors have been used as second point