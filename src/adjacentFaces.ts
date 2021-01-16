import { Polygon } from "./Polygon"
import { Edge } from "./Edge"

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