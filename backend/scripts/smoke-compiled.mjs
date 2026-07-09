import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'

const child = spawn(process.execPath, ['dist/server.js'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_ENV: 'test',
    PORT: '0',
    SMTP_USER: '',
    SMTP_PASS: '',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let stderr = ''
child.stderr.setEncoding('utf8')
child.stderr.on('data', (chunk) => {
  stderr += chunk
})

const ready = new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('Compiled server did not start within 5 seconds')), 5000)

  child.stdout.setEncoding('utf8')
  child.stdout.on('data', (chunk) => {
    if (chunk.includes('Server running on port')) {
      clearTimeout(timeout)
      resolve()
    }
  })

  child.once('exit', (code) => {
    clearTimeout(timeout)
    reject(new Error(`Compiled server exited before startup (code ${code}).\n${stderr}`))
  })
})

try {
  await ready
  console.log('Compiled server startup smoke passed')
} finally {
  if (child.exitCode === null) {
    child.kill()
    await Promise.race([once(child, 'exit'), delay(2000, undefined, { ref: false })])
  }
}
