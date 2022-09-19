/* eslint-disable no-undef */
import { AsyncSubject } from 'rxjs'
import { combination } from './combination'

export const invoke = (...args) => {
  const syncker = new AsyncSubject(null)
  const next = (value) => {
    syncker.next(value)
    syncker.complete()
  }
  const error = (err) => {
    syncker.error(err)
  }
  const inform = (targetMeta, fnKey, data, next, error) => {
    if (!Array.isArray(targetMeta)) {
      throw new Error(`${targetMeta} 不是一个数组`)
    }
    const [target] = targetMeta
    if (combination.notificationSubjects[target]) {
      combination.notificationSubjects[target].forEach(
        (notificationSubjectTarget) => {
          notificationSubjectTarget.next({
            fnKey,
            data,
            next,
            error,
          })
        }
      )
    } else {
      combination.$notificationSubjectsEnqueue(target, {
        fnKey,
        data,
        next,
        error,
      })
    }
  }
  inform(...args, next, error)
  const promise = new Promise((resolve, reject) => {
    syncker.subscribe({
      next(value) {
        resolve(value)
      },
      error(e) {
        reject(e)
      },
    })
  })
  return promise
}
