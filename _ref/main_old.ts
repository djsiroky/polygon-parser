class Edge {
    public start: Point2d
    public end: Point2d

    constructor(start: Point2d, end: Point2d) {
        this.start = start
        this.end = end
    }

    public draw() {
        // const svgLine = `<line x1="${this.start.X}" y1="${this.start.Y}" x2="${this.end.X}" y2="${this.end.Y}" />`
        if (document === undefined) {
            return
        }
        let edge = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        edge.setAttribute('x1', `${this.start.X}`)
        edge.setAttribute('y1', `${this.start.Y}`)
        edge.setAttribute('x2', `${this.end.X}`)
        edge.setAttribute('y2', `${this.end.Y}`)
        edge.setAttribute('stroke-width', '0.05')
        edge.setAttribute('stroke', 'black')
        document.querySelector('g#edges')?.appendChild(edge)
    }
}

class Point2d {
    public X: number
    public Y: number

    constructor(x: number, y: number) {
        this.X = x
        this.Y = y
    }

    draw(index?: number) {
        if (document === undefined) {
            return
        }
        // const svgPoint = `<circle cx="${this.X}" cy="${this.Y}" r="0.1" fill="black" />`
        let point = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        point.setAttribute('cx', `${this.X}`)
        point.setAttribute('cy', `${this.Y}`)
        point.setAttribute('r', '0.1')
        point.setAttribute('fill', 'black')
        document.querySelector('g#points')?.appendChild(point)
        if (index !== undefined) {
            let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
            text.setAttribute('x', `${(this.X - 0.5)}`)
            text.setAttribute('y', `${this.Y}`)
            text.textContent = `${index}`
            document.querySelector('g#points')?.appendChild(text)
        }
    }
}

class Polygon {
    private points: Point2d[]

    constructor(points: Point2d[]) {
        this.points = points
    }

    draw(hue: number) {
        if (document === undefined) {
            return
        }
        let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        const pointsString = this.points.map(pt => `${pt.X},${pt.Y}`).join(' ')
        polygon.setAttribute('points', pointsString)
        polygon.setAttribute('fill', `hsl(${hue}, 100%, 50%, 0.5)`)
        document.querySelector('g#faces')?.appendChild(polygon)
    }
}

