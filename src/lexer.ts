import Token, { TokenType } from './token'
import { platform } from 'os'
const lexer = (source: string) => {
  // Make sure to use unix style newlines
  if (platform() === 'win32') {
    source = source.replace(/\r\n/gi, '\n')
  }

  // Keep track of the current position
  let position = 0
  // Keep track of the line position
  let line = 1
  // Keep track of a lexeme's starting position
  let start = 0
  // Store the tokens
  const tokens: Token[] = []

  /** Determines if the stream has ended */
  const ended = () => position >= source.length
  /** Returns the next character from the source string */
  const next = () => {
    position++
    return source.charAt(position - 1)
  }
  /** Peeks into the source string by `n`. Default is zero. */
  const peek = (by: number = 0) => (ended() ? '\0' : source[position + by])
  /** Adds a token into the `tokens` array. */
  const addToken = (token: Token) => tokens.push(token)

  /** Determines whether the character is an alphabet. */
  const isAlpha = (char: string) => /[A-Za-z]/.test(char)
  /** Determines whether the character is a digit. */
  const isDigit = (char: string) => /[0-9]/.test(char)
  /** Determines whether the character is a special character. */
  const isSpecial = (char: string) =>
    /\=|\!|\@|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\{|\[|\}|\]|\:|\;|\<|\>|\,|\.|\~|\`|\\|\|/.test(
      char
    )
  /** Determines whether the string is a reserved word. */
  const isReserved = (string: string) => /export/.test(string)

  // Scan for strings. e.g. "..." or '...'
  const strings = () => {
    const quote = peek(-1)
    while (peek() !== quote && !ended()) {
      if (peek() === '\n') line++
      next()
    }

    if (ended()) throw new Error('Unterminated string')

    next()

    const value = source.substring(start + 1, position - 1)

    addToken({
      type: TokenType.string,
      lexeme: value,
      line,
      range: [start, position],
    })
  }

  // Scan for identifiers. e.g. my_key or MY_KEY or My_Key
  const identifiers = () => {
    // It's possible that the identifier is really a string if
    // it comes after an equal sign
    let afterEquals = tokens[tokens.length - 1]?.type === TokenType.equal
    if (afterEquals) {
      while (isAlpha(peek()) || isDigit(peek()) || isSpecial(peek())) next()
    } else {
      while (isAlpha(peek()) || peek() === '_') next()
    }

    const text = source.substring(start, position)

    let type: TokenType = afterEquals ? TokenType.string : TokenType.identifier

    if (isReserved(text)) type = TokenType.reserved

    addToken({
      type,
      lexeme: text,
      line,
      range: [start, position],
    })
  }

  // Tokenizes the input
  const tokenize = () => {
    let char = next()
    switch (char) {
      case '=':
        addToken({
          type: TokenType.equal,
          lexeme: '=',
          line,
          range: [start, position],
        })
        break
      case '"':
      case "'":
        strings()
        break
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break
      case '#':
        while (peek() !== '\n' && !ended()) next()
        break
      case '\n':
        line++
        break
      default:
        if (isDigit(char) || isAlpha(char) || isSpecial(char)) {
          identifiers()
          break
        }
        throw new Error(`Unexpected character '${char}' at line ${line}`)
    }
  }

  return {
    scan() {
      while (!ended()) {
        start = position
        tokenize()
      }
      addToken({
        type: TokenType.eof,
        line,
        range: [position, position],
      })
      return tokens
    },
  }
}

export default lexer
