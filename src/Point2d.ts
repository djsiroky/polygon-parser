export default class Point2d {
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