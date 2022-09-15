/* eslint-disable no-undef */
import { ExportsStore } from './ExportsStore'

import { createExportSubscriptions } from './createSubscriptions'

function create(name, getterFunc) {
  const exports = getterFunc()
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
