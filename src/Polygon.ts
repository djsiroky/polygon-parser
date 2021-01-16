import { Vertex } from './Vertex'

class Polygon {
    public points: Vertex[]
    private _index: number

    constructor(points: Vertex[], index: number) {
        this.points = points
        this._index = index
    }

    get id(): string {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const idx = this._index % alphabet.length 
        let id = alphabet[idx]
        const multiplier = Math.floor(this._index / alphabet.length)
        if (multiplier > 0 && multiplier < 26) {
            id = alphabet[multiplier - 1] + id
        }
        return id
    }

    private getAverageOfPoints(): [number, number] {
        const xAvg = this.points.reduce((prev, curr) => (prev + curr.X), 0) / this.points.length
        const yAvg = this.points.reduce((prev, curr) => (prev + curr.Y), 0) / this.points.length
        return [xAvg, yAvg]

    }

    draw(hue: number): void {
        if (typeof document === 'undefined') {
            return
        }
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        const pointsString = this.points.map(pt => `${pt.X},${pt.Y}`).join(' ')
        polygon.setAttribute('points', pointsString)
        polygon.setAttribute('fill', `hsl(${hue}, 100%, 50%, 0.5)`)
        document.querySelector('g#faces')?.appendChild(polygon)
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        const [centerX, centerY] = this.getAverageOfPoints()
        text.setAttribute('x', `${(centerX)}`)
        text.setAttribute('y', `${centerY}`)
        text.textContent = this.id
        document.querySelector('g#faces')?.appendChild(text)
    }
}

export { Polygon }