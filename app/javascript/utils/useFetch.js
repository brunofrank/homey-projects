export const getMetaValue = (name) => {
  const element = document.head.querySelector(`meta[name="${name}"]`)
  return element.getAttribute("content")
}

const toParams = (params) =>
  Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&")

const fetcher = {
  http: {
    get: (url, options) => {
      const getUrl = options ? `${url}?${toParams(options)}` : url

      return fetch(getUrl, {
        headers: {
          "X-CSRF-Token": getMetaValue("csrf-token")
        }
      })
    },

    post: (url, options) => {
      return fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getMetaValue("csrf-token")
        }
      })
    },

    put: (url, options) => {
      return fetch(url, {
        method: "PUT",
        body: JSON.stringify(options),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getMetaValue("csrf-token")
        }
      })
    },

    delete: (url, options) => {
      return fetch(url, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": getMetaValue("csrf-token")
        }
      })
    }
  }
}

export const useFetch = (controller) => {
  Object.assign(controller, fetcher)
}
