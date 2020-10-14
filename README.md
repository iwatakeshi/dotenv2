# dotenv2

Load environment variables with ease.

Dotenv is a library similar to [motdotla's Dotenv](https://github.com/motdotla/dotenv). However, this library supports multiline strings and the `export` reserved word. In addition, this library is a little stricter in that the enviroment key-pair must be consistent since it uses a handwritten lexer and parser.

## Usage

## Install

```bash
# with npm
npm install dotenv2

# or with Yarn
yarn add dotenv2
```

## Usage

As early as possible in your application, require and configure dotenv.

```javascript
import 'dotenv2/config'
// or
import { config } from 'dotenv2'
config()
```

Create a `.env` file in the root directory of your project. Add
environment-specific variables on new lines in the form of `NAME=VALUE`.
For example:

```sh
export DB_HOST=localhost
export DB_USER=root
export DB_PASS=s1mpl3
```

`process.env` now has the keys and values you defined in your `.env` file.

```javascript
import db from 'db'

db.connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
})
```

### Preload

You can use the `--require` (`-r`) [command line option](https://nodejs.org/api/cli.html#cli_r_require_module) to preload dotenv. By doing this, you do not need to require and load dotenv in your application code. This is the preferred approach when using `import` instead of `require`.

```bash
$ node -r dotenv2/config your_script.js
```

The configuration options below are supported as command line arguments in the format `dotenv_config_<option>=value`

```bash
$ node -r dotenv2/config your_script.js dotenv_config_path=/custom/path/to/.env
```

Additionally, you can use environment variables to set configuration options. Command line arguments will precede these.

```bash
$ DOTENV_CONFIG_<OPTION>=value node -r dotenv2/config your_script.js
```

```bash
$ DOTENV_CONFIG_ENCODING=latin1 node -r dotenv2/config your_script.js dotenv_config_path=/custom/path/to/.env
```

## Config

`config` will read your `.env` file, parse the contents, assign it to
[`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env),
and return an Object with a `parsed` key containing the loaded content or an `error` key if it failed.

```ts
const result = config()

if (result.error) {
  throw result.error
}

console.log(result)
```

You can additionally, pass options to `config`.

### Options

#### Path

Default: `path.resolve(process.cwd(), '.env')`

You may specify a custom path if your file containing environment variables is located elsewhere.

```ts
config({ path: '/custom/path/to/.env' })
```

#### Encoding

Default: `utf8`

You may specify the encoding of your file containing environment variables.

```ts
config({ encoding: 'latin1' })
```

#### Debug

Default: `false`

You may turn on logging to help debug why certain keys or values are not being set as you expect.

```ts
config({ debug: process.env.DEBUG })
```

## Lexer and Parser

The engine which scans and parses the contents of your file containing environment
variables is available to use. It accepts a string and will return
an Object with the parsed keys and values.

```ts
import { lexer, parser } from 'dotenv2'

const tokens = lexer('BASIC=basic').scan()
const env = parser(tokens).parse() // will return an object

console.log(typeof env, env) // object { BASIC : 'basic' }
```

### Rules

The parsing engine currently supports the following rules:

- `export BASIC=basic` becomes `{BASIC: 'basic'}`
- `BASIC=basic` becomes `{BASIC: 'basic'}`
- empty lines are skipped
- lines beginning with `#` are treated as comments
- empty values **are not allowed**
- inner quotes **are not supported**
- whitespace is removed from both ends of unquoted values (see more on [`trim`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)) (`FOO= some value ` becomes `{FOO: 'some value'}`)
- single and double quoted values maintain whitespace from both ends (`FOO=" some value "` becomes `{FOO: ' some value '}`)
- double quoted values expand new lines (`MULTILINE="new\nline"` becomes

```
{MULTILINE: 'new\nline'}
```
