import { Application } from "@hotwired/stimulus"
import * as ActionCable from '@rails/actioncable'

const application = Application.start()

// Configure Stimulus development experience
application.debug = true
window.Stimulus   = application
ActionCable.logger.enabled = true

export { application }
