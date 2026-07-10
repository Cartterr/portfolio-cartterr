import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fromRoot = (...segments) => path.join(rootDirectory, ...segments)
const readText = (...segments) => readFileSync(fromRoot(...segments), 'utf8')
const readJson = (...segments) => JSON.parse(readText(...segments))

function tags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? []
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))?.[1]
}

function singleMeta(html, attributeName, attributeValue) {
  const matches = tags(html, 'meta').filter(
    (tag) => attribute(tag, attributeName) === attributeValue,
  )
  assert.equal(matches.length, 1, `expected exactly one ${attributeName}="${attributeValue}" meta`)
  return matches[0]
}

function sha256(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

test('portfolio metadata uses one aligned canonical identity and real social assets', () => {
  const html = readText('frontend', 'index.html')
  const expectedTitle = 'José Carter — Software Engineer for AI, Data & Autonomous Systems'
  const expectedDescription =
    'José Carter builds production software, AI and data infrastructure, scientific computing platforms, and autonomous systems.'
  const expectedSocialImage = 'https://josecarter.dev/og-jose-carter.png'
  const titleMatches = html.match(/<title>[^<]*<\/title>/gi) ?? []
  const canonicalLinks = tags(html, 'link').filter(
    (tag) => attribute(tag, 'rel') === 'canonical',
  )

  assert.deepEqual(titleMatches, [`<title>${expectedTitle}</title>`])
  assert.equal(attribute(singleMeta(html, 'name', 'description'), 'content'), expectedDescription)
  assert.equal(canonicalLinks.length, 1)
  assert.equal(attribute(canonicalLinks[0], 'href'), 'https://josecarter.dev/')
  assert.equal(attribute(singleMeta(html, 'property', 'og:title'), 'content'), expectedTitle)
  assert.equal(
    attribute(singleMeta(html, 'property', 'og:description'), 'content'),
    expectedDescription,
  )
  assert.equal(attribute(singleMeta(html, 'property', 'og:image'), 'content'), expectedSocialImage)
  assert.equal(attribute(singleMeta(html, 'property', 'og:image:width'), 'content'), '1200')
  assert.equal(attribute(singleMeta(html, 'property', 'og:image:height'), 'content'), '630')
  assert.equal(attribute(singleMeta(html, 'name', 'twitter:card'), 'content'), 'summary_large_image')
  assert.equal(attribute(singleMeta(html, 'name', 'twitter:image'), 'content'), expectedSocialImage)
  assert.equal(attribute(singleMeta(html, 'name', 'robots'), 'content'), 'max-image-preview:large')
  assert.doesNotMatch(html, /data:image|og-preview\.svg|(?:href|content)=["'][^"']+\.svg/i)

  const icon = tags(html, 'link').filter((tag) => attribute(tag, 'rel') === 'icon')
  const touchIcon = tags(html, 'link').filter(
    (tag) => attribute(tag, 'rel') === 'apple-touch-icon',
  )
  assert.equal(icon.length, 1)
  assert.equal(attribute(icon[0], 'href'), '/favicon.webp')
  assert.equal(touchIcon.length, 1)
  assert.equal(attribute(touchIcon[0], 'href'), '/apple-touch-icon.png')

  const socialImage = readFileSync(fromRoot('frontend', 'public', 'og-jose-carter.png'))
  assert.equal(socialImage.readUInt32BE(16), 1200)
  assert.equal(socialImage.readUInt32BE(20), 630)
  assert.equal(
    sha256(fromRoot('frontend', 'public', 'favicon.webp')),
    sha256(fromRoot('frontend', 'src', 'assets', 'images', 'optimized', 'brand-avatar.webp')),
  )
  const touchIconPath = fromRoot('frontend', 'public', 'apple-touch-icon.png')
  assert.equal(existsSync(touchIconPath), true)
  if (existsSync(touchIconPath)) {
    const touchIconPng = readFileSync(touchIconPath)
    assert.equal(touchIconPng.toString('ascii', 1, 4), 'PNG')
    assert.equal(touchIconPng.readUInt32BE(16), 160)
    assert.equal(touchIconPng.readUInt32BE(20), 160)
  }
})

test('frontend build externalizes fonts and does not publish source maps', () => {
  const buildCommand =
    process.platform === 'win32'
      ? { executable: 'cmd.exe', arguments: ['/d', '/s', '/c', 'yarn build'] }
      : { executable: 'yarn', arguments: ['build'] }
  const build = spawnSync(buildCommand.executable, buildCommand.arguments, {
    cwd: fromRoot('frontend'),
    encoding: 'utf8',
    env: process.env,
  })
  assert.equal(build.status, 0, `${build.error ?? ''}\n${build.stdout}\n${build.stderr}`)

  const assetsDirectory = fromRoot('frontend', 'dist', 'assets')
  const assetNames = readdirSync(assetsDirectory)
  const builtCss = assetNames
    .filter((assetName) => assetName.endsWith('.css'))
    .map((assetName) => readFileSync(path.join(assetsDirectory, assetName), 'utf8'))
    .join('\n')

  assert.doesNotMatch(builtCss, /data:font/i)
  assert.ok(assetNames.some((assetName) => assetName.endsWith('.woff2')))
  assert.deepEqual(assetNames.filter((assetName) => assetName.endsWith('.map')), [])
})

test('JSON-LD describes a restrained WebSite, ProfilePage, and Person graph', () => {
  const html = readText('frontend', 'index.html')
  const scripts = [
    ...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi),
  ]
  assert.equal(scripts.length, 1)

  const structuredData = JSON.parse(scripts[0][1])
  assert.equal(structuredData['@context'], 'https://schema.org')
  assert.deepEqual(
    structuredData['@graph'].map((entity) => entity['@type']),
    ['WebSite', 'ProfilePage', 'Person'],
  )

  const [website, profilePage, person] = structuredData['@graph']
  assert.equal(website.url, 'https://josecarter.dev/')
  assert.deepEqual(profilePage.mainEntity, { '@id': 'https://josecarter.dev/#person' })
  assert.equal(person.name, 'José Carter Arriagada')
  assert.equal(person.url, 'https://josecarter.dev/')
  assert.equal(person.jobTitle, 'Software Engineer')
  assert.equal(person.description, 'Software engineer building reliable AI, data, and autonomous systems.')
  assert.equal(person.homeLocation.name, 'Santiago, Chile')
  assert.equal(person.image.url, 'https://josecarter.dev/favicon.webp')
  assert.deepEqual(person.sameAs, [
    'https://github.com/Cartterr',
    'https://linkedin.com/in/jose-carter-arriagada',
  ])
  assert.doesNotMatch(JSON.stringify(structuredData), /birthDate|telephone|streetAddress|document|RUN/i)
})

test('Railway deploy contract is health-gated and contains no identifiers or secrets', () => {
  const railwayPath = fromRoot('railway.json')
  assert.equal(existsSync(railwayPath), true)
  if (!existsSync(railwayPath)) return

  const railway = readJson('railway.json')
  assert.deepEqual(railway, {
    $schema: 'https://railway.com/railway.schema.json',
    deploy: {
      startCommand: 'npm run start',
      healthcheckPath: '/api/health',
      healthcheckTimeout: 100,
    },
  })
  assert.doesNotMatch(JSON.stringify(railway), /token|secret|projectId|serviceId/i)
})

test('package managers and root scripts have one authority per workspace', () => {
  const rootPackage = readJson('package.json')
  const frontendPackage = readJson('frontend', 'package.json')
  const backendPackage = readJson('backend', 'package.json')

  assert.equal(existsSync(fromRoot('package-lock.json')), true)
  assert.equal(existsSync(fromRoot('yarn.lock')), false)
  assert.equal(existsSync(fromRoot('frontend', 'yarn.lock')), true)
  assert.equal(existsSync(fromRoot('frontend', 'package-lock.json')), false)
  assert.equal(existsSync(fromRoot('backend', 'yarn.lock')), true)
  assert.equal(
    rootPackage.devDependencies.yarn,
    '1.22.22',
    'the npm-selected Railway build must install the Yarn binary used by nested workspace scripts',
  )
  const rootLock = readJson('package-lock.json')
  assert.equal(rootLock.packages['node_modules/yarn']?.version, '1.22.22')
  assert.equal(frontendPackage.scripts['type-check'], 'tsc --noEmit')
  assert.equal(
    rootPackage.scripts.test,
    'node --test scripts/production-contract.test.mjs && npm run test:backend && npm run test:frontend',
  )
  assert.equal(rootPackage.scripts.lint, 'npm run lint:frontend')
  assert.equal(rootPackage.scripts['type-check'], 'npm run type-check:frontend && npm run type-check:backend')
  assert.equal(rootPackage.repository.url, 'https://github.com/Cartterr/portfolio-cartterr.git')
  assert.ok(!Object.keys(rootPackage.scripts).some((name) => name.startsWith('docker:')))
  assert.equal('deploy' in rootPackage.scripts, false)
  assert.ok(
    !Object.values(backendPackage.scripts).some((script) => /rm -rf|mkdir -p/i.test(script)),
  )
})

test('development uses the Vite API proxy without obsolete public environment exports', () => {
  const viteEnvironmentTypes = readText('frontend', 'vite-env.d.ts').trim()
  const windowsStart = readText('start.bat')
  const shellStart = readText('start.sh')
  const viteConfig = readText('frontend', 'vite.config.ts')

  assert.equal(viteEnvironmentTypes, '/// <reference types="vite/client" />')
  assert.doesNotMatch(windowsStart, /VITE_API_URL/)
  assert.doesNotMatch(shellStart, /VITE_API_URL/)
  assert.match(viteConfig, /['"]\/api['"]\s*:\s*\{[\s\S]*target:\s*['"]http:\/\/localhost:5000['"]/)
})

test('obsolete container and deploy artifacts are absent', () => {
  const obsoleteFiles = [
    'docker-compose.yml',
    'docker-compose.dev.yml',
    'nginx.conf',
    'frontend/Dockerfile',
    'frontend/Dockerfile.dev',
    'frontend/nginx.conf',
    'backend/Dockerfile',
    'backend/Dockerfile.dev',
    'scripts/deploy.js',
    'frontend/public/og-preview.svg',
    'index.html',
    '.tmp-lighthouse-before.json',
    '.tmp-lighthouse-desktop-after.json',
    '.tmp-lighthouse-mobile-after.json',
    '.tmp-lighthouse-mobile-before.json',
    '.tmp-lighthouse-mobile-final.json',
  ]

  assert.deepEqual(
    obsoleteFiles.filter((filePath) => existsSync(fromRoot(...filePath.split('/')))),
    [],
  )

  const maintainedEntryPoints = [
    'README.md',
    'package.json',
    'scripts/setup.js',
    'setup.bat',
    'setup.sh',
  ]
  const maintainedText = maintainedEntryPoints.map((filePath) => readText(filePath)).join('\n')
  assert.doesNotMatch(maintainedText, /Docker|docker-compose|nginx/i)
  assert.match(readText('.gitignore'), /^\.tmp-lighthouse-\*\.json$/m)
  assert.match(readText('.gitignore'), /^frontend\/vite\.config\.ts\.timestamp-\*\.mjs$/m)
})
