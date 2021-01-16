import { Vertex } from "./Vertex"

export class Edge {
    public start: Vertex
    public end: Vertex

    constructor(start: Vertex, end: Vertex) {
        this.start = start
        this.end = end
    }

    public get id(): string {
        if (this.start.index < this.end.index) {
            return `${this.start.index}_${this.end.index}`
        } else {
            return `${this.end.index}_${this.start.index}`
        }
    }

    public draw(): void {
        if (typeof document === 'undefined') {
            return
        } 
        const  edge = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        edge.setAttribute('x1', `${this.start.X}`)
        edge.setAttribute('y1', `${this.start.Y}`)
        edge.setAttribute('x2', `${this.end.X}`)
        edge.setAttribute('y2', `${this.end.Y}`)
        edge.setAttribute('stroke-width', '0.05')
        edge.setAttribute('stroke', 'black')
        document.querySelector('g#edges')?.appendChild(edge)
    }

}