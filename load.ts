import { config, cli, options } from './index'
;(() => {
  config(Object.assign({}, cli.parse(process.argv), options))
})()
