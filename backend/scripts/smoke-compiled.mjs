import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'
import assert from 'node:assert/strict'

const child = spawn(process.execPath, ['dist/server.js'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_ENV: 'production',
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
    const port = chunk.match(/Server running on port (\d+)/)?.[1]
    if (port) {
      clearTimeout(timeout)
      resolve(Number(port))
    }
  })

  child.once('exit', (code) => {
    clearTimeout(timeout)
    reject(new Error(`Compiled server exited before startup (code ${code}).\n${stderr}`))
  })
})

try {
  const port = await ready
  const baseUrl = `http://127.0.0.1:${port}`
  const health = await fetch(`${baseUrl}/api/health`)
  const software = await fetch(`${baseUrl}/`)
  const visual = await fetch(`${baseUrl}/visual`)
  const visualSocialImage = await fetch(`${baseUrl}/og-jose-carter-visual.png`)
  const visualSlash = await fetch(`${baseUrl}/visual/?source=smoke`, { redirect: 'manual' })
  const indexEntry = await fetch(`${baseUrl}/index.html`, { redirect: 'manual' })
  const missingAsset = await fetch(`${baseUrl}/assets/missing-abcdef123456.js`)

  assert.equal(health.status, 200)
  assert.equal((await health.json()).status, 'OK')
  assert.equal(software.status, 200)
  assert.match(await software.text(), /Software Engineer for AI, Data & Autonomous Systems/)
  assert.equal(visual.status, 200)
  const visualHtml = await visual.text()
  assert.match(visualHtml, /Visual Computing, Real-Time 3D & Simulation/)
  assert.match(visualHtml, /og-jose-carter-visual\.png/)
  assert.equal(visualSocialImage.status, 200)
  assert.equal(visualSocialImage.headers.get('content-type'), 'image/png')
  assert.equal(
    visualSocialImage.headers.get('cache-control'),
    'public, max-age=86400, must-revalidate',
  )
  assert.equal(visualSlash.status, 308)
  assert.equal(visualSlash.headers.get('location'), '/visual?source=smoke')
  assert.equal(indexEntry.status, 308)
  assert.equal(indexEntry.headers.get('location'), '/')
  assert.equal(missingAsset.status, 404)
  assert.equal(await missingAsset.text(), 'Resource not found.')

  console.log('Compiled production HTTP smoke passed')
} finally {
  if (child.exitCode === null) {
    child.kill()
    await Promise.race([once(child, 'exit'), delay(2000, undefined, { ref: false })])
  }
}
