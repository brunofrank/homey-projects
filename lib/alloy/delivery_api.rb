module Alloy
  class DeliveryApi
    ALLOY_INTEGRATION_TOKEN = ENV.fetch('ALLOY_INTEGRATION_TOKEN', nil)

    include HTTParty
    base_uri 'https://api.alloy.al'
    debug_output $stdout

    def initialize(token)
      @token = token
    end

    def change_status(order_id)
      params = {
        pedido_ref: order_id
      }

      self.class.post('/api/delivery/changestatus', query: params, headers:)
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
