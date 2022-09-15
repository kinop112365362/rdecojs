/* eslint-disable no-undef */

import { combination } from './combination'

export class ExportsStore {
  constructor(exportsConfig) {
    this.symbol = Symbol()
    this.baseSymbol = exportsConfig.baseSymbol
    this.exports = exportsConfig.exports
    this.notificationSubject = combination.$createNotificationSubject(
      exportsConfig,
      this.baseSymbol,
      this.symbol
    ).notificationSubject
    combination.$setSubject(this.baseSymbol, this)
    combination.$register(this.baseSymbol, this)
  }
  dispose() {
    combination.$remove(this.symbol, this.baseSymbol)
  }
}
