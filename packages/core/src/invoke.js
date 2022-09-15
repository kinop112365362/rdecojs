/* eslint-disable no-undef */
import { AsyncSubject } from 'rxjs'
import { combination } from './combination'

export const invoke = (...args) => {
  const syncker = new AsyncSubject(null)
  const taskSynckey = new AsyncSubject(null)
  const pending = (taskId) => {
    taskSynckey.next(taskId)
    taskSynckey.complete()
  }
  const next = (value) => {
    syncker.next(value)
    syncker.complete()
  }
  const error = (err) => {
    syncker.error(err)
  }
  const infrom = (targetMeta, fnKey, data, next, error, pending) => {
    if (!Array.isArray(targetMeta)) {
      throw new Error(`${targetMeta} 不是一个数组`)
    }
    const [target, finder] = targetMeta
    const value = {
      type: 'invoke',
      targetMeta,
      fnKey,
      data,
    }
    combination.$record(value)
    if (combination.notificationSubjects[target]) {
      combination.notificationSubjects[target].forEach(
        (notificationSubjectTarget) => {
          notificationSubjectTarget.next({
            fnKey,
            data,
            next,
            error,
            pending,
            finder,
          })
        }
      )
    } else {
      combination.$notificationSubjectsEnqueue(target, {
        fnKey,
        data,
        next,
        error,
        pending,
        finder,
      })
    }
  }
  if (/^@@/.test(args[0])) {
    const { beforeNotify, subject } = combination.extends[args[0]]
    subject.next(beforeNotify(args[1], args[2], next, error, pending))
  } else {
    infrom(...args, next, error, pending)
  }
  const promise = new Promise((resolve, reject) => {
    const [targetMeta, fnKey] = args
    syncker.subscribe({
      next(value) {
        const info = {
          type: 'invokeSucess',
          targetMeta,
          fnKey,
          result: value,
        }
        combination.$record(info)
        resolve(value)
      },
      error(e) {
        const info = {
          type: 'invokeError',
          targetMeta,
          fnKey,
          result: e,
        }
        combination.$record(info)
        reject(e)
      },
    })
  })
  promise.__proto__.pending = (callback) => {
    taskSynckey.subscribe({
      next(taskId) {
        callback(taskId)
      },
    })
    return promise
  }
  return promise
}
