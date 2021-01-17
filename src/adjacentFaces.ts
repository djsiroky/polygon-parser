import { Polygon } from "./Polygon"
import { Edge } from "./Edge"
import { Vertex } from "./Vertex"
import { processCliArgsAdjacentFaces } from "./nodeCli"
import { FaceData } from "../data/adjacentFaceTests"

/**
 *  Returns a list of adjacent faces to the face with the input id
 * 
 *  Computational Complexity: O(n * m^2)  
 * 
 *  @param faces - the array of all faces as closed polygons
 *  @param id - the id of the face to check for adjacent faces
 */
export function findAdjacentFaces(faces: Polygon[], id: string): Polygon[] {
    const inputFace = faces.find(face => face.id === id) // O(n)
    if (inputFace === undefined) {
        return []
    }
    const edgeCount = inputFace.points.length
    const inputFaceEdgeIds = inputFace.points.map((vertex, index) => {
        const i = index + 1 === edgeCount ? 0 : index + 1
        return new Edge(vertex, (inputFace as Polygon).points[i]).id
    }) // O(m)
    const facesToCheck = faces.filter(face => face.id !== id) // O(n)
    const adjacentFaces: Polygon[] = []
    facesToCheck.forEach(face => { // O(n - 1)
        face.points.forEach((vertex, index) => { // O(m)
            const i: number = index + 1 === face.points.length ? 0 : index + 1
            const edgeId = [vertex.index, face.points[i].index].sort((a, b) => a - b).join('_') // O(2)
            if (inputFaceEdgeIds.includes(edgeId)) { // O(m)
                adjacentFaces.push(face)
                return
            }
        })
    }) // O(n * m^2)
    return adjacentFaces
}

if (typeof require !== 'undefined' && require.main === module) {
    const data: [FaceData, string] | null = processCliArgsAdjacentFaces()
    if (data !== null) {
        const { vertices, faces } = data[0]
        if (faces.findIndex(face => face.id === data[1]) === -1) {
            console.log(`Face ID was not found in data. Face IDs are: [${faces.map(face => face.id)}]`)
        }
        const verts = vertices.map(vertex => new Vertex(vertex.index, vertex.X, vertex.Y))
        const polygons = faces.map((face, idx) => {
            const points = face.points.map(point => verts[point])
            return new Polygon(points, idx)
        })
        const adjacentFaces = findAdjacentFaces(polygons, data[1])
        console.log(`Adjacent Faces to ${data[1]}: [${adjacentFaces.map(f => f.id)}]`)
    }
}