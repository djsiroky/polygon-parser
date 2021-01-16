import { parsePolygons } from './src/polygonParser'
import { examplesList, ExampleData } from './data/examples'

let select = document.querySelector('select#examples') as HTMLSelectElement
let selectOptions = examplesList.map((_item, idx) => {
    let e = document.createElement('option')
    e.value = `${idx}`
    e.text = `Test Case ${idx + 1}`
    return e
})
select?.append(...selectOptions)

select?.addEventListener('change', (event) => {
    clearSvg()
    let newIdx = select.options.selectedIndex
    run(examplesList[newIdx])
  });


function clearSvg() {
    let facesG = document.querySelector('g#faces')
    let edgesG = document.querySelector('g#edges')
    let pointsG = document.querySelector('g#points')
    let groups = [facesG, edgesG, pointsG]
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
    let [vertices, edges, faces] = parsePolygons(data)

    faces.forEach((face, idx) => {
        let hue = (360 / faces.length) * idx
        face.draw(hue)
    })

    edges.forEach(edge => edge.draw())
    vertices.forEach(v => v.draw())

    let jsonContent = document.querySelector('#jsonOutput') as Element
    let jsonVertices = vertices.map(v => ({ index: v.index, X: v.X, Y: v.Y}))
    let jsonEdges = edges.map(e => ({ id: e.id, start: e.start.index, end: e.end.index}))
    let jsonFaces = faces.map(f => ({ id: f.id, points: f.points.map(pt => pt.index)}))
    jsonContent.innerHTML = JSON.stringify({
        vertices: jsonVertices,
        edges: jsonEdges,
        faces: jsonFaces
    }, undefined, 2)
}

run(examplesList[examplesList.length - 1])