import fs from 'fs'
import { isArray } from 'util';
import readline from 'readline'
import stream from 'stream'
import path from 'path'
import { countFileLines } from './src/utils.mjs';

// Arquivo de entrada
// const file = './databases/demo.xml'
const file = './databases/CETENFolha-1.0.xml'

// Pasta do Arquivo de saida
const output = './databases/saida.txt'

const testPercentage = 0.3

// remoções de texto
const removeStrings = [
    '«',
    '»',
    '<t>',
    '</t>',
    '<p>',
    '</p>',
    '<s>',
    '</s>',
    '<caixa>',
    '</caixa>',
    '<li>',
    '</li>',
    '<situacao>',
    '</situacao>', ,
    'us\\$ ',
    'r\\$ ',
    'cr\\$ ',
    ["%", ' porcento'],
    [" \\.", ' '],
    '\\-\\-',
]


/**
 * Parse Line
 *
 * @param {String} line
 * @returns {[String]}
 */
function sanitize(line) {
    line = line.toLowerCase()
    removeStrings
        .map(val => isArray(val) ? val : [val, ''])
        .forEach(([word, replace]) => line = line.replace(new RegExp(word, 'g'), replace))

    line = line.trim()
    let newLines = []
    if (!(line && !line.startsWith('<ext') && !line.startsWith('</ext') && !line.startsWith('<a')))
        return ''

    if (line.search(/\(/g) !== -1 && line.search(/\)/g) !== -1) {
        let [a, temp = ''] = line.split('(')
        let [c, b = ''] = temp.split(')')
        newLines.push(c.trim())
        line = a.trim() + ' ' + b.trim()
    }
    line = [line, ...newLines].filter(v => v && v.split(' ').length > 1).join("\n").trim()
    return line
}

function logProgress(progress) {
    process.stdout.write(`Done ${progress} lines...\r`);
}

async function main() {
    console.log(`Parsing '${file}' and writing in ${output} ...`)


    const readStream = fs.createReadStream(file)
    const writeSream = fs.createWriteStream(output)
    const outStream = new stream
    const lineReader = readline.createInterface(readStream, outStream)
    const begin = new Date()

    let readLines = 0
    
    lineReader.on('line', line => {
        let parsedLine = sanitize(line)
        if (!parsedLine)
            return
        writeSream.write((readLines ? "\n" : '') + parsedLine)
        readLines++
        logProgress(readLines)
    })

    lineReader.on('close', () => {
        writeSream.end()
        console.log(`Done! Script executed at ${(new Date() - begin) / 1000} seconds.`)
    })
}

main();