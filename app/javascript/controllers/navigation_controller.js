import { Controller } from "@hotwired/stimulus"
import { useFetch } from "utils/useFetch"
import { useRoutes } from "utils/useRoutes"
// import LabelPrint from "utils/labelPrint"

export default class extends Controller {
  static targets = ["items"]

  static values = {
    printers: Array
  }

  selected = 0
  checkSelected
  printer = null

  connect() {
    document.addEventListener("keydown", this.handleKeydown.bind(this))
    useFetch(this)
    useRoutes(this)
    //this.printer = new LabelPrint()
    //this.printer.connect()
  }

  bump() {
    const selectedOrder = this.currentOrder()
    const externalId = selectedOrder.dataset["externalId"]
    const displayId = selectedOrder.dataset["displayId"]

    if (confirm(`Bump ${externalId}?`)) {
      const orderId = selectedOrder.dataset["orderId"]

      try {
        this.print()
      } catch (e) {
        console.log(e)
      }

      this.http
        .put(this.routes.orderSetDone({ orderId, displayId }))
        .then(this.bumped.bind(this))
    }
  }

  currentOrder() {
    const currentItem = this.itemsTargets.filter((item) =>
      item.children[0].classList.contains("is-selected")
    )

    return currentItem[0]
  }

  bumped() {
    // const idx = this.itemsTargets.map((item) => item.children[0].classList.contains('is-selected')).indexOf(true)
    // this.itemsTargets[idx].remove()
  }

  print() {
    const selectedOrder = this.currentOrder()
    const labels = selectedOrder.dataset["labelsToPrint"]
    if (labels.length === 0 || labels === "") return

    // this.printersValue.forEach(printer => {
    //   this.printer.print(printer, [labels])
    // })
  }

  selectNext() {
    if (this.itemsTargets.length == 1) {
      this.selected = 0
      this.itemsTargets[0].querySelector(".panel").classList.add("is-selected")
    } else if (this.selected < this.itemsTargets.length - 1) {
      this.itemsTargets[this.selected]
        .querySelector(".panel")
        .classList.remove("is-selected")
      this.selected++
      this.itemsTargets[this.selected]
        .querySelector(".panel")
        .classList.add("is-selected")
    }
  }

  selectPrev() {
    if (this.itemsTargets.length == 1) {
      this.selected = 0
      this.itemsTargets[0].querySelector(".panel").classList.add("is-selected")
    } else if (this.selected > 0) {
      this.itemsTargets[this.selected]
        .querySelector(".panel")
        .classList.remove("is-selected")
      this.selected--
      this.itemsTargets[this.selected]
        .querySelector(".panel")
        .classList.add("is-selected")
    }
  }

  recallLastOrder() {
    if (confirm("Desfazer ultimo pedido?")) {
      const selectedOrder = this.currentOrder()
      const displayId = selectedOrder.dataset["displayId"]

      this.http
        .post(this.routes.orderRecall({ displayId }))
        .then(this.recalled.bind(this))
    }
  }

  increasePriority() {
    const selectedOrder = this.currentOrder()
    const orderId = selectedOrder.dataset["orderId"]
    const displayId = selectedOrder.dataset["displayId"]

    this.http
      .put(
        this.routes.orderChangePriority({ displayId, orderId, direction: "up" })
      )
      .then(this.priorityChanged.bind(this))
  }

  priorityChanged() {
    location.reload(true)
  }

  recalled() {
    // Order recalled
  }

  reduceTicket() {
    const selectedOrder = this.currentOrder()
    if (selectedOrder.children[0].classList.contains("reduced-1x")) {
      selectedOrder.children[0].classList.add("reduced-2x")
    } else {
      selectedOrder.children[0].classList.add("reduced-1x")
    }
  }

  handleKeydown(e) {
    switch (e.key) {
      case "Enter":
        this.bump()
        break
      case "6":
      case "ArrowRight":
        this.selectNext()
        break
      case "4":
      case "ArrowLeft":
        this.selectPrev()
        break
      case "0":
        this.recallLastOrder()
        break
      case "+":
        this.increasePriority()
        break
      case "/":
        location.reload(true)
        break
      case "-":
        this.reduceTicket()
        break
      default:
        break
    }
  }
}
