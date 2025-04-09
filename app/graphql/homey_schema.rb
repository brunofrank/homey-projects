# frozen_string_literal: true

class HomeySchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)

  # For batch-loading (see https://graphql-ruby.org/dataloader/overview.html)
  use GraphQL::Dataloader
  use GraphQL::Batch

  default_max_page_size 25

  # GraphQL-Ruby calls this when something goes wrong while running a query:
  def self.type_error(err, context)
    Sentry.set_extras(
      query: ctx&.query&.query_string,
      variables: ctx&.query&.variables&.to_h
    )

    super
  end

  # Union and Interface Resolution
  def self.resolve_type(abstract_type, obj, ctx)
    if Object.const_defined?("Types::#{obj.class.name.demodulize}")
      "Types::#{obj.class.name.demodulize}".constantize
    else
      "Types::#{obj.class.name}".constantize
    end
  end

  # Limit the size of incoming queries:
  max_query_string_tokens(5000)

  # Stop validating when it encounters this many errors:
  validate_max_errors(100)

  # Relay-style Object Identification:

  # Return a string UUID for `object`
  def self.id_from_object(object, type_definition, query_ctx)
    # For example, use Rails' GlobalID library (https://github.com/rails/globalid):
    object.to_gid_param
  end

  # Given a string UUID, find the object
  def self.object_from_id(global_id, query_ctx)
    # For example, use Rails' GlobalID library (https://github.com/rails/globalid):
    GlobalID.find(global_id)
  end
end
