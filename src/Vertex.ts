class Vertex {
    public X: number
    public Y: number
    public index: number
    public neighbors: number[] = []

    constructor(index: number, x: number, y: number) {
        this.index = index
        this.X = x
        this.Y = y
    }

    findNeighborVertices(edges: number[][]) {
        // Filter edges to only include edges starting / ending at target vertex
        let connections = edges.filter(edge => edge.includes(this.index))
        // Remove vertexIndex from each edge array and return flattened array
        const neighborVertices: number[] = []
        connections.forEach(connection => {
            let match = connection.find(idx => idx !== this.index)
            if (match !== undefined) {
                neighborVertices.push(match)
            }
        })
        this.neighbors = neighborVertices
    }

    draw(index?: number) {
        if (typeof document === 'undefined') {
            return
        } 
        // const svgPoint = `<circle cx="${this.X}" cy="${this.Y}" r="0.1" fill="black" />`
        let point = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        point.setAttribute('cx', `${this.X}`)
        point.setAttribute('cy', `${this.Y}`)
        point.setAttribute('r', '0.1')
        point.setAttribute('fill', 'black')
        document.querySelector('g#points')?.appendChild(point)
        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.setAttribute('x', `${(this.X - 0.5)}`)
        text.setAttribute('y', `${this.Y}`)
        text.textContent = index !== undefined ? `${index}` : `${this.index}`
        document.querySelector('g#points')?.appendChild(text)
    }
}

export { Vertex }