import { parse } from '../src/cli'
describe('cli', () => {
  test('match encoding option', () => {
    expect(
      parse([
        'node',
        '-e',
        "'console.log(testing)'",
        'dotenv_config_encoding=utf8',
      ])
    ).toEqual({ encoding: 'utf8' })
  })

  test('match path option', () => {
    expect(
      parse([
        'node',
        '-e',
        "'console.log(testing)'",
        'dotenv_config_path=/custom/path/to/your/env/vars',
      ])
    ).toEqual({ path: '/custom/path/to/your/env/vars' })
  })

  test('match debug option', () => {
    expect(
      parse([
        'node',
        '-e',
        "'console.log(testing)'",
        'dotenv_config_debug=true',
      ])
    ).toEqual({ debug: 'true' })
  })

  test('ignore empty values', () => {
    expect(
      parse(['node', '-e', "'console.log(testing)'", 'dotenv_config_path='])
    ).toEqual({})
  })

  test('ignore unsupported options', () => {
    expect(
      parse(['node', '-e', "'console.log(testing)'", 'dotenv_config_foo=bar'])
    ).toEqual({})
  })
})
