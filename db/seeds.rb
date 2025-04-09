Dir[Rails.root.join('db/seeds/*.rb')].each { |seed| load seed }
