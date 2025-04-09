const format = (url, options) => {
  if (!options) return url

  const params = Object.keys(options).filter((item) => item !== "format")
  params.forEach((param) => {
    url = url.replace(`:${param}`, options[param])
  })

  return `${url}${options.format ? `.${options.format}` : ""}`
}

const routes = {
  orderSetDone: (options) => format("/displays/:displayId/orders/:orderId/set_done", options),
  orderChangePriority: (options) => format("/displays/:displayId/orders/:orderId/change_priority?direction=:direction", options),
  orderRecall: (options) => format("/displays/:displayId/orders/recall", options),
  saveSettingsPath: (options) => format("/settings/save", options)
}

export const useRoutes = (controller) => {
  Object.assign(controller, { routes })
}
