import { parsePolygons } from './src/polygonParser'
import { examplesList, ExampleData } from './data/examples'
import { Vertex } from './src/Vertex'
import { Edge } from './src/Edge'

const select = document.querySelector('select#examples') as HTMLSelectElement
const selectOptions = examplesList.map((_item, idx) => {
    const e = document.createElement('option')
    e.value = `${idx}`
    e.text = `Test Case ${idx + 1}`
    return e
})
select?.append(...selectOptions)

select?.addEventListener('change', () => {
    clearSvg()
    const newIdx = select.options.selectedIndex
    run(examplesList[newIdx])
  });


function clearSvg() {
    const facesG = document.querySelector('g#faces')
    const edgesG = document.querySelector('g#edges')
    const pointsG = document.querySelector('g#points')
    const groups = [facesG, edgesG, pointsG]
    groups.forEach(group => {
        if (group === null) {
            return
        }
        while(group.firstChild) {
            group.removeChild(group.lastChild as ChildNode)
        }
    })
}

function run(data: ExampleData) {
    const vertices = data.vertices.map((v, idx) => new Vertex(idx, v[0], v[1]))
    const edges = data.edges.map((e) => new Edge(vertices[e[0]], vertices[e[1]]))
    const faces = parsePolygons(data)

    faces.forEach((face, idx) => {
        const hue = (360 / faces.length) * idx
        face.draw(hue)
    })

    edges.forEach(edge => edge.draw())
    vertices.forEach(v => v.draw())

    const jsonContent = document.querySelector('#jsonOutput') as Element
    const jsonVertices = vertices.map(v => ({ index: v.index, X: v.X, Y: v.Y}))
    const jsonEdges = edges.map(e => ({ id: e.id, start: e.start.index, end: e.end.index}))
    const jsonFaces = faces.map(f => ({ id: f.id, points: f.points.map(pt => pt.index)}))
    jsonContent.innerHTML = JSON.stringify({
        vertices: jsonVertices,
        edges: jsonEdges,
        faces: jsonFaces
    }, undefined, 2)
}

run(examplesList[0])