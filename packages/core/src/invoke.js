/* eslint-disable no-undef */
import { AsyncSubject } from 'rxjs'
import { combination } from './combination'

const inform = (targetMeta, fnKey, data, resolve, reject) => {
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
          resolve,
          reject,
        })
      }
    )
  } else {
    combination.$notificationSubjectsEnqueue(target, {
      fnKey,
      data,
      resolve,
      reject,
    })
  }
}

export const invoke = (...args) => {
  const syncker = new AsyncSubject(null)
  const resolve = (value) => {
    syncker.next(value)
    syncker.complete()
  }
  const reject = (err) => {
    syncker.error(err)
  }
  inform(...args, resolve, reject)
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
