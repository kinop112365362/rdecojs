/* eslint-disable no-undef */
import { ExportsStore } from './ExportsStore'

import { createExportSubscriptions } from './createSubscriptions'

function create(pointFunc) {
  if (!pointFunc.name) {
    throw new TypeError(`pointFunc 不是具名函数`)
  }
  const exports = pointFunc()
  const exportsStore = new ExportsStore({
    exports,
    baseSymbol: pointFunc.name,
  })
  const selfSubscription = createExportSubscriptions(exportsStore)
  return () => {
    exportsStore.dispose()
    selfSubscription?.unsubscribe()
  }
}

export { create }
