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
MIIEpAIBAAKCAQEA2R5+9UQJc2HViBruOzfohXljqh6DgnwwILpotI369tKly8rN
CX5SrmFB3L8AJ3WeXn58ziv3BZLyf/4OA7i8NEdQ3SIYh3aOIpMZWx28vElcXGS3
9VjP88dZiMWi52yUmo2gxto1AysOkmmqT1bo27stxVf8idaT27xY+XAn7vlAW3vF
HxV7yS2O39QRU34gdi6yoT59wrvFM4TIQly7H+9g9XcO4thA/FFvdfwL+vZTdzPP
yMWe5lAWPdeOWwlwLQNeZ6eIR42Tr6kegacIj6RGE/MaehKoifIKky4e/UjI//7p
vznz/5y1L4bG3EPT82DbvVYGt4dQYQNRMvndlQIDAQABAoIBAQCtinmR0vr21akW
a+glPy/El904mcEl59uUHUsZni6NYJuSw5uVTfoKVcSOC8C0yYd3IgThyjRcqTLZ
aRiMkvkjlCknR1xx0ioTqp3mvWMg4EZJt1tuaLl2sc13y/jEn3479p4es0USLjUs
g/bUCbSABSG1jflVt0Rhqy822RWiJPEH8/6fcyDPMAAjJJtoSYQ96aDEIxRcYfiw
waMfyBLyEEu3RdkarNM93q5Io10IYaQWi0jbZ8LMdvTqcK8cFitF6fOJCRoHlQzE
7EkxSlADuOThVUXCz0b/P0MzgQTDcwSWAlRsRmM4GAkEBBxUocJyJq+31p+3WCH+
yHkanHPBAoGBAO7eh2y30XSQS1E5te14h+4pl51Fct3Ka9tCX/GiRFoN9LKnch95
C0WIqbJUj6bOwYei4Wf+tirOcvwhHMM8AwksxgE6bOf+zKLmtqDpK22wlmSM6D15
JEjTzVa2ACL0CXPa5pHzkv2EtLw1CZpH8lsp0sc+yVSTi/LBLhVpeSFFAoGBAOiw
pl+/GjuNMRUf4DBQIT6DwRbxcYizR8+J1FME4+wuKq7QrDLY+i7qC4/DIP+5FnW1
VMJQcTu0eK4t2J8at9c7fBUkIsvfpZX6bHx7w20UbS5WL38UEttco9y9nOaBmlUo
bHFQGlHpAEaGxGMSU4nm/n+MVZngWG3DDAXuWogRAoGAYHWqWGPOiHSwhYd5iQDw
W2Ohmh/uZ9QTRAKEvg4Z7gfOtcpako0N2TF73ZC6RdEeY8iJn7ZDF/wwgNJaTBjS
3QSgnORcED9bobjrLQWbzPrPcKFaM2DVHzewpwBuA69qDhianXuv8wKA/bOpQg0l
uFymSmF3adj/XbNXCbyC9sUCgYB7sVvfzeCOAdIx3o34YMArUTKVlad6uYLU6jm6
IAFhDXGXGEpRhVIJGlUnCN1D0woDbG8wFD79NARq4ugiO7u6aF6fhmQQ6ERHo6WD
zu620kLvvNTmwq77eRWKRClhx0dZOXHcEm7LWAbTdtRyrc1Go0pqVxkyATZAssxz
Yq8xYQKBgQDKhksoAAKdGdlApzPfWLBVcOmLaUmtk449LjlD5Pxxvi9T39RbN66X
G08AuMP5WrjL1YGPoHtNoB7Hl9pHtXdC1PkMaC4wKvEy0xsdK7DqqQ2xb1jLw23r
nrj6X1QSOIPNVdaELcBwQWk/Ymprb6n4Ghuoc0EzYBhykrkWcTdTSA==
-----END RSA PRIVATE KEY-----`
    expect(env.PRIVATE_KEY as string).toEqual(expected)
  })
})
