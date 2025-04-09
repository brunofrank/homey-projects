import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    timeToGo: String
  }

  countDownTimmer = null

  connect() {
    this.countDownTimmer = setInterval(this.countDown.bind(this), 1000)
  }

  disconnect() {
    clearInterval(this.countDownTimmer)
  }

  countDown() {
    this.element.textContent = this.formatTime(this.getCurrentTime)
  }

  formatTime(dateTimeAndSign) {
    const sign = dateTimeAndSign[0]
    const dateTime = dateTimeAndSign[1]

    let minutes = dateTime.getMinutes()
    minutes = this.addLeadingZeros(minutes, 2)

    let seconds = dateTime.getSeconds()
    seconds = this.addLeadingZeros(seconds, 2)

    return `${sign}${minutes}:${seconds}`
  }

  get getCurrentTime() {
    const timeToGo = new Date(this.timeToGoValue)
    const now = new Date()

    if (timeToGo >= now) {
      return ['', new Date(timeToGo - now)]
    } else {
      return ['-', new Date(now - timeToGo)]
    }
  }

  addLeadingZeros(num, targetLength) {
    let numStr = num.toString()

    while (numStr.length < targetLength) {
      numStr = '0' + numStr
    }

    return numStr
  }
}
