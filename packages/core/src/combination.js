/* eslint-disable no-undef */
import { BehaviorSubject, ReplaySubject } from 'rxjs'

let combination = {
  components: {},
  notificationSubjects: {},
  notificationSubjectsQueue: {},
  registerSubject: new BehaviorSubject(null),
  observableList: new Set(),
  subjects: {
    deps: {},
    targets: {},
    targetsProxy: {},
    targetsProxyQueue: {},
  },
  $initTargetProxy(baseSymbol) {
    if (!this.subjects.targetsProxy[baseSymbol]) {
      this.subjects.targetsProxy[baseSymbol] = new BehaviorSubject(null)
      this.subjects.targetsProxyQueue[baseSymbol] = []
    }
  },
  $setSubject(baseSymbol, store, isSingle = false) {
    if (isSingle) {
      if (!this.subjects.targets[baseSymbol]) {
        this.subjects.targets[baseSymbol] = [store]
      }
      this.$initTargetProxy(baseSymbol)
      this.subjects.targetsProxyQueue[baseSymbol] = [store]
      this.subjects.targetsProxy[baseSymbol].next(
        this.subjects.targetsProxyQueue[baseSymbol]
      )
    } else {
      if (!this.subjects.targets[baseSymbol]) {
        this.subjects.targets[baseSymbol] = []
      }
      this.$initTargetProxy(baseSymbol)
      this.subjects.targets[baseSymbol].push(store)
      this.subjects.targetsProxyQueue[baseSymbol].push(store)
      this.subjects.targetsProxy[baseSymbol].next(
        this.subjects.targetsProxyQueue[baseSymbol]
      )
    }
  },
  $remove(symbol, baseSymbol) {
    if (this.notificationSubjects[baseSymbol]) {
      this.notificationSubjects[baseSymbol] = this.notificationSubjects[
        baseSymbol
      ].filter((subject) => {
        if (subject.__symbol) {
          return subject.__symbol !== symbol
        }
      })
    }
    const rawLength = this.components[baseSymbol]
    this.components[baseSymbol] = this.components[baseSymbol].filter(
      (component) => {
        if (component.symbol) {
          return component.symbol !== symbol
        }
        return component.instance.symbol !== symbol
      }
    )
    if (this.components[baseSymbol].length > rawLength) {
      throw new Error(`${baseSymbol} 组件卸载异常`)
    }
    const rawTargetsLength = this.subjects.targets[baseSymbol]
    this.subjects.targets[baseSymbol] = this.subjects.targets[
      baseSymbol
    ].filter((target) => {
      return target.symbol !== symbol
    })
    if (this.subjects.targets[baseSymbol].length > rawTargetsLength) {
      throw new Error(`${baseSymbol} 组件监听器卸载异常`)
    }
    const rawTargetsQueueLength = this.subjects.targetsProxyQueue[baseSymbol]
    this.subjects.targetsProxyQueue[baseSymbol] =
      this.subjects.targetsProxyQueue[baseSymbol].filter((target) => {
        return target.symbol !== symbol
      })
    if (
      this.subjects.targetsProxyQueue[baseSymbol].length > rawTargetsQueueLength
    ) {
      throw new Error(`${baseSymbol} 组件监听器卸载异常`)
    }
    if (this.subjects.targetsProxyQueue[baseSymbol].length === 0) {
      this.subjects.targetsProxy[baseSymbol].next(null)
    }
  },
  $notificationSubjectsEnqueue(baseSymbol, value) {
    if (!this.notificationSubjectsQueue[baseSymbol]) {
      this.notificationSubjectsQueue[baseSymbol] = [value]
    } else {
      this.notificationSubjectsQueue[baseSymbol].push(value)
    }
  },
  $createNotificationSubject({ exports }, baseSymbol, symbol) {
    const notificationSubject = new ReplaySubject()
    notificationSubject.__symbol = symbol
    if (exports) {
      if (!this.notificationSubjects[baseSymbol]) {
        this.notificationSubjects[baseSymbol] = [notificationSubject]
      } else {
        this.notificationSubjects[baseSymbol].push(notificationSubject)
      }
    }
    if (
      this.notificationSubjectsQueue[baseSymbol] &&
      this.notificationSubjectsQueue[baseSymbol].length > 0
    ) {
      this.notificationSubjectsQueue[baseSymbol].forEach((value) => {
        notificationSubject.next(value)
      })
    }
    return {
      notificationSubject,
      notificationSubjects: this.notificationSubjects[baseSymbol],
    }
  },
  $createSubjects({ subscriber }, baseSymbol) {
    if (baseSymbol === undefined) {
      throw new Error('baseSymbol is undefined!!')
    }
    if (subscriber) {
      if (!this.subjects.deps[baseSymbol]) {
        // eslint-disable-next-line no-undef
        this.subjects.deps[baseSymbol] = new Set()
      }
      Object.keys(subscriber).forEach((observeTagetKey) => {
        this.subjects.deps[baseSymbol].add(observeTagetKey)
        this.observableList.add(observeTagetKey)
        this.$initTargetProxy(observeTagetKey)
      })
    }
    return null
  },
  $register(baseSymbol, instance) {
    if (!this.components[baseSymbol]) {
      this.components[baseSymbol] = []
    }
    this.components[baseSymbol].push({
      instance,
    })
    this.registerSubject.next({
      baseSymbol,
      instance,
    })
  },
}
if (window) {
  if (window.$$rdeco_combination) {
    combination = window.$$rdeco_combination
  } else {
    window.$$rdeco_combination = combination
  }
}

export { combination }
