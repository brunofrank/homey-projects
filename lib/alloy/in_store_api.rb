module Alloy
  class InStoreApi
    ALLOY_INTEGRATION_TOKEN = ENV.fetch('ALLOY_INTEGRATION_TOKEN', nil)

    include HTTParty
    base_uri 'https://api.alloy.al'
    # debug_output $stdout

    def initialize(token)
      @token = token
    end

    def get_orders(created: false, production: false, cancelled: false, finished: false, done: false)
      params = {
        realizado: created,
        producao: production,
        pronto: done,
        finalizado: finished,
        cancelado: cancelled
      }

      self.class.get('/api/cardapiodigital/getorders', query: params, headers:)
    end

    def change_status(order_id)
      params = {
        pedido_ref: order_id
      }

      self.class.post('/api/cardapiodigital/changestatus', query: params, headers:)
    end

    private

    attr_accessor :token

    def headers
      {
        'Bearer' => token,
        'integrador-token' => ALLOY_INTEGRATION_TOKEN
      }
    end
  end
end
