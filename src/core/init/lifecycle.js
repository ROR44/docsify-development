import { noop } from '../util/core'

export function initLifecycle (vm) {
  const hooks = [
    'init',
    'mounted',
    'beforeEach',
    'afterEach',
    'doneEach',
    'ready'
  ]

  vm._hooks = {}
  vm._lifecycle = {}
  hooks.forEach(hook => {
    const arr = vm._hooks[hook] = []
    vm._lifecycle[hook] = fn => arr.push(fn)
  })
}

export function callHook (vm, hook, data, next = noop) {
  let newData = data
  const queue = vm._hooks[hook]

  const step = function (index) {
    const hook = queue[index]
    if (index >= queue.length) {
      next(newData)
    } else {
      if (typeof hook === 'function') {
        if (hook.length === 2) {
          hook(data, result => {
            newData = result
            step(index + 1)
          })
        } else {
          const result = hook(data)
          newData = result !== undefined ? result : newData
          step(index + 1)
        }
      } else {
        step(index + 1)
      }
    }
  }

  step(0)
}
