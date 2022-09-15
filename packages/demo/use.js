import { imc } from '@rdecojs/core'

imc('myModule')
  .myDeepmerge({ a: [1, 23] }, { b: [0] })
  .then((res) => {
    console.log(res)
  })
