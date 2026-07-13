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

test('Visual route metadata and structured data describe only the Visual portfolio', () => {
  const html = readText('frontend', 'visual', 'index.html')
  const expectedTitle = 'José Carter — Visual Computing, Real-Time 3D & Simulation'
  const expectedDescription =
    'José Carter builds real-time 3D tools, scientific visualization, simulation, and spatial computing systems.'
  const canonicalLinks = tags(html, 'link').filter(
    (tag) => attribute(tag, 'rel') === 'canonical',
  )

  assert.deepEqual(html.match(/<title>[^<]*<\/title>/gi) ?? [], [`<title>${expectedTitle}</title>`])
  assert.equal(attribute(singleMeta(html, 'name', 'description'), 'content'), expectedDescription)
  assert.equal(canonicalLinks.length, 1)
  assert.equal(attribute(canonicalLinks[0], 'href'), 'https://josecarter.dev/visual')
  assert.equal(attribute(singleMeta(html, 'property', 'og:title'), 'content'), expectedTitle)
  assert.equal(
    attribute(singleMeta(html, 'property', 'og:description'), 'content'),
    expectedDescription,
  )
  assert.equal(attribute(singleMeta(html, 'property', 'og:url'), 'content'), 'https://josecarter.dev/visual')
  assert.equal(
    attribute(singleMeta(html, 'property', 'og:image'), 'content'),
    'https://josecarter.dev/og-jose-carter.png',
  )
  assert.equal(attribute(singleMeta(html, 'property', 'og:image:width'), 'content'), '1200')
  assert.equal(attribute(singleMeta(html, 'property', 'og:image:height'), 'content'), '630')
  assert.equal(attribute(singleMeta(html, 'name', 'twitter:card'), 'content'), 'summary_large_image')

  const scripts = [
    ...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi),
  ]
  assert.equal(scripts.length, 1)
  const structuredData = JSON.parse(scripts[0][1])
  assert.equal(structuredData['@context'], 'https://schema.org')
  assert.deepEqual(
    structuredData['@graph'].map((entity) => entity['@type']),
    ['ProfilePage', 'Person'],
  )
  const [profilePage, person] = structuredData['@graph']
  assert.equal(profilePage.url, 'https://josecarter.dev/visual')
  assert.deepEqual(profilePage.mainEntity, { '@id': 'https://josecarter.dev/#person' })
  assert.equal(person.name, 'José Carter Arriagada')
  assert.equal(person.url, 'https://josecarter.dev/')
  assert.equal(person.jobTitle, 'Software Engineer and Visual Computing Developer')
  assert.doesNotMatch(JSON.stringify(structuredData), /birthDate|telephone|streetAddress|document|RUN/i)
})

