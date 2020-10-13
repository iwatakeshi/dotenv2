import { config } from '../'
import fs from 'fs'

describe('config', () => {
  let mock = jest.spyOn(fs, 'readFileSync')

  beforeEach(() => {
    mock = jest.spyOn(fs, 'readFileSync')
    mock.mockReturnValue('test=foo')
  })

  afterEach(() => {
    mock.mockRestore()
  })

  test('takes option for path', () => {
    const path = 'tests/.env'
    config({ path })
    expect(mock.mock.calls[mock.mock.calls.length - 1][0]).toEqual(path)
  })

  test('takes option for encoding', () => {
    const encoding = 'latin1'
    config({ encoding })
    expect(mock.mock.calls[mock.mock.calls.length - 1][1]).toEqual({ encoding })
  })

  test('takes options for debug', () => {
    const logMock = jest.spyOn(console, 'log')
    config({ debug: true })
    expect(logMock).toHaveBeenCalled()
    logMock.mockRestore()
  })

  test('reads path with encoding, parsing out process.env', () => {
    const env = config()
    expect(env).toStrictEqual({ test: 'foo' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  test('does not overwrite keys already in process.env', () => {
    const existing = 'bar'
    process.env.test = existing
    const env = config() as Record<string, string>
    expect(env?.test).toStrictEqual('foo')
    expect(process.env.test).toEqual(existing)
  })

  test('does not write over keys already in process.env if the key has a falsy value', () => {
    const existing = ''
    process.env.test = existing
    // 'foo' returned as value in `beforeEach`. should keep this ''
    const env = config()
    expect(env?.test).toEqual('foo')
    expect(process.env.test).toBeFalsy()
  })

  test('returns parsed object', () => {
    const env = config()
    expect(env?.error).toBeFalsy()
    expect(env).toEqual({ test: 'foo' })
  })

  test('returns error thrown from reading or parsing', () => {
    mock.mockImplementation(() => {
      throw Error('')
    })
    const env = config()
    expect(env?.error).toBeDefined()
  })
})
