import { ExampleData, examplesList } from "../data/polygonParserTests"
import { examplesList as adjacentFaceExamples, FaceData } from "../data/adjacentFaceTests"
import path from 'path'
import fs from 'fs'

function processCliArgsPolygonParser(): ExampleData | null {
    const arg = process.argv[2]
    if (arg === undefined) {
        console.log('Please pass a file path or one of 1, 2, 3, 4, 5, 6, 7 or exampleCase<1-7>')
        return null
    }
    if (arg.endsWith('.json')) {
        const content = fs.readFileSync(path.join(process.cwd(), arg), 'utf8')
        try { 
            const data = JSON.parse(content)
            if (!('vertices' in data && 'edges' in data)) {
                console.error('JSON file did not containe both required keys "vertices" and "edges"')
                return null
            }
            return data as ExampleData
        } catch(e) {
            console.error('Unable to parse JSON file. ')
            return null
        }

    }
    const intOptions =  [1, 2, 3, 4, 5, 6, 7]
    const stringOptions = intOptions.map(int => `exampleCase${int}`)
    if (intOptions.includes(parseInt(arg))) {
        const i = intOptions.indexOf(parseInt(arg))
        return examplesList[i]
    }
    if (stringOptions.includes(arg)) {
        const i = stringOptions.indexOf(arg)
        return examplesList[i]
    }
    return null
}

function processCliArgsAdjacentFaces(): [FaceData, string] | null {
    const arg = process.argv[2]
    const faceID = process.argv[3]
    const faceIDRegex = new RegExp(/[A-Z]+/)
    if (!faceIDRegex.test(faceID)) {
        console.log('Face ID invalid. Should be A-Z or AA-ZZ')
        return null
    }
    if (arg === undefined) {
        console.log('Please pass a file path or one of 1, 2, 3, 4, 5, 6, 7 or exampleCase<1-7>')
        return null
    }
    if (arg.endsWith('.json')) {
        const content = fs.readFileSync(path.join(process.cwd(), arg), 'utf8')
        try { 
            const data = JSON.parse(content)
            if (!('vertices' in data && 'faces' in data)) {
                console.error('JSON file did not containe both required keys "vertices" and "faces"')
                return null
            }
            return [data as FaceData, faceID]
        } catch(e) {
            console.error('Unable to parse JSON file. ')
            return null
        }

    }
    const intOptions =  [1, 2, 3, 4, 5, 6, 7]
    const stringOptions = intOptions.map(int => `exampleCase${int}`)
    if (intOptions.includes(parseInt(arg))) {
        const i = intOptions.indexOf(parseInt(arg))
        return [adjacentFaceExamples[i], faceID]
    }
    if (stringOptions.includes(arg)) {
        const i = stringOptions.indexOf(arg)
        return [adjacentFaceExamples[i], faceID]
    }
    return null
}

export { processCliArgsPolygonParser, processCliArgsAdjacentFaces }