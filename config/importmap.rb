pin "@rails/request.js"
pin "@rails/actioncable", to: "actioncable.esm.js"
pin "@rails/activestorage", to: "activestorage.esm.js"
pin "@hotwired/turbo-rails", to: "turbo.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin "qz-tray" # @2.2.4

pin_all_from "app/javascript/utils", under: "utils"
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "vendor/assets/javascripts"

pin "application", preload: true

# Use libraries available via the asset pipeline (locally or via gems).

# Use libraries directly from JavaScript CDNs (see https://www.skypack.dev, https://esm.sh, https://www.jsdelivr.com/esm)
# pin "vue", to: "https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js"
# pin "d3", to: "https://esm.sh/d3?bundle"

# Pin vendored modules by first adding the following to app/assets/config/manifest.js:
# //= link_tree ../../../vendor/assets/javascripts .js
pin "jsrsasign" # @11.1.0
pin "buffer" # @2.0.1
