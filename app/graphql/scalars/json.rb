module Scalars
  class Json < GraphQL::Schema::Scalar
    def self.coerce_input(json_data, _ctx)
      JSON.parse(json_data)
    end

    def self.coerce_result(json_data, _ctx)
      JSON.dump(json_data)
    end
  end
end
