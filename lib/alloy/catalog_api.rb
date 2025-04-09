module Alloy
  class CatalogApi
    ALLOY_INTEGRATION_TOKEN = ENV.fetch('ALLOY_INTEGRATION_TOKEN', nil)

    include HTTParty
    base_uri 'https://api.alloy.al'
    # debug_output $stdout

    def initialize(token)
      @token = token
    end

    def get_products
      self.class.get('/api/catalog/getproducts', headers:)
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