interface ExampleData {
    vertices: number[][]
    edges: number[][]
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

let { vertices, edges } = exampleData2
edges = edges.sort((a, b) => Math.random() - 0.5)

const pts = vertices.map(vertex => new Point2d(vertex[0], vertex[1]))
edges.map(edge => {
    let startPt = pts[edge[0]]
    let endPt = pts[edge[1]]
    let e = new Edge(startPt, endPt)
    e.draw()
})
pts.map((pt, idx) => pt.draw(idx))
// Starting at the first vertex
// Take first vertex
// 0
// Breadth-first traversal
// edges.filter()
// 0 -> [1, 2, 3]

function findConnectedVertices(vertexIndex: number, edges: number[][]): number[] {
    // Filter edges to only include edges starting / ending at target vertex
    let connections = edges.filter(edge => edge.includes(vertexIndex))
    // Remove vertexIndex from each edge array and return flattened array
    const neighborVertices: number[] = []
    connections.forEach(connection => {
        let match = connection.find(idx => idx !== vertexIndex)
        if (match !== undefined) {
            neighborVertices.push(match)
        }
    })
    return neighborVertices
}

function depthFirstTraversal(startIndex: number, edges: number[][]): number[] {
    let stack: number[] = [startIndex]
    let visited: number[] = []
    while (stack.length > 0) {
        let v = stack.pop() as number
        if (!visited.includes(v)) {
            visited.push(v)
            let neighbors = findConnectedVertices(v, edges)
            neighbors = neighbors.filter(n => !(visited.includes(n)))
            // If we can create a cycle back to the start vertex
            if (visited.length > 1 && neighbors.includes(startIndex)) {
                return visited
            }
            stack.push(...neighbors)
        }
    }
    return visited
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

function findInteriorEdge(cycle: number[], edges: number[][]) {
    let cycleEdges = sortEdgeVertices(edgesFromCycle(cycle))
    return sortEdgeVertices(edges)
        .filter(edge => cycleEdges.findIndex(cycleEdge => cycleEdge[0] === edge[0] && cycleEdge[1] === edge[1]) === -1)
        .filter(edge => cycle.includes(edge[0]) && cycle.includes(edge[1]))
}

function splitCycleByInteriorEdge(cycle: number[], intEdge: number[]) {
    let [startIdx, endIdx] = intEdge.map(v => cycle.indexOf(v)).sort()
    let cycle1 = cycle.slice(startIdx, endIdx + 1)
    let cycle2 = cycle.slice(endIdx).concat(cycle.slice(0, startIdx + 1))
    return [cycle1, cycle2]
}

function farthestDistance(startIdx: number, endOptions: number[]) {
    let options = [...endOptions]
    console.log(startIdx, options)
    let queue = findConnectedVertices(startIdx, edges)
    let visited = [startIdx]
    while (queue.length > 0) {
        let v = queue.shift() as number
        if (endOptions.includes(v)) {
            console.log(`Found ${v}`)
            options = options.filter(option => option !== v)
            console.log(options)
            if (options.length === 1) {
                return options[0]
            }
        }
        let neighbors = findConnectedVertices(v, edges).filter(n => !visited.includes(n))
        queue.push(...neighbors)
        visited.push(...neighbors)
    }
    return null

}

function checkPolygonEdges(vertices: number[]) {
    let a = [...vertices]
    let lastItem = vertices[vertices.length - 1]
    let b = [lastItem, ...vertices]
    let polygonEdges: number[][] = a.map((start, i) => [start, b[i] as number])
    polygonEdges = sortEdgeVertices(polygonEdges)
    edges = sortEdgeVertices([...edges])
    let notEdges = polygonEdges.filter(pe => {
        return !(edges.some(e => {
                return (e[0] === pe[0]) && (e[1] === pe[1]) }))
    })
    if (notEdges.length === 0) {
        return vertices
    }
    notEdges.map(notEdge => {
        let midNodes = getCommonNeighbors(notEdge[0], notEdge[1])
        if (midNodes.length === 1) {
            return vertices.splice(vertices.indexOf(notEdge[0]), 0, midNodes[0])
        }
    })
}


function getCommonNeighbors(firstNode: number, secondNode: number) {
    let firstNodeNeighbors = findConnectedVertices(firstNode, edges)
    let secondNodeNeighbors = findConnectedVertices(secondNode, edges)
    return firstNodeNeighbors.filter(n => secondNodeNeighbors.includes(n))
}

function firstVersion() {
    const traversalPath: number[] = []
    // Get a node with only 2 edges [1]
    // let start = vertices.findIndex((vertex, idx) => {
    //     let a = findConnectedVertices(idx, edges)
    //     return a.length == 2
    // })
    let minEdges = 9999
    let start = 0
    vertices.forEach((vertex, idx) => {
        let edgeCount = findConnectedVertices(idx, edges).length
        if (edgeCount < minEdges) {
            start = idx
            minEdges = edgeCount
        }
    })
    if (start === -1) {
        start = 1
        traversalPath.push(start)
        let [first, ...rest] = findConnectedVertices(start, edges)
        traversalPath.unshift(first)
        let second  = farthestDistance(first, rest)
        if (second !== null) {
            traversalPath.push(second)
        } else {
            traversalPath.push(rest[0])
        }
    } else {
        traversalPath.push(start)
        let [first, second] = findConnectedVertices(start, edges)
        traversalPath.unshift(first)
        traversalPath.push(second)
    }
    // Extend both sides to only option [0, 1, 2]
    while (traversalPath.length < vertices.length) {
        console.log('Current Path', traversalPath)
        // Extend to nodes not in traversal path && different between 2 ends
        let first, second
        let end1 = traversalPath[0]
        let end2 = traversalPath[traversalPath.length - 1]
        let n1 = findConnectedVertices(end1, edges)
        let n2 = findConnectedVertices(end2, edges)
        if ((traversalPath.length === vertices.length - 1) && (n1.length === 1) && (n2.length === 2)) {
            if (n1[0] == n2[0]) {
                traversalPath.push(n1[0])
            }
            // Catch
        } else {
            n1 = n1.filter(item => !traversalPath.includes(item))
            if (n1.length === 1) {
                first = n1[0]
            }
            n2 = n2.filter(item => !traversalPath.includes(item))
            // if n1.length > 1 , pick the furthest (by edge count)
            let f1 = farthestDistance(end2, n1)
            if (f1 !== null) {
                first  = f1
            } else {
                first = n1[0]
            }
            console.log(`Going to draw | ${end1} => ${first} after checking dist from ${end2}`)
            if (n1.length + n2.length === 1) {
                let lastVertex = n1.concat(n2)[0]
                if (lastVertex !== undefined) {
                    traversalPath.push(lastVertex)
                    break
                }
            }
            let f2 = farthestDistance(end1, n2)
            if (f2 !== null) {
                second  = f2
            } else {
                second = n2[0]
            }
            console.log(`Going to draw | ${end2} => ${second} after checking dist from ${end1}`)
            console.log(first, second)
            if (first !== undefined) {
                traversalPath.unshift(first)
            }
            if (second !== undefined && second !== -1) {
                traversalPath.push(second)
            }
        }
    }
    if (traversalPath[0] === traversalPath[traversalPath.length - 1]) {
        traversalPath.pop()
    }
    console.log('Current Path', traversalPath)
    return traversalPath
}

function versionTwo() {
    const traversalPath: number[] = []
    // Get a node with only 2 edges [1]
    let maxEdges = 0
    let start = 0
    vertices.forEach((vertex, idx) => {
        let edgeCount = findConnectedVertices(idx, edges).length
        if (edgeCount > maxEdges) {
            start = idx
            maxEdges = edgeCount
        }
    })
    let neighbors = findConnectedVertices(start, edges)
    let faces = neighbors.map(n => [start, n])
    // neighbors.map(n => )
}

const traversalPath = firstVersion()

// traversalPath
const POLYGONS = []
const cyclesToCheck = [traversalPath]
while (cyclesToCheck.length > 0) {
    let c = cyclesToCheck.pop() as number[]
    let interiorEdges = findInteriorEdge(c, edges)
    if (interiorEdges.length > 0) {
        console.log(`Splitting cycle ${c} by ${interiorEdges[0]}`)
        let cycles = splitCycleByInteriorEdge(c, interiorEdges[0])
        cyclesToCheck.push(...cycles)
    } else {
        checkPolygonEdges(c)
        POLYGONS.push(c)
    }
}
console.log(POLYGONS)

POLYGONS.forEach((polygon, idx) => {
    let polygonPoints = polygon.map(index => pts[index])
    let p = new Polygon(polygonPoints)
    let hue = (360 / POLYGONS.length) * idx
    p.draw(hue)
})

