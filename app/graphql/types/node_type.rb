# frozen_string_literal: true

module Types
  module NodeType
    include Types::BaseInterface
    # Add the `id` field
    include GraphQL::Types::Relay::NodeBehaviors

    # Add this to make it visible in the schema
    graphql_name "Node"
    description "An object with an ID"
  end
end
