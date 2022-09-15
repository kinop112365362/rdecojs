/* eslint-disable no-undef */
import { ExportsStore } from './ExportsStore'

import { createExportSubscriptions } from './createSubscriptions'

function create(name, pointFunc) {
  const exports = pointFunc()
  const exportsStore = new ExportsStore({
    exports,
    baseSymbol: name,
  })
  const selfSubscription = createExportSubscriptions(exportsStore)
  return () => {
    exportsStore.dispose()
    selfSubscription?.unsubscribe()
  }
}

export { create }