test('both static entries keep useful, reciprocal, high-contrast no-JavaScript fallbacks', () => {
  const entries = [
    {
      html: readText('frontend', 'index.html'),
      reciprocalHref: '/visual',
    },
    {
      html: readText('frontend', 'visual', 'index.html'),
      reciprocalHref: '/',
    },
  ]

  for (const { html, reciprocalHref } of entries) {
    const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/i)?.[1] ?? ''
    assert.notEqual(fallback, '')
    assert.match(fallback, new RegExp(`href=["']${reciprocalHref.replace('/', '\\/')}["']`, 'i'))
    assert.match(fallback, /href=["']mailto:/i)
    assert.match(fallback, /href=["']\/Jose_Carter_CV_Eng\.pdf["']/i)
    assert.match(fallback, /background:\s*#090909/i)
    assert.match(fallback, /color:\s*#f8f5ec/i)
  }
})

test('frontend build externalizes fonts and does not publish source maps', () => {
  const buildCommand =
    process.platform === 'win32'
      ? { executable: 'cmd.exe', arguments: ['/d', '/s', '/c', 'npm run build'] }
      : { executable: 'npm', arguments: ['run', 'build'] }
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
    build: {
      builder: 'RAILPACK',
    },
    deploy: {
      startCommand: 'npm run start',
      healthcheckPath: '/api/health',
      healthcheckTimeout: 100,
    },
  })
  assert.doesNotMatch(JSON.stringify(railway), /token|secret|projectId|serviceId/i)
})

test('native npm workspace owns the modern dual-entry frontend', () => {
  const rootPackage = readJson('package.json')
  const frontendPackage = readJson('frontend', 'package.json')
  const backendPackage = readJson('backend', 'package.json')
  const visualHtmlPath = fromRoot('frontend', 'visual', 'index.html')

  assert.deepEqual(rootPackage.workspaces, ['frontend', 'backend'])
  assert.equal(rootPackage.engines.node, '24.x')
  assert.equal(existsSync(fromRoot('package-lock.json')), true)
  assert.equal(existsSync(fromRoot('yarn.lock')), false)
  assert.equal(existsSync(fromRoot('frontend', 'yarn.lock')), false)
  assert.equal(existsSync(fromRoot('frontend', 'package-lock.json')), false)
  assert.equal(existsSync(fromRoot('backend', 'yarn.lock')), false)
  assert.equal(
    [rootPackage, frontendPackage, backendPackage].some((packageJson) =>
      Object.values(packageJson.scripts).some((script) => /\byarn\b/i.test(script)),
    ),
    false,
  )

  assert.equal(frontendPackage.dependencies.react, '19.2.7')
  assert.equal(frontendPackage.dependencies['react-dom'], '19.2.7')
  assert.equal(frontendPackage.devDependencies.vite, '8.1.4')
  assert.equal(frontendPackage.devDependencies.vitest, '4.1.10')
  assert.equal(frontendPackage.devDependencies['@testing-library/react'], '16.3.2')
  assert.equal(frontendPackage.devDependencies['@testing-library/dom'], '10.4.1')
  assert.equal(frontendPackage.devDependencies['@testing-library/user-event'], '14.6.1')
  assert.equal(frontendPackage.devDependencies.jsdom, '29.1.1')

  assert.equal(existsSync(fromRoot('frontend', 'index.html')), true)
  assert.equal(existsSync(visualHtmlPath), true)
  if (existsSync(visualHtmlPath)) {
    const visualHtml = readFileSync(visualHtmlPath, 'utf8')
    assert.match(visualHtml, /<html\b[^>]*data-portfolio-mode=["']visual["']/i)
    assert.match(visualHtml, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/josecarter\.dev\/visual["']/i)
    assert.match(visualHtml, /<meta\b[^>]*property=["']og:url["'][^>]*content=["']https:\/\/josecarter\.dev\/visual["']/i)
    assert.match(visualHtml, /<script\b[^>]*src=["']\/src\/main\.tsx["']/i)
    assert.match(visualHtml, /<noscript>[\s\S]*(?:mailto:|CV)[\s\S]*<\/noscript>/i)
  }

  assert.equal(frontendPackage.scripts['type-check'], 'tsc --noEmit')
  assert.equal(
    rootPackage.scripts.test,
    'node --test scripts/production-contract.test.mjs && npm run test --workspace backend && npm run test --workspace frontend && npm run build && npm run smoke:compiled --workspace backend',
  )
  assert.equal(rootPackage.scripts.lint, 'npm run lint --workspace frontend')
  assert.equal(
    rootPackage.scripts['type-check'],
    'npm run type-check --workspace frontend && npm run type-check --workspace backend',
  )
  assert.equal(
    rootPackage.scripts.build,
    'npm run build --workspace backend && npm run build --workspace frontend',
  )
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
    'start.bat',
    'start.sh',
  ]
  const maintainedText = maintainedEntryPoints.map((filePath) => readText(filePath)).join('\n')
  assert.doesNotMatch(maintainedText, /Docker|docker-compose|nginx/i)
  assert.doesNotMatch(maintainedText, /\byarn\b/i)
  assert.doesNotMatch(maintainedText, /\bpnpm\b/i)
  assert.doesNotMatch(maintainedText, /Nixpacks/i)
  assert.match(readText('README.md'), /Railpack/)
  assert.match(readText('scripts', 'setup.js'), /majorVersion\s*!==\s*24/)
  assert.match(readText('.gitignore'), /^\.tmp-lighthouse-\*\.json$/m)
  assert.match(readText('.gitignore'), /^frontend\/vite\.config\.ts\.timestamp-\*\.mjs$/m)
})
