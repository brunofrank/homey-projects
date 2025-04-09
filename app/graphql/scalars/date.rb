module Scalars
  class Date < GraphQL::Schema::Scalar
    description "Parse yyyy-mm-dd dates into date class"

    def self.coerce_input(value, _ctx)
      ::Date.parse(value)
    end

    def self.coerce_result(value, _ctx)
      value.to_s
    end
  end
end
