import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  submit(event) {
    event.preventDefault()

    this.element.requestSubmit()
  }

  submitOnEnter(event) {
    event.preventDefault()
    this.element.requestSubmit()
    event.target.value = ""
  }
}
