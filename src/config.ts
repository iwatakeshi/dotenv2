import { readFileSync, readFile } from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'
import lexer from './lexer'
import parser from './parser'
const read = promisify(readFile)

export type DotEnvConfigOptions = {
  /**
   * You may turn on logging to help debug why certain keys or values are not being set as you expect.
   */
  debug?: boolean
  /**
   * You may specify a custom path if your file containing environment variables is located elsewhere.
   */
  path?: string
  encoding?:
    | 'ascii'
    | 'base64'
    | 'binary'
    | 'hex'
    | 'latin1'
    | 'ucs-2'
    | 'ucs2'
    | 'utf-8'
    | 'utf8'
    | 'utf16le'
}

const config = (
  options?: DotEnvConfigOptions
): Record<string, string | Error> | undefined => {
  const path = options?.path || resolve(process.cwd(), '.env')
  const encoding = options?.encoding || 'utf8'
  const debug = options?.debug || false

  try {
    const source = readFileSync(path, { encoding }).toString()
    const tokens = lexer(source).scan()
    const parsed = parser(tokens).parse()

    if (debug) {
      console.log(`[dotenv][debug] parsed:`)
      console.log(parsed)
    }

    Object.keys(parsed).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = parsed[key]
        if (debug)
          console.log(`[dotenv][debug] process.env.${key} = ${parsed[key]}`)
      } else if (debug) {
        console.log(
          `[dotenv][warn] "${key}" is already defined in \`process.env\` and will not be overwritten`
        )
      }
    })
    return parsed
  } catch (error) {
    return { error }
  }
}

export default config
