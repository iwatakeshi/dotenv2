import Token, { TokenType } from './token'

const parser = (tokens: Token[]) => {
  let position = 0

  const peek = (by: number = 0) => tokens[position + by]
  const ended = () => position >= tokens.length || peek().type === TokenType.eof
  const next = () => {
    if (!ended()) position++
    return tokens[position - 1]
  }
  const error = (token: Token, message: string) =>
    new Error(
      `Could not parse ${token.type} on line ${
        token.line
      } at ${token.range?.toString()}. ${message}`
    )

  const check = (type: TokenType) => {
    if (ended()) return false
    return peek().type === type
  }

  const consume = (type: TokenType, message: string) => {
    if (check(type)) return next()
    throw error(peek(), message)
  }

  const match = (...types: TokenType[]) => {
    for (const type of types) {
      if (check(type)) {
        next()
        return true
      }
    }
    return false
  }

  return {
    parse() {
      const result: Record<string, string> = {}
      const parse = () => {
        const key = consume(TokenType.identifier, 'Expected an identifier.')
        consume(TokenType.equal, 'Expected "="')
        const value = consume(TokenType.string, 'Expected a string.')
        result[key.lexeme!] = value.lexeme!.replace(/\n|\r/g, '')
      }
      while (!ended()) {
        if (match(TokenType.reserved)) {
          parse()
        } else {
          parse()
        }
      }
      return result
    },
  }
}

export default parser
