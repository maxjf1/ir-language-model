import fs from 'fs'

export function countFileLines(filePath) {
    let lines = 1
    return new Promise(
        (resolve, reject) => fs.createReadStream(filePath)
            .on('data', chunk => {
                for (let i = 0; i < chunk.length; ++i)
                    if (chunk[i] == 10){
                        lines++;
                        console.log( lines)
                    }
                       
            })
            .on('end', () => resolve(lines))
            .on('error', error => reject(error))
    )
}

export async function generateTestsBases(base, percentage){
    const baseLength = await countFileLines(base)
    const testBase = parseInt(baseLength * percentage)
    const realBase = baseLength - testBase
    
    console.log(`Using ${testBase} as test base`)
}