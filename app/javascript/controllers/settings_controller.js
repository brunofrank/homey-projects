import { Controller } from "@hotwired/stimulus"
import { useRoutes } from "utils/useRoutes"
import { useFetch } from "utils/useFetch"

export default class extends Controller {
  connect() {
    useRoutes(this)
    useFetch(this)
  }

  save(e) {
    const name = e.target.dataset.name
    const value = e.target.value

    this.http.post(this.routes.saveSettingsPath(), { name, value })
  }
}
