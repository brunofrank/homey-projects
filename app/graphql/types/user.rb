module Types
  class User < GraphQL::Schema::Object
    description 'A user'

    implements GraphQL::Types::Relay::Node

    global_id_field :id

    # Fields
    field :name, String, "The user's full name", null: false
    field :email, String, "The user's email address", null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, 'The timestamp when the deal was created', null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, 'The timestamp when the deal was last updated', null: true
  end
end
