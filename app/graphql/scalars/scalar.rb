module Scalars
  class Scalar < GraphQL::Schema::Scalar
    description "String or Integer value"

    def self.coerce_input(value, _ctx)
      value
    end

    def self.coerce_result(value, _ctx)
      value
    end
  end
end
