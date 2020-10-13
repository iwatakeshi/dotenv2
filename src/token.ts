export default interface Token {
  /** The type of token */
  type: TokenType
  /** The string representing the token. */
  lexeme?: string
  /** The line number where the token was scanned. */
  line?: number
  /** The range of where the token was scanned. */
  range?: [number, number]
}

export enum TokenType {
  identifier = 'identifier',
  string = 'string',
  reserved = 'reserved',
  equal = 'equal',
  eof = 'eof',
}
