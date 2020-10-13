// warm cache
import '../src/env'

describe('env', () => {
  // preserve existing env
  const e = process.env.DOTENV_CONFIG_ENCODING
  const p = process.env.DOTENV_CONFIG_PATH
  const d = process.env.DOTENV_CONFIG_DEBUG

  afterAll(() => {
    process.env.DOTENV_CONFIG_ENCODING = e
    process.env.DOTENV_CONFIG_PATH = p
    process.env.DOTENV_CONFIG_DEBUG = d
  })

  const options = async () => {
    jest.resetModules()
    return (await import('../src/env')).default
  }

  const testOption = async (
    key: string,
    value: string,
    expected: Record<string, string>
  ) => {
    delete process.env[key]
    process.env[key] = value
    expect(await options()).toEqual(expected)
    delete process.env[key]
  }

  test('returns empty object when no option set in process.env', async () => {
    delete process.env.DOTENV_CONFIG_ENCODING
    delete process.env.DOTENV_CONFIG_PATH
    delete process.env.DOTENV_CONFIG_DEBUG
    expect(await options()).toEqual({})
  })

  test('set encoding option', () => {
    testOption('DOTENV_CONFIG_ENCODING', 'latin1', { encoding: 'latin1' })
  })

  test('set path option', () => {
    testOption('DOTENV_CONFIG_PATH', '~/.env.test', { path: '~/.env.test' })
  })

  test('set debug option', () => {
    testOption('DOTENV_CONFIG_DEBUG', 'true', { debug: 'true' })
  })
})
