module Scalars
  class Integer < GraphQL::Schema::Scalar
    graphql_name "CoercedInteger"
    description "Coerced integer (nil -> 0)"

    def self.coerce_input(value, _ctx)
      value.to_i
    end

    def self.coerce_result(value, _ctx)
      value.to_i
    end
  end
end
