export function createExportSubscriptions(store) {
  let selfSubscription = null
  if (store.exports) {
    selfSubscription = store.notificationSubject.subscribe({
      next(value) {
        if (value !== null) {
          // 代理订阅中的事件不包含 eventTargetMeta ,因为它不是一个标准的公共通道事件
          if (!store.exports[value.fnKey]) {
            throw new Error(
              `调用失败, ${store.name} 组件的 exports 上不存在 ${value.fnKey} 方法`
            )
          }
          if (value.finder) {
            if (!value.finder(store.props)) {
              /**
               * 通过 props 对比可以判断是否匹配通知规则, 不匹配则不触发订阅逻辑
               */
              return
            }
          }
          if (value.data === undefined) {
            store.exports?.[value?.fnKey]?.call(
              store,
              value.next,
              value.error,
              value.pending
            )
          } else {
            store.exports?.[value?.fnKey]?.call(
              store,
              value.data,
              value.next,
              value.error,
              value.pending
            )
          }
        }
      },
    })
  }
  return selfSubscription
}
