console.log('🤍 Iniciando el mejor Bot de WhatsApp...')

import yargs from 'yargs'
import cfonts from 'cfonts'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { createRequire } from 'module'
import { createInterface } from 'readline'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'

// https://stackoverflow.com/a/50052194
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname) // Bring in the ability to create the 'require' method
const { name, author } = require(join(__dirname, './package.json')) // https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/

say('Genesis', { font: 'block', align: 'center', gradient: ['blue', 'green'] })
say(`Developed By • Angel-OFC`, { font: 'console', align: 'center', gradient: ['blue', 'green'] })

var isRunning = false
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return
  isRunning = true
  let args = [join(__dirname, file), ...process.argv.slice(2)]
  say([process.argv[0], ...args].join(' '), { font: 'console', align: 'center', gradient: ['red', 'magenta'] })
  setupMaster({ exec: args[0], args: args.slice(1) })
  let p = fork()
  p.on('message', data => {
    console.log('[✅RECEIVED]', data)
    switch (data) {
      case 'reset':
        p.process.kill()
        isRunning = false
        start.apply(this, arguments)
        break
      case 'uptime':
        p.send(process.uptime())
        break
    }
  })
  p.on('exit', (_, code) => {
    isRunning = false
    console.error('[✦] Salió con el código:', code)
    if (code !== 0) return start(file)
    watchFile(args[0], () => {
      unwatchFile(args[0])
      start(file)
    })
  })
  let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
    if (!rl.listenerCount()) rl.on('line', line => {
      p.emit('message', line.trim())
    })
  // console.log(p)
}

start('main.js')




/* import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import { createInterface } from 'readline'
import yargs from 'yargs'
import chalk from 'chalk'
import { promises as fsPromises } from 'fs'
import terminalImage from 'terminal-image'

let __dirname = dirname(fileURLToPath(import.meta.url))
let require = createRequire(__dirname)
let { say } = cfonts
let rl = createInterface(process.stdin, process.stdout)
async function displayImage() {
   try {
      const imagePath = join(__dirname, 'storage','img', 'avatar_contact.png'); // Path de imagen 
      const image = await terminalImage.file(imagePath);
      console.log(image);
   } catch (error) {
      console.error('Error displaying image:', error);
   }
}
say('Genesis', {
  font: 'chrome',
  align: 'center',
  gradient: ['red', 'magenta']
})

say(`By AngelitoDev y team starcore`, {
  font: 'console',
  align: 'center',
  gradient: ['red', 'magenta']
})

var isRunning = false

async function start(files) {
  if (isRunning) return
  isRunning = true
  
  for (const file of files) {
    const currentFilePath = new URL(import.meta.url).pathname
    let args = [join(__dirname, file), ...process.argv.slice(2)]
    say([process.argv[0], ...args].join(' '), {
      font: 'console',
      align: 'center',
      gradient: ['red', 'magenta']
    })
    
    setupMaster({
      exec: args[0],
      args: args.slice(1),
    })
    
    let p = fork()
    p.on('message', data => {
      console.log('[RECEIVED]', data)
      switch (data) {
        case 'reset':
          p.process.kill()
          isRunning = false
          start(files)
          break
        case 'uptime':
          p.send(process.uptime())
          break
      }
    })
    
    p.on('exit', (_, code) => {
      isRunning = false
      console.error('Ocurrió un error inesperado:', code)
      start(files)

      if (code === 0) return
      watchFile(args[0], () => {
        unwatchFile(args[0])
        start(files)
      })
    })
    
    let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
    if (!opts['test'])
      if (!rl.listenerCount()) rl.on('line', line => {
        p.emit('message', line.trim())
      })
  }
}

start(['elaina.js']) */