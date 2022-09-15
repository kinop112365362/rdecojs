import { invoke } from './invoke'

/* eslint-disable no-undef */
export function imc(moduleName) {
  if (window.Proxy === undefined) {
    console.error(
      `The browser does not support Proxy and cannot use the imc API`
    )
  } else {
    return new Proxy(
      {},
      {
        get: function (target, property) {
          return new Proxy(function () {}, {
            apply: function (target, thisArg, argumentsList) {
              return invoke([moduleName], property, ...argumentsList)
            },
          })
        },
      }
    )
  }
}
