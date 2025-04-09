let timeout = null

const debouncer = {
  debounce: (fn, wait) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}

export const useDebounce = (controller) => {
  Object.assign(controller, debouncer)
}
