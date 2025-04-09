module Scalars
  class Time < GraphQL::Schema::Scalar
    description "Time since epoch in seconds"

    def self.coerce_input(value, _ctx)
      value.blank? ? nil : ::Time.at(Float(value))
    end

    def self.coerce_result(value, _ctx)
      value.to_f
    end
  end
end
