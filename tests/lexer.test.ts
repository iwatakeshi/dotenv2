import lexer from '../src/lexer'
import Token, { TokenType } from '../src/token'

const tokenMap = ({ type, lexeme }: Token) => ({ type, lexeme })

describe('lexer', () => {
  test('scan and ignore comments', () => {
    expect(lexer('#This is a comment\n').scan()).toEqual([
      { type: TokenType.eof, line: 2, range: [19, 19] },
    ] as Token[])
    expect(lexer('# This is another comment\n').scan()).toEqual([
      { type: TokenType.eof, line: 2, range: [26, 26] },
    ] as Token[])
  })

  test('scan identifiers', () => {
    let identifiers = [
      'HELLO',
      'hello',
      'Hello',
      'hello_world',
      'HELLO_WORLD',
      'Hello_World',
    ]
    identifiers.forEach((id) => {
      expect(lexer(id).scan().map(tokenMap)).toContainEqual({
        type: TokenType.identifier,
        lexeme: id,
      })
    })
  })

  test('scan reserved word "export"', () => {
    expect(lexer('export').scan().map(tokenMap)).toContainEqual({
      type: TokenType.reserved,
      lexeme: 'export',
    })
  })

  test('scan "="', () => {
    expect(lexer('=').scan().map(tokenMap)).toContainEqual({
      type: TokenType.equal,
      lexeme: '=',
    })
  })

  test('scan string literals', () => {
    expect(lexer('"hello"').scan().map(tokenMap)).toContainEqual({
      type: TokenType.string,
      lexeme: 'hello',
    })
    expect(lexer(`'hello'`).scan().map(tokenMap)).toContainEqual({
      type: TokenType.string,
      lexeme: 'hello',
    })

    expect(() => lexer('"hello').scan()).toThrow()
    expect(() => lexer(`'hello`).scan()).toThrow()
  })

  test('scan multi-line string literls', () => {
    expect(
      lexer('"hello\nworld"')
        .scan()
        .map(({ type, lexeme, line }) => ({ type, lexeme, line }))
    ).toContainEqual({
      type: TokenType.string,
      line: 2,
      lexeme: 'hello\nworld',
    })
    expect(
      lexer(`'hello\nworld'`)
        .scan()
        .map(({ type, lexeme, line }) => ({ type, lexeme, line }))
    ).toContainEqual({
      type: TokenType.string,
      line: 2,
      lexeme: 'hello\nworld',
    })
  })

  test('scan single line expressions', () => {
    const line1 = lexer('export HELLO=world').scan()
    const line2 = lexer('HELLO="world"').scan()

    expect(line1).toHaveLength(5)
    expect(line2).toHaveLength(4)
    expect(line1[0]).toEqual({
      type: TokenType.reserved,
      lexeme: 'export',
      line: 1,
      range: [0, 6],
    })
    expect(line1[1]).toEqual({
      type: TokenType.identifier,
      lexeme: 'HELLO',
      line: 1,
      range: [7, 12],
    })
    expect(line1[2]).toEqual({
      type: TokenType.equal,
      lexeme: '=',
      line: 1,
      range: [12, 13],
    })
    expect(line1[3]).toEqual({
      type: TokenType.string,
      line: 1,
      lexeme: 'world',
      range: [13, 18],
    })
    expect(line1[4]).toEqual({
      type: TokenType.eof,
      line: 1,
      range: [18, 18],
    })

    expect(line2[0]).toEqual({
      type: TokenType.identifier,
      lexeme: 'HELLO',
      line: 1,
      range: [0, 5],
    })
    expect(line2[1]).toEqual({
      type: TokenType.equal,
      lexeme: '=',
      line: 1,
      range: [5, 6],
    })
    expect(line2[2]).toEqual({
      type: TokenType.string,
      line: 1,
      lexeme: 'world',
      range: [6, 13],
    })
    expect(line2[3]).toEqual({
      type: TokenType.eof,
      line: 1,
      range: [13, 13],
    })
  })

  test('scan multi-line expressions', () => {
    const result = lexer(`export hello=world
    Hello=world
    # A cool comment
    HELLO_WORLD="2%34&332@34\n834f:FJ$383"
    `)
      .scan()
      .map(tokenMap)
    expect(result[0]).toEqual({ type: TokenType.reserved, lexeme: 'export' })
    expect(result[1]).toEqual({ type: TokenType.identifier, lexeme: 'hello' })
    expect(result[2]).toEqual({ type: TokenType.equal, lexeme: '=' })
    expect(result[3]).toEqual({ type: TokenType.string, lexeme: 'world' })
    expect(result[4]).toEqual({ type: TokenType.identifier, lexeme: 'Hello' })
    expect(result[5]).toEqual({ type: TokenType.equal, lexeme: '=' })
    expect(result[6]).toEqual({ type: TokenType.string, lexeme: 'world' })
    expect(result[7]).toEqual({
      type: TokenType.identifier,
      lexeme: 'HELLO_WORLD',
    })
    expect(result[8]).toEqual({ type: TokenType.equal, lexeme: '=' })
    expect(result[9]).toEqual({
      type: TokenType.string,
      lexeme: '2%34&332@34\n834f:FJ$383',
    })
  })

  test('scan and throw an error for unknown characters', () => {
    expect(() => lexer('🤪').scan()).toThrow()
  })
})
