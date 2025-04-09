import { Controller } from "@hotwired/stimulus"
import { useFetch } from "utils/useFetch"

export default class extends Controller {
  static targets = ["items", "massActionsContainer", "uniqueActions"]

  connect() {
    this.hideMassActionsContainer()
    useFetch(this)
  }

  edit(e) {
    const editUrl =
      e.target.dataset.editUrl || e.target.parentElement.dataset.editUrl

    if (editUrl) {
      Turbo.visit(editUrl)
    }
  }

  destroySelected(evt) {
    const toDelete = this.selectedItemsIds
    const destroyUrl = evt.target.dataset.destroyUrl.replace(
      ":id:",
      toDelete.join(",")
    )

    if (confirm(`Deseja realmente excluir ${toDelete.length} registros?`)) {
      this.http
        .delete(destroyUrl, { id: toDelete })
        .then((response) => response.json())
        .then(this.destroySelectedCallback.bind(this))
    }
  }

  gotToAction(evt) {
    const id = this.selectedItemsIds[0]
    const actionUrl = evt.target.dataset.actionUrl.replace(":id:", id)
    Turbo.visit(actionUrl)
  }

  destroySelectedCallback(response) {
    if (response.status === "no_permission") {
      const event = new CustomEvent("notification-event", {
        bubbles: true,
        detail: {
          msg: "Você não tem permissão para deletar!",
          type: "is-warning"
        }
      })
      this.element.dispatchEvent(event)
    } else {
      $(this.selectedItems).remove()

      const event = new CustomEvent("notification-event", {
        bubbles: true,
        detail: {
          msg: response.msg,
          type: "is-info"
        }
      })

      this.element.dispatchEvent(event)
      this.hideMassActionsContainer()
    }
  }

  itemSelect(evt) {
    if (this.selectedItems.length > 0) {
      this.showMassActionsContainer()

      if (this.selectedItems.length === 1) {
        this.showUniqueActions()
      } else {
        this.hideUniqueActions()
      }
    } else {
      this.hideMassActionsContainer()
      this.hideUniqueActions()
    }
  }

  showUniqueActions() {
    if (this.hasUniqueActionsTarget) this.uniqueActionsTarget.style.display = 'block';
  }

  hideUniqueActions() {
    if (this.hasUniqueActionsTarget) this.uniqueActionsTarget.style.display = 'none';
  }

  showMassActionsContainer() {
    console.log(this.massActionsContainerTarget)
    this.massActionsContainerTarget.style.display = 'block';
  }

  hideMassActionsContainer() {
    console.log(this.massActionsContainerTarget)
    this.massActionsContainerTarget.style.display = 'none';
  }

  get selectedItems() {
    return this.itemsTargets.filter((item) =>
      item.querySelector("input[type='checkbox']:checked")
    )
  }

  get selectedItemsIds() {
    return this.selectedItems.map(
      (item) => item.querySelector("input[type='checkbox']:checked").value
    )
  }
}
