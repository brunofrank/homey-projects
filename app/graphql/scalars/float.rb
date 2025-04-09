module Scalars
  class Float < GraphQL::Schema::Scalar
    graphql_name "CoercedFloat"
    description "Coerced float (nil -> 0.0)"

    def self.coerce_input(value, _ctx)
      value.to_f
    end

    def self.coerce_result(value, _ctx)
      value.to_f
    end
  end
end
