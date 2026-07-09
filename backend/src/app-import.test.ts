import { Server } from 'node:http'
import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

it('can be imported without opening a TCP listener', async () => {
  const listen = vi.spyOn(Server.prototype, 'listen')

  const module = await import('./app.js')

  expect(module.createApp).toBeTypeOf('function')
  expect(listen).not.toHaveBeenCalled()
})
