import deepmerge from 'deepmerge'
import { create } from '@rdecojs/core'

create('myModule', () => ({
  myDeepmerge(base, config, resolve) {
    resolve(
      deepmerge(base, config, {
        arrayMerge(target, source) {
          return source
        },
      })
    )
  },
}))
