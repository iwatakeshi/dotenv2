describe('dotenv', () => {
  test('export lexer', async () => {
    const lexer = (await import('../')).lexer
    expect(lexer).toBeDefined()
  })

  test('export parser', async () => {
    const parser = (await import('../')).parser
    expect(parser).toBeDefined()
  })

  test('export config', async () => {
    const config = (await import('../')).lexer
    expect(config).toBeDefined()
  })

  test('export cli', async () => {
    const cli = (await import('../')).cli
    expect(cli).toBeDefined()
  })

  test('export options', async () => {
    const options = (await import('../')).options
    expect(options).toBeDefined()
  })
})
