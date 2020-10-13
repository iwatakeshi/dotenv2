import lexer from '../src/lexer'
import parser from '../src/parser'

describe('parser', () => {
  test('parse a single line statement', () => {
    const tokens = lexer('Hello=world').scan()
    const result = parser(tokens).parse()
    expect(result).toStrictEqual({ Hello: 'world' })
  })

  test('parse an exported single line statement', () => {
    const tokens = lexer('export Hello=world').scan()
    const result = parser(tokens).parse()
    expect(result).toStrictEqual({ Hello: 'world' })
  })

  test('parse a multiline statement', () => {
    const tokens = lexer(`export hello=world
    Hello=world
    # A cool comment
    HELLO_WORLD="2%34&332@34\n834f:FJ$383"
    `).scan()
    const result = parser(tokens).parse()
    expect(result).toStrictEqual({
      hello: 'world',
      Hello: 'world',
      HELLO_WORLD: '2%34&332@34834f:FJ$383',
    })
  })

  test('parse and throw an error for invalid statement', () => {
    const tokens = lexer('export hello').scan()
    expect(() => parser(tokens).parse()).toThrow()
  })
})
