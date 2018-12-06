import fs from 'fs'
import { isArray } from 'util';

// Arquivo de entrada
const file = './databases/cetenfolha1.1.cg'

// Arquuivo de saida
const output = './databases/saida.txt'

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

async function readFile(file) {
    return new Promise((resolve, reject) => fs.readFile(file, 'utf8', (err, content) =>
        err ? reject(err) : resolve(content)
    ))
}

async function writeFile(name, content) {
    return new Promise((resolve, reject) => fs.writeFile(name, content, (err, content) =>
        err ? reject(err) : resolve(content)
    ))
}

function fixCoin(coin, name) {
    return text => {

    }
}



/**
 *
 *
 * @param {String} text
 */
function sanitize(text) {
    text = text.toLowerCase()
    removeStrings
        .map(val => isArray(val) ? val : [val, ''])
        .forEach(([word, replace]) => text = text.replace(new RegExp(word, 'g'), replace))

    let newSentenses = []

    let sentenses = text
        .split("\n")
        .map(v => v.trim())
        .filter(val => val && !val.startsWith('<ext') && !val.startsWith('</ext') && !val.startsWith('<a'))

    sentenses = sentenses.map(s => {
        if (s.search(/\(/g) !== -1 && s.search(/\)/g) !== -1) {
            let [a, temp] = s.split('(')
            let [c, b] = temp.split(')')

            newSentenses.push(c.trim())
            return a.trim() + ' ' + b.trim()
        }
        return s
    })

    sentenses = [...sentenses, ...newSentenses].map(v => v.trim()).filter(v => v)

    text = sentenses.join("\n")
    return text
}

async function main() {
    console.log(`Reading '${file}' ...`)
    let content = await readFile(file)
    console.log('done!')
    console.log('Parsing file')
    content = sanitize(content)
    // console.log(content)
    // console.log('OK')
    console.log('done!')
    console.log(`Writing output in '${output}'...`)
    await writeFile(output, content)
    console.log('done!')
}

main();
