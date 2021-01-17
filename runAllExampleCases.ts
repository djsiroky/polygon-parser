import { examplesList } from './data/polygonParserTests'
import { findAdjacentFaces } from './src/adjacentFaces'
import { parsePolygons } from './src/polygonParser'

examplesList.forEach((example, idx) => {
    console.log('='.repeat(20) + `TEST CASE ${idx + 1}` + '='.repeat(20))
    console.log(`[${idx + 1}] Vertices: [${example.vertices}]`)
    console.log(`[${idx + 1}] Edges: [${example.edges}]`)
    console.log(`[${idx + 1}] Finding Faces`)
    const faces = parsePolygons(example)
    faces.forEach(face => {
        console.log(`[${idx + 1}] Faces: ${face.id}: [${face.points.map(p => p.index)}]`)
    })
    faces.forEach(face => {
        const adjacentFaces = findAdjacentFaces(faces, face.id)
        console.log(`[${idx + 1}] Adjacent Faces to ${face.id}: [${adjacentFaces.map(f => f.id)}]`)
    })
})