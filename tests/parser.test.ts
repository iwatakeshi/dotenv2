import { readFileSync } from 'fs'
import { join } from 'path'
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
      HELLO_WORLD: '2%34&332@34\n834f:FJ$383',
    })
  })

  test('parse and throw an error for invalid statement', () => {
    const tokens = lexer('export hello').scan()
    expect(() => parser(tokens).parse()).toThrow()
  })

  test('parse a real-world env file', () => {
    const tokens = lexer(
      readFileSync(join(__dirname, 'fixtures', '.env'), 'utf-8')
    ).scan()
    const env = parser(tokens).parse()
    const expected = `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgEQf6qVc/S0Aaz8EiQeWb5CUgeRo7XXhydqwSS3a7J1eHXh04eH2
Xnw33IE54A791s+7GpUpNo+XbgWup4ckJI/ypwoDBjWPJcclOboRQda2oG3+39uK
GNz2iw8yF9uY84H602AdEzBsMk5Od3+Lhd123S29QN+ndkClKUnWRriZAgMBAAEC
gYANKoX086XSnrQbd8rr9n0VWj5IYKcUE1EpvMxH2nnEaD4V27EUNMNKCpnJN+A/
xXtQpn6auV5cHg4bdwfVrHyMSnNaQTT4/01Ui5wcwTqW1/zeExG1GPVjIVUj5HY7
ErxUKqr4UhPbkNAcHpLhDi9Fq90zIxYQ8IVh+h/2mtZ9yQJBAITGtedTeAIFrt9J
Si+baJJXDeplZi4OMvtJ1u1A4YCw9tOJ+Xerkfem2S1l/q77O7BpR9PXjQ3vlSHE
eFNPFjcCQQCDWSOhJpbR//YjFMUlshIWJPPoqf4jW8qg+/2VHiGRlP0WFXpFRluf
R1NcrCEoh84jC2yi7fNZ0AcpnXoZuT+vAkBlaHcp9IAl2z1SYGF+ts1JZ5/DNCq0
Zjfd4Ol8Tx9r8LyzmB+mnK1hXldk6w93iX5vIBmx3GFpEWDvZ2UXC8JFAkB81ah+
Td3EAwCdQO1KsV5tO3uxoncOhfwkWrsdEYEYC0EqzwjhdEg6LqD1EAeHrOLm/cGn
bH3/2y4jiC726dCzAkApkcV5M7+eMKBrpaFnZ/NEx0TB0mK57zljJol6LmlLCOJR
OoJzTnbEb1vmpLhpe8R0tZGhLXoUQpFUSUDjGSnS
-----END RSA PRIVATE KEY-----`
    expect(env.PRIVATE_KEY as string).toEqual(expected)
  })
})
